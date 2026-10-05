# Пререндер и техническое SEO — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сервер отдаёт готовый HTML для всех страниц сайта, а не пустой `<div id="root">`, и сборка падает, если это перестало быть правдой.

**Architecture:** `npm run build` становится трёхпроходным: клиентская сборка Vite, серверная сборка `entry-server.jsx`, затем скрипт пререндера, который рендерит каждый маршрут через `renderToPipeableStream` и пишет статический HTML. Метатеги берутся не из отрендеренного React, а напрямую из данных — из нового модуля `src/routes.js`, который стал единым источником правды для sitemap, пререндера и проверок.

**Tech Stack:** Node 20+ (ESM), React 19.2.7, React Router 7.17.0, Vite 6.3.5. Тесты — встроенный `node:test`, новых зависимостей не добавляется.

**Spec:** `docs/superpowers/specs/2026-09-26-prerender-seo-design.md`

## Global Constraints

- Ветка `seo-prerender` от `en-version`. В `main` этого кода нет и мержить туда в рамках этой работы не требуется.
- Проект ESM: `"type": "module"` в `package.json`. Никакого `require`.
- Новых рантайм-зависимостей не добавлять. Тесты — только `node:test` и `node:assert`.
- `StaticRouter` импортируется из `react-router-dom`. Подпуть `react-router-dom/server` в React Router 7.17.0 **не существует** и выдаёт `ERR_PACKAGE_PATH_NOT_EXPORTED`.
- Язык сборки — переменная окружения `VITE_LANG`, значения `ru` (по умолчанию) и `en`.
- `enIsLive` в `src/i18n/config.js` сейчас `false` и в этой работе не меняется.
- `src/routes.js` не должен импортировать `src/i18n/index.js` или `src/data/index.js`: они читают `import.meta.env`, которого нет в голом Node, и тесты упадут. Импортировать `src/i18n/ru.js`, `src/i18n/en.js`, `src/data/articles.js`, `src/data/articles.en.js` напрямую — так же, как это уже делает `vite.config.js`.
- Домены: `https://noda-auto.com` и `https://en.noda-auto.com`, берутся из `src/i18n/config.js`.
- Коммиты — на английском, с `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.

## Review Focus

Пять условий, которые спек подразумевает, но тесты задач сами по себе не проверяли бы. Тест на каждое добавлен в задачу, владеющую кодом.

1. **Кавычки и угловые скобки в заголовке или описании статьи** попадают в `content="..."` и в JSON-LD и ломают разметку страницы. Экранирование — Task 4.
2. **Два маршрута с одинаковым path** (например, дубль слага при добавлении статьи) молча перезаписывают файл друг друга, и одна страница исчезает. Проверка — Task 1.
3. **Слаг с символом `/`, `..` или ведущим пробелом** уводит запись файла за пределы `dist/`. Проверка — Task 1.
4. **Страница короче порога в 500 символов** валит билд, хотя с ней всё в порядке. Порог проверяется на реальной самой короткой странице — Task 2.
5. **`enIsLive === true` при неподнятом поддомене** проставляет hreflang на несуществующий домен. Проверка симметрии hreflang — Task 2.

---

### Task 1: `src/routes.js` — единый источник маршрутов и метатегов

Сейчас список маршрутов зашит внутри `sitemapPlugin` в `vite.config.js`, а метатеги живут в компонентах. Выносим маршруты в отдельный модуль и добавляем к ним метатеги.

**Files:**
- Create: `src/routes.js`
- Create: `tests/routes.test.js`
- Modify: `vite.config.js` (функция `sitemapPlugin`, строки с массивом `routes`)

**Interfaces:**
- Consumes: `src/i18n/ru.js`, `src/i18n/en.js` (дефолтный экспорт со словарём, ключи `meta.*`), `src/data/articles.js` и `src/data/articles.en.js` (дефолтный экспорт — массив статей с полями `slug`, `title`, `desc`), `src/i18n/config.js` (`origins`, `enIsLive`).
- Produces: `getRoutes(lang)` — возвращает массив объектов `{ path, changefreq, priority, title, description, ogDescription, jsonLd }`, где `path` начинается со слеша, `jsonLd` — объект или `null`. Этим пользуются Task 2, 3, 4.

- [ ] **Step 1: Написать падающий тест**

Создать `tests/routes.test.js`:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { getRoutes } from '../src/routes.js'

test('маршруты покрывают статические страницы и все статьи', () => {
  const routes = getRoutes('ru')
  const paths = routes.map((r) => r.path)

  assert.ok(paths.includes('/'), 'нет лендинга')
  assert.ok(paths.includes('/blog'), 'нет блога')
  assert.ok(paths.includes('/giorgi'), 'нет страницы Георгия')
  assert.ok(paths.filter((p) => p.startsWith('/blog/')).length >= 15, 'статей меньше 15')
})

test('у каждого маршрута непустые title и description', () => {
  for (const lang of ['ru', 'en']) {
    for (const route of getRoutes(lang)) {
      assert.ok(route.title && route.title.trim().length > 0, `пустой title у ${lang}${route.path}`)
      assert.ok(
        route.description && route.description.trim().length > 0,
        `пустой description у ${lang}${route.path}`,
      )
    }
  }
})

test('пути уникальны — дубль слага перезаписал бы файл', () => {
  for (const lang of ['ru', 'en']) {
    const paths = getRoutes(lang).map((r) => r.path)
    assert.equal(new Set(paths).size, paths.length, `дубликаты путей в ${lang}`)
  }
})

test('пути безопасны для записи на диск', () => {
  const unsafe = /(\.\.|\/\/|\s)/
  for (const lang of ['ru', 'en']) {
    for (const route of getRoutes(lang)) {
      assert.ok(route.path.startsWith('/'), `путь без ведущего слеша: ${route.path}`)
      assert.ok(!unsafe.test(route.path), `небезопасный путь: ${route.path}`)
    }
  }
})

test('JSON-LD лендинга ссылается на домен своего языка', () => {
  const ruLanding = getRoutes('ru').find((r) => r.path === '/')
  const enLanding = getRoutes('en').find((r) => r.path === '/')

  assert.equal(ruLanding.jsonLd.url, 'https://noda-auto.com')
  assert.equal(enLanding.jsonLd.url, 'https://en.noda-auto.com')
})
```

- [ ] **Step 2: Запустить тест и убедиться, что он падает**

Run: `node --test tests/routes.test.js`
Expected: FAIL — `Cannot find module '../src/routes.js'`

- [ ] **Step 3: Написать `src/routes.js`**

```js
// Единый источник маршрутов и их метатегов. Читают трое: генератор sitemap
// в vite.config.js, пререндер и проверка сборки.
//
// Метатеги берутся отсюда, а не из отрендеренного React через Helmet:
// react-helmet-async 3.0.0 под React 19 уже один раз отдал пустой <title>
// на всех статьях блога, и мы потеряли на этом индекс.
//
// Импорты намеренно идут в конкретные файлы, а не в src/i18n/index.js
// и src/data/index.js: те читают import.meta.env, которого нет в Node,
// и модуль стал бы нетестируемым вне Vite.
import ru from './i18n/ru.js'
import en from './i18n/en.js'
import articlesRu from './data/articles.js'
import articlesEn from './data/articles.en.js'
import { origins } from './i18n/config.js'

const dictionaries = { ru, en }
const articlesByLang = { ru: articlesRu, en: articlesEn }

export function getRoutes(lang) {
  const t = dictionaries[lang]
  const articles = articlesByLang[lang]
  const origin = origins[lang]

  const landing = {
    path: '/',
    changefreq: 'weekly',
    priority: '1.0',
    title: t.meta.siteTitle,
    description: t.meta.siteDesc,
    ogDescription: t.meta.ogDesc,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'NODA',
      url: origin,
      description: t.meta.orgDesc,
      contactPoint: {
        '@type': 'ContactPoint',
        url: 'https://t.me/BlueFaceBaby99',
        contactType: 'customer service',
      },
    },
  }

  const blog = {
    path: '/blog',
    changefreq: 'weekly',
    priority: '0.9',
    title: t.meta.blogTitle,
    description: t.meta.blogDesc,
    ogDescription: t.meta.blogOgDesc,
    jsonLd: null,
  }

  const giorgi = {
    path: '/giorgi',
    changefreq: 'monthly',
    priority: '0.5',
    title: t.meta.giorgiTitle,
    description: t.meta.giorgiDesc,
    ogDescription: t.meta.giorgiOgDesc,
    jsonLd: null,
  }

  const articleRoutes = articles.map((a) => ({
    path: `/blog/${a.slug}`,
    changefreq: 'monthly',
    priority: '0.8',
    title: `${a.title} — NODA`,
    description: a.desc,
    ogDescription: a.desc,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      url: `${origin}/blog/${a.slug}`,
      headline: a.title,
      description: a.desc,
      author: { '@type': 'Organization', name: 'NODA' },
      publisher: { '@type': 'Organization', name: 'NODA' },
    },
  }))

  return [landing, blog, ...articleRoutes, giorgi]
}
```

- [ ] **Step 4: Запустить тест и убедиться, что он проходит**

Run: `node --test tests/routes.test.js`
Expected: PASS, 5 тестов

- [ ] **Step 5: Зафиксировать текущий sitemap до рефакторинга**

Сборка сейчас работает — сохраняем эталон, чтобы доказать, что вынос маршрутов ничего не сломал.

```bash
npm ci
npm run build
cp dist/sitemap.xml /tmp/sitemap-before.xml
```

- [ ] **Step 6: Переключить `sitemapPlugin` на `getRoutes`**

В `vite.config.js` добавить импорт рядом с остальными:

```js
import { getRoutes } from './src/routes.js'
```

Удалить импорт `articles` (он больше не нужен) и заменить внутри `sitemapPlugin` объявление массива `routes`:

```js
  const routes = getRoutes(lang)
```

Остальное тело функции не трогать: поля `path`, `changefreq` и `priority` у объектов те же, что были.

- [ ] **Step 7: Доказать, что sitemap не изменился**

```bash
npm run build
diff /tmp/sitemap-before.xml dist/sitemap.xml && echo "sitemap идентичен"
```

Expected: вывод `sitemap идентичен`, diff пуст.

- [ ] **Step 8: Коммит**

```bash
git add src/routes.js tests/routes.test.js vite.config.js
git commit -m "Extract routes and their meta tags into a single module

Sitemap, prerendering and the build check all need the same list.
Meta tags come from data rather than from rendered React, because
react-helmet-async already emitted empty titles once under React 19.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: `scripts/verify-prerender.js` — проверка, которая падает на текущем состоянии

Проверка пишется до пререндера намеренно: на текущей сборке она обязана упасть, и это доказывает, что проблема реальна и что проверка её видит.

**Files:**
- Create: `scripts/verify-prerender.js`
- Modify: `package.json` (блок `scripts`)

**Interfaces:**
- Consumes: `getRoutes(lang)` из Task 1; каталог сборки `dist/` или `dist-en/`.
- Produces: исполняемый скрипт, выходящий с кодом 1 при любой непройденной проверке. Используется в Task 4 как последний шаг сборки.

- [ ] **Step 1: Написать проверку**

Создать `scripts/verify-prerender.js`:

```js
// Проверяет артефакт сборки, а не функции: после пререндера каждая страница
// обязана быть готовым документом. Падение здесь означает, что на прод
// уезжает сборка, которую поисковик увидит пустой.
//
// Пункты 1 и 2 — прямая защита от августовских багов: пустых заголовков
// и двух canonical, из-за которых 13 из 18 страниц выпали из индекса.
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { getRoutes } from '../src/routes.js'
import { origins, enIsLive } from '../src/i18n/config.js'

const lang = process.env.VITE_LANG === 'en' ? 'en' : 'ru'
const outDir = lang === 'en' ? 'dist-en' : 'dist'
const origin = origins[lang]

// Порог подобран по самой короткой реальной странице проекта с запасом вдвое.
// Если однажды появится страница короче — поднимать надо не порог, а страницу.
const MIN_BODY_TEXT = 500

const errors = []

function fail(where, message) {
  errors.push(`${where}: ${message}`)
}

function fileFor(path) {
  return path === '/' ? join(outDir, 'index.html') : join(outDir, path.slice(1), 'index.html')
}

function textLength(html) {
  const body = html.slice(html.indexOf('<body'))
  return body
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim().length
}

const routes = getRoutes(lang)

for (const route of routes) {
  const file = fileFor(route.path)

  if (!existsSync(file)) {
    fail(route.path, `файл не сгенерирован: ${file}`)
    continue
  }

  const html = readFileSync(file, 'utf8')

  // 1. Непустой title, совпадающий с объявленным в routes.js
  const titles = [...html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/g)].map((m) => m[1].trim())
  if (titles.length === 0 || titles[0].length === 0) {
    fail(route.path, 'пустой или отсутствующий <title>')
  } else if (decodeEntities(titles[0]) !== route.title) {
    fail(route.path, `title не совпадает с routes.js: "${titles[0]}" вместо "${route.title}"`)
  }

  // 2. Ровно один canonical, указывающий на себя
  const canonicals = [...html.matchAll(/<link[^>]+rel="canonical"[^>]*>/g)]
  if (canonicals.length !== 1) {
    fail(route.path, `canonical должен быть ровно один, найдено ${canonicals.length}`)
  } else {
    const href = canonicals[0][0].match(/href="([^"]*)"/)?.[1]
    const expected = origin + route.path
    if (href !== expected) {
      fail(route.path, `canonical ведёт на ${href}, ожидался ${expected}`)
    }
  }

  // 3. В body есть текст, а не пустой div
  const length = textLength(html)
  if (length < MIN_BODY_TEXT) {
    fail(route.path, `в body ${length} символов текста, минимум ${MIN_BODY_TEXT}`)
  }

  // 4. hreflang стоит тогда и только тогда, когда английская версия поднята
  const hreflangs = [...html.matchAll(/hreflang="([^"]*)"/g)].map((m) => m[1])
  if (enIsLive) {
    for (const expected of ['ru', 'en', 'x-default']) {
      if (!hreflangs.includes(expected)) {
        fail(route.path, `enIsLive=true, но нет hreflang="${expected}"`)
      }
    }
  } else if (hreflangs.length > 0) {
    fail(route.path, `enIsLive=false, но проставлен hreflang: ${hreflangs.join(', ')}`)
  }
}

// 5. Число страниц совпадает с sitemap
const sitemapPath = join(outDir, 'sitemap.xml')
if (!existsSync(sitemapPath)) {
  fail('sitemap.xml', 'файл не сгенерирован')
} else {
  const locs = [...readFileSync(sitemapPath, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  if (locs.length !== routes.length) {
    fail('sitemap.xml', `${locs.length} URL против ${routes.length} маршрутов`)
  }
}

// 404 живёт по своим правилам: его нет в sitemap, canonical ему не нужен,
// от него требуется только не попасть в индекс.
const notFoundPath = join(outDir, '404.html')
if (!existsSync(notFoundPath)) {
  fail('404.html', 'файл не сгенерирован')
} else {
  const html = readFileSync(notFoundPath, 'utf8')
  if (!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html)) {
    fail('404.html', 'нет <meta name="robots" content="noindex">')
  }
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

if (errors.length > 0) {
  console.error(`\nПререндер не прошёл проверку (${errors.length}):\n`)
  for (const e of errors) console.error(`  ✗ ${e}`)
  console.error('')
  process.exit(1)
}

console.log(`✓ Пререндер проверен: ${routes.length} страниц и 404.html`)
```

- [ ] **Step 2: Добавить скрипт в `package.json`**

В блок `scripts` добавить строку:

```json
    "verify": "node scripts/verify-prerender.js",
```

- [ ] **Step 3: Запустить проверку и убедиться, что она падает**

```bash
npm run build
npm run verify
```

Expected: FAIL, код выхода 1. В выводе — ошибки «пустой или отсутствующий `<title>`» и «в body N символов текста» для всех 18 маршрутов, плюс отсутствие `404.html`. Это и есть зафиксированная проблема.

- [ ] **Step 4: Проверить порог на самой короткой странице**

Порог 500 символов взят с запасом, но должен быть проверен на реальных данных. Выполнить после того, как пререндер заработает (Task 4), и вернуться сюда, если порог окажется завышен:

```bash
node -e "
import('./src/routes.js').then(async ({ getRoutes }) => {
  const { readFileSync } = await import('node:fs')
  const lens = getRoutes('ru').map((r) => {
    const f = r.path === '/' ? 'dist/index.html' : 'dist' + r.path + '/index.html'
    const html = readFileSync(f, 'utf8')
    const body = html.slice(html.indexOf('<body'))
    return [r.path, body.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length]
  }).sort((a, b) => a[1] - b[1])
  console.log('Самые короткие:', lens.slice(0, 3))
})
"
```

Expected: самая короткая страница заметно длиннее 500 символов. Если нет — понизить `MIN_BODY_TEXT` до половины её длины и записать в комментарий, какая это страница.

- [ ] **Step 5: Коммит**

```bash
git add scripts/verify-prerender.js package.json
git commit -m "Add build check that fails when pages render empty

Currently fails on all 18 routes: the server serves an empty root div,
which is the problem this branch exists to fix.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Серверная сборка

**Files:**
- Create: `src/entry-server.jsx`
- Modify: `vite.config.js` (сигнатура `defineConfig`, блок `build`)
- Modify: `package.json` (блок `scripts`)
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `src/App.jsx` (дефолтный экспорт), `StaticRouter` из `react-router-dom`.
- Produces: `render(url)` → `Promise<string>` с HTML тела приложения. Импортируется в Task 4 как `dist-ssr/entry-server.js`.

- [ ] **Step 1: Написать `src/entry-server.jsx`**

```jsx
import { StrictMode } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Writable } from 'node:stream'
import App from './App'

// Страницы подключены через lazy(). Синхронный renderToString не стал бы
// ждать динамический импорт и отдал бы пустой div из Suspense fallback —
// ровно ту пустую страницу, от которой мы уходим. renderToPipeableStream
// с onAllReady дожидается разрешения импортов и только потом отдаёт разметку.
//
// HelmetProvider здесь нужен лишь для того, чтобы компонент Seo не падал:
// его вывод мы не используем, метатеги пререндер берёт из src/routes.js.
export function render(url) {
  return new Promise((resolve, reject) => {
    const chunks = []

    const sink = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.from(chunk))
        callback()
      },
    })

    sink.on('finish', () => resolve(Buffer.concat(chunks).toString('utf8')))
    sink.on('error', reject)

    const { pipe, abort } = renderToPipeableStream(
      <StrictMode>
        <HelmetProvider>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </HelmetProvider>
      </StrictMode>,
      {
        onAllReady() {
          pipe(sink)
        },
        onError(error) {
          abort()
          reject(error)
        },
      },
    )
  })
}
```

- [ ] **Step 2: Добавить ветку серверной сборки в `vite.config.js`**

Заменить экспорт по умолчанию:

```js
export default defineConfig(({ isSsrBuild }) => {
  const lang = process.env.VITE_LANG === 'en' ? 'en' : 'ru'

  // При серверной сборке sitemap и robots не нужны: они уже сгенерированы
  // клиентским проходом, второй экземпляр только запутал бы проверку.
  const plugins = isSsrBuild
    ? [react()]
    : [react(), htmlLocalePlugin(lang), sitemapPlugin(lang)]

  const clientOutDir = lang === 'en' ? 'dist-en' : 'dist'
  const ssrOutDir = lang === 'en' ? 'dist-ssr-en' : 'dist-ssr'

  return {
    plugins,
    define: {
      // Прокидываем явно, чтобы язык не зависел от того, подхватит ли Vite
      // переменную окружения из shell.
      'import.meta.env.VITE_LANG': JSON.stringify(lang),
    },
    build: {
      // Русская и английская сборки не должны затирать друг друга,
      // клиентская и серверная — тем более.
      outDir: isSsrBuild ? ssrOutDir : clientOutDir,
    },
  }
})
```

- [ ] **Step 3: Добавить скрипт серверной сборки в `package.json`**

Добавить в блок `scripts` одну строку. `build` пока не трогаем: он начнёт вызывать пререндер в Task 4, когда тот появится, — иначе между задачами сборка была бы сломана.

```json
    "build:ssr": "vite build --ssr src/entry-server.jsx",
```

- [ ] **Step 4: Добавить серверные сборки в `.gitignore`**

```
dist-ssr/
dist-ssr-en/
```

- [ ] **Step 5: Проверить, что серверный рендер отдаёт текст, а не заглушку**

```bash
vite build --ssr src/entry-server.jsx
node -e "
import('./dist-ssr/entry-server.js').then(async (m) => {
  const html = await m.render('/blog')
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  console.log('длина текста:', text.length)
  console.log('фрагмент:', text.slice(0, 120))
  if (text.length < 500) { console.error('ПУСТО — lazy не дождался'); process.exit(1) }
})
"
```

Expected: длина текста в тысячах символов, во фрагменте виден русский текст блога. Если длина близка к нулю — `onAllReady` не отработал, и дальше идти нельзя.

- [ ] **Step 6: Коммит**

```bash
git add src/entry-server.jsx vite.config.js package.json .gitignore
git commit -m "Add server-side render entry

Pages are wired through lazy(), so renderToString would emit the Suspense
fallback. renderToPipeableStream with onAllReady waits for the imports.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: `scripts/prerender.js` — запись статических страниц

**Files:**
- Create: `scripts/prerender.js`
- Create: `tests/escape.test.js`

**Interfaces:**
- Consumes: `render(url)` из Task 3 (`dist-ssr/entry-server.js`), `getRoutes(lang)` из Task 1, шаблон `dist/index.html`.
- Produces: `dist/<path>/index.html` для каждого маршрута и `dist/404.html`. Экспортирует `escapeAttr(value)` и `renderHead(route, origin)` для тестов.

- [ ] **Step 1: Написать падающий тест на экранирование**

Заголовки статей содержат кавычки и тире; незаэкранированная кавычка в `content="..."` обрывает атрибут и ломает метатег. Создать `tests/escape.test.js`:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { escapeAttr, renderHead } from '../scripts/prerender.js'

test('кавычки и скобки в атрибуте экранируются', () => {
  assert.equal(escapeAttr('Кейс "Колдун" & <b>'), 'Кейс &quot;Колдун&quot; &amp; &lt;b&gt;')
})

test('title с кавычками не рвёт разметку head', () => {
  const head = renderHead(
    {
      path: '/blog/x',
      title: 'Бот "Колдун" — NODA',
      description: 'Описание с "кавычками" и <тегом>',
      ogDescription: 'og',
      jsonLd: null,
    },
    'https://noda-auto.com',
  )

  assert.ok(head.includes('<title data-default-seo>Бот &quot;Колдун&quot; — NODA</title>'))
  assert.ok(!/content="[^"]*"[^"]*"/.test(head), 'атрибут content оборван кавычкой')
})

test('JSON-LD не может закрыть тег script', () => {
  const head = renderHead(
    {
      path: '/',
      title: 't',
      description: 'd',
      ogDescription: 'o',
      jsonLd: { name: '</script><script>alert(1)</script>' },
    },
    'https://noda-auto.com',
  )

  assert.ok(!head.includes('</script><script>'), 'JSON-LD вырвался из тега')
})
```

- [ ] **Step 2: Запустить тест и убедиться, что он падает**

Run: `node --test tests/escape.test.js`
Expected: FAIL — `Cannot find module '../scripts/prerender.js'`

- [ ] **Step 3: Написать `scripts/prerender.js`**

```js
// Третий проход сборки: рендерит каждый маршрут в готовый HTML.
// Тело берётся из React, <head> — из src/routes.js.
//
// Все сгенерированные теги помечаются data-default-seo — тем же атрибутом,
// который снимает src/seo-defaults.js до первого клиентского рендера.
// Иначе после гидрации Helmet добавил бы свои теги рядом, и на странице
// оказалось бы два <title>.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { getRoutes } from '../src/routes.js'
import { origins, enIsLive } from '../src/i18n/config.js'

const lang = process.env.VITE_LANG === 'en' ? 'en' : 'ru'
const outDir = lang === 'en' ? 'dist-en' : 'dist'
const ssrDir = lang === 'en' ? 'dist-ssr-en' : 'dist-ssr'
const origin = origins[lang]

export function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function renderHead(route, origin) {
  const url = origin + route.path
  const tags = [
    `<title data-default-seo>${escapeAttr(route.title)}</title>`,
    `<meta data-default-seo name="description" content="${escapeAttr(route.description)}" />`,
    `<link data-default-seo rel="canonical" href="${escapeAttr(url)}" />`,
    `<meta data-default-seo property="og:title" content="${escapeAttr(route.title)}" />`,
    `<meta data-default-seo property="og:description" content="${escapeAttr(route.ogDescription || route.description)}" />`,
    `<meta data-default-seo property="og:url" content="${escapeAttr(url)}" />`,
  ]

  if (enIsLive) {
    for (const [hreflang, target] of [
      ['ru', origins.ru],
      ['en', origins.en],
      ['x-default', origins.en],
    ]) {
      tags.push(
        `<link data-default-seo rel="alternate" hreflang="${hreflang}" href="${escapeAttr(target + route.path)}" />`,
      )
    }
  }

  if (route.jsonLd) {
    // Экранируем < внутри JSON, иначе строка вида </script> закрыла бы тег
    // и всё, что за ней, стало бы разметкой страницы.
    const json = JSON.stringify(route.jsonLd).replace(/</g, '\\u003c')
    tags.push(`<script data-default-seo type="application/ld+json">${json}</script>`)
  }

  return tags.join('\n    ')
}

function buildPage(template, appHtml, headHtml) {
  return template
    .replace(/\s*<title data-default-seo>[\s\S]*?<\/title>/g, '')
    .replace(/\s*<meta data-default-seo[^>]*>/g, '')
    .replace('</head>', `  ${headHtml}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
}

async function main() {
  const { render } = await import(`../${ssrDir}/entry-server.js`)
  const template = readFileSync(join(outDir, 'index.html'), 'utf8')
  const routes = getRoutes(lang)

  for (const route of routes) {
    const appHtml = await render(route.path)
    const page = buildPage(template, appHtml, renderHead(route, origin))
    const file = route.path === '/'
      ? join(outDir, 'index.html')
      : join(outDir, route.path.slice(1), 'index.html')

    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, page)
  }

  // 404 отдаётся nginx на любой несуществующий путь. Своего маршрута у него
  // нет и в sitemap он не попадает — от него требуется только noindex.
  const notFoundHtml = await render('/__not_found__')
  const notFoundHead =
    '<title data-default-seo>404 — NODA</title>\n    ' +
    '<meta data-default-seo name="robots" content="noindex" />'
  writeFileSync(join(outDir, '404.html'), buildPage(template, notFoundHtml, notFoundHead))

  console.log(`✓ Пререндер: ${routes.length} страниц и 404.html в ${outDir}/`)
}

// Модуль импортируется тестами ради escapeAttr и renderHead, поэтому
// сборку запускаем только при прямом вызове.
if (process.argv[1] && process.argv[1].endsWith('prerender.js')) {
  main().catch((error) => {
    console.error('Пререндер упал:', error)
    process.exit(1)
  })
}
```

- [ ] **Step 4: Запустить тест экранирования**

Run: `node --test tests/escape.test.js`
Expected: PASS, 3 теста

- [ ] **Step 5: Собрать сборку из трёх проходов**

Теперь, когда пререндер существует, `build` можно связать в цепочку. В `package.json` заменить `build` и `build:en`:

```json
    "build": "vite build && npm run build:ssr && node scripts/prerender.js && node scripts/verify-prerender.js",
    "build:en": "VITE_LANG=en npm run build",
```

`VITE_LANG` наследуется дочерними процессами, поэтому отдельно пробрасывать его в `build:ssr` не требуется.

- [ ] **Step 6: Собрать и проверить**

```bash
npm run build
```

Expected: сборка проходит целиком, последним выводом — `✓ Пререндер проверен: 18 страниц и 404.html`. Проверка из Task 2 больше не падает.

- [ ] **Step 7: Глазами убедиться, что в статике есть контент**

```bash
grep -c "Колдун" dist/index.html
head -c 400 dist/blog/wedding-chatbot/index.html
grep -o "<title[^>]*>[^<]*</title>" dist/blog/wedding-chatbot/index.html
```

Expected: `grep -c` даёт ненулевое число; в начале файла виден заголовок статьи; `<title>` непустой.

- [ ] **Step 8: Вернуться к Task 2, шаг 4 и проверить порог**

Выполнить команду из Task 2, шага 4 и убедиться, что самая короткая страница длиннее 500 символов.

- [ ] **Step 9: Коммит**

```bash
git add scripts/prerender.js tests/escape.test.js package.json
git commit -m "Prerender every route to static HTML at build time

Head tags are escaped: article titles contain quotes, and an unescaped
one would truncate the meta content attribute.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Гидрация вместо пересоздания дерева

**Files:**
- Modify: `src/main.jsx`

**Interfaces:**
- Consumes: статический HTML из Task 4.
- Produces: ничего для других задач.

- [ ] **Step 1: Переключить `main.jsx` на `hydrateRoot`**

```jsx
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { removeDefaultSeoTags } from './seo-defaults'
import './styles.css'

removeDefaultSeoTags()

const container = document.getElementById('root')

const tree = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)

// В собранной версии разметка уже пришла с сервера — её надо подхватить,
// а не строить заново. При npm run dev пререндера нет, там обычный рендер.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
```

- [ ] **Step 2: Собрать и поднять статику локально**

```bash
npm run build
npx vite preview --outDir dist --port 4173
```

- [ ] **Step 3: Проверить консоль браузера на ошибки гидрации**

Открыть `http://localhost:4173/` и `http://localhost:4173/blog/wedding-chatbot`, прочитать консоль.

Expected: нет сообщений, содержащих `Hydration failed`, `did not match` или `Text content does not match`. Если такое сообщение есть — оно называет компонент; его начальное состояние должно совпадать с серверным, и чинить надо компонент, а не отключать гидрацию.

- [ ] **Step 4: Проверить, что дубля метатегов нет**

В консоли браузера:

```js
document.querySelectorAll('title').length
document.querySelectorAll('link[rel="canonical"]').length
```

Expected: по единице. Если двойка — `seo-defaults.js` не снял статические теги, проверить, что пререндер проставил `data-default-seo` на все теги.

- [ ] **Step 5: Коммит**

```bash
git add src/main.jsx
git commit -m "Hydrate the prerendered markup instead of rebuilding it

Falls back to createRoot under npm run dev, where there is no prerender.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Честный 404 вместо редиректа

**Files:**
- Create: `src/components/NotFound.jsx`
- Modify: `src/pages/Article.jsx:1-10`
- Modify: `src/App.jsx`
- Modify: `src/i18n/ru.js`, `src/i18n/en.js` (новый блок `notFound`)

**Interfaces:**
- Consumes: `t` из `src/i18n`, `Seo` не используется (у 404 свои теги).
- Produces: компонент `NotFound` по умолчанию.

- [ ] **Step 1: Добавить тексты в словари**

В `src/i18n/ru.js`, рядом с блоком `article`:

```js
  notFound: {
    title: 'Страница не найдена',
    text: 'Такой страницы нет. Возможно, ссылка устарела.',
    home: 'На главную',
    blog: 'В блог',
  },
```

В `src/i18n/en.js`, тем же ключом:

```js
  notFound: {
    title: 'Page not found',
    text: 'There is no such page. The link may be out of date.',
    home: 'Home',
    blog: 'Blog',
  },
```

- [ ] **Step 2: Написать компонент**

Создать `src/components/NotFound.jsx`:

```jsx
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { t } from '../i18n'

// Раньше неизвестный слаг редиректил на /blog, а сервер на любой путь отдавал
// код 200 — для бота несуществующая страница выглядела валидной. Это soft 404,
// из-за которого в индекс попадает мусор. Теперь noindex на клиенте
// и код 404 от nginx.
export default function NotFound() {
  return (
    <div className="blog-root">
      <Helmet>
        <title>404 — NODA</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className="article-main">
        <h1 className="article-title">{t.notFound.title}</h1>
        <p className="article-desc">{t.notFound.text}</p>
        <div className="article-nav">
          <Link to="/">{t.notFound.home}</Link>
          <Link to="/blog">{t.notFound.blog}</Link>
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Убрать редирект из `Article.jsx`**

Заменить первые строки файла:

```jsx
import { Link, useParams } from 'react-router-dom'
import { articles } from '../data'
import { t } from '../i18n'
import Seo from '../components/Seo'
import NotFound from '../components/NotFound'

export default function Article() {
  const { slug } = useParams()
  const article = articles.find((a) => a.slug === slug)

  if (!article) return <NotFound />
```

- [ ] **Step 4: Добавить catch-all роут в `App.jsx`**

```jsx
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import NotFound from './components/NotFound'

const Landing = lazy(() => import('./pages/Landing'))
const Giorgi = lazy(() => import('./pages/Giorgi'))
const Blog = lazy(() => import('./pages/Blog'))
const Article = lazy(() => import('./pages/Article'))

export default function App() {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/giorgi" element={<Giorgi />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Article />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
```

Внимание: в этом файле параллельно работает сессия `ws_worker`, добавляющая роут `/cases`. Catch-all `*` обязан остаться последним.

- [ ] **Step 5: Собрать и проверить 404**

```bash
npm run build
grep -o '<meta[^>]*robots[^>]*>' dist/404.html
npm run verify
```

Expected: в `404.html` виден `content="noindex"`, проверка проходит целиком.

- [ ] **Step 6: Коммит**

```bash
git add src/components/NotFound.jsx src/pages/Article.jsx src/App.jsx src/i18n/ru.js src/i18n/en.js
git commit -m "Replace the redirect on unknown slugs with a real 404 page

An unknown article used to redirect to /blog while the server answered 200,
which is a soft 404 and puts junk in the index.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Конфиг nginx на сервере

Требует SSH-доступа к 217.18.62.12. Если доступа нет — конфиг отдаётся Георгию, а задача считается выполненной после того, как он применит его и проверка из шага 4 пройдёт.

**Files:**
- Create: `deploy/nginx-noda.conf` (эталон в репозитории)
- Вне репозитория: конфиг на сервере

- [ ] **Step 1: Сохранить текущий конфиг сервера**

```bash
ssh root@217.18.62.12 'cat /etc/nginx/sites-enabled/* > /root/nginx-backup-$(date +%F).conf && cat /root/nginx-backup-$(date +%F).conf'
```

Прочитать вывод. Если там есть правила, которых нет в эталоне ниже — редиректы, basic auth, проксирование, настройки TLS — перенести их в новый конфиг, а не затереть.

- [ ] **Step 2: Положить эталон в репозиторий**

Создать `deploy/nginx-noda.conf`:

```nginx
# Конфиг статики noda-auto.com после перехода на пререндер.
#
# Ключевое — отсутствие SPA-fallback. Пока nginx отдавал index.html на любой
# путь с кодом 200, несуществующая страница выглядела для поисковика валидной,
# и весь пререндер обесценивался.

server {
    listen 80;
    server_name noda-auto.com www.noda-auto.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/index.html $uri/ =404;
    }

    error_page 404 /404.html;
    location = /404.html {
        internal;
    }

    # Ассеты Vite хэшированные — имя меняется вместе с содержимым.
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # HTML кэшировать нельзя: иначе правки статей доезжают до читателей
    # непредсказуемо долго.
    location ~* \.html$ {
        add_header Cache-Control "no-cache";
    }
}
```

- [ ] **Step 3: Применить конфиг**

```bash
scp deploy/nginx-noda.conf root@217.18.62.12:/etc/nginx/sites-available/noda-auto
ssh root@217.18.62.12 'ln -sf /etc/nginx/sites-available/noda-auto /etc/nginx/sites-enabled/noda-auto && nginx -t'
```

Expected: `syntax is ok` и `test is successful`. При ошибке — не перезагружать nginx, разобрать сообщение.

```bash
ssh root@217.18.62.12 'systemctl reload nginx'
```

- [ ] **Step 4: Проверить коды ответов на живом сайте**

```bash
curl -s -o /dev/null -w "%{http_code} /\n" https://noda-auto.com/
curl -s -o /dev/null -w "%{http_code} /blog\n" https://noda-auto.com/blog
curl -s -o /dev/null -w "%{http_code} несуществующая\n" https://noda-auto.com/no-such-page-xyz
curl -s https://noda-auto.com/blog/wedding-chatbot | grep -o "<title[^>]*>[^<]*</title>"
```

Expected: `200`, `200`, `404`, и непустой `<title>` в сыром ответе без выполнения JS. Последняя строка — главная проверка всей работы: именно это видит поисковый робот.

- [ ] **Step 5: Коммит**

```bash
git add deploy/nginx-noda.conf
git commit -m "Add nginx config without the SPA fallback

Serving index.html with a 200 on every path made missing pages look valid
to crawlers and cancelled out the prerender.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Английская сборка тем же кодом

**Files:** изменений не предполагается; задача проверочная.

- [ ] **Step 1: Собрать английскую версию**

```bash
npm run build:en
```

Expected: проходит целиком, последним выводом — `✓ Пререндер проверен: 18 страниц и 404.html`.

- [ ] **Step 2: Проверить, что домены и язык не перепутаны**

```bash
grep -o '<html lang="[^"]*"' dist-en/index.html
grep -o '<link[^>]*rel="canonical"[^>]*>' dist-en/blog/wedding-chatbot/index.html
grep -o '"url":"[^"]*"' dist-en/index.html | head -2
grep -c hreflang dist-en/index.html
```

Expected: `lang="en"`; canonical на `https://en.noda-auto.com/blog/wedding-chatbot`; в JSON-LD `https://en.noda-auto.com` — не `noda-auto.com`, это был исправленный баг; `hreflang` не встречается ни разу, потому что `enIsLive === false`.

- [ ] **Step 3: Убедиться, что русская сборка не пострадала**

```bash
npm run build
grep -o '<html lang="[^"]*"' dist/index.html
grep -o '<link[^>]*rel="canonical"[^>]*>' dist/blog/wedding-chatbot/index.html
```

Expected: `lang="ru"`, canonical на `https://noda-auto.com/blog/wedding-chatbot`.

- [ ] **Step 4: Прогнать все тесты**

```bash
node --test tests/
```

Expected: PASS по всем файлам.

- [ ] **Step 5: Коммит**

Изменений может не быть. Если по ходу проверки что-то поправлено:

```bash
git add -A
git commit -m "Verify the English build prerenders through the same code path

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## После плана

Деплой-воркфлоу `.github/workflows` не меняется: он вызывает `npm run build`, который теперь включает пререндер и проверку. Битая сборка падает до шага rsync.

Что остаётся за рамками и делается отдельными подпроектами: Метрика, цели и форма заявки (B), семантика и статьи Гермеса (C), недельный дайджест (D), поднятие поддомена `en.noda-auto.com`.
