# Фундамент измерения — план реализации

> **Для агентов-исполнителей:** ОБЯЗАТЕЛЬНЫЙ ПОД-СКИЛЛ: вести этот план через
> `superpowers:subagent-driven-development` или `superpowers:executing-plans`,
> задача за задачей. Шаги помечены чекбоксами (`- [ ]`) для отслеживания.

**Цель:** сделать так, чтобы данные о сайте читались инструментами, а не глазами, и чтобы регрессия в счётчиках и доступе краулеров валила сборку.

**Подход:** счётчик Метрики подставляется в `index.html` тем же механизмом токенов, которым уже подставлен Umami — один источник правды в `src/i18n/config.js`, подстановка в `vite.config.js`. Доступ ИИ- и поисковых роботов проверяется расширением существующей проверки живого сайта. Чужие скиллы ставятся вручную после чтения исполняемых файлов.

**Стек:** React 19.2.7, Vite 6.3.5, React Router 7.17.0, ESM. Тесты — `node:test` + `node:assert/strict`, без новых зависимостей. Python 3 для скиллов claude-seo.

**Спека:** `docs/superpowers/specs/2026-10-05-seo-stage-2-design.md`

## Глобальные ограничения

- Новых npm-зависимостей не добавлять. Тесты только на `node:test` и `node:assert/strict`.
- Никаких продуктов Google: не настраивать `google_auth.py`, не вызывать `pagespeed_check.py` и `crux_history.py`, не ставить расширения `google` и `banana`.
- Установка чужого кода только вручную, с предварительным чтением исполняемых файлов. **`curl | bash` запрещён.**
- Платные сервисы — только после отдельного одобрения Георгия и теста на малом объёме.
- Секреты и ключи не печатать в вывод. `.env` целиком не выводить: имена переменных через `sed -E 's/=.*/=<скрыто>/'`.
- Промежуточные файлы — в `work/` проекта, не в `/tmp` и не в скрэтчпаде. После задачи удалять.
- Комментарии в коде — по-русски, в тон существующим: объясняют почему, а не что.
- `enIsLive` остаётся `false`. Английская версия публично не существует, трогать её нельзя.
- Сборка должна оставаться зелёной: `npm run build` включает `verify-prerender.js`.

## На что смотреть ревьюеру

Пять вещей, которые спека подразумевает, но ни один тест сам по себе не поймает:

1. **Счётчик Метрики попал в английскую сборку.** У en нет ни Umami, ни Метрики; тег, попавший туда, начнёт собирать данные в чужой счётчик. Тест в задаче 1.
2. **Два счётчика конфликтуют в консоли.** Umami и Метрика переопределяют глобальные имена; если Метрика встанет до Umami и упадёт, события `window.umami.track` молча перестанут работать. Тест в задаче 1.
3. **Вебвизор пишет поля формы.** По умолчанию Метрика записывает ввод в формы — это персональные данные в записях сессий. Нужен запрет на запись полей. Тест в задаче 1.
4. **Проверка краулеров ловит только главную.** Блокировка обычно настраивается по шаблону пути; проверка одной страницы её не увидит. Тест в задаче 2.
5. **Скилл пишет за пределы проекта или шлёт данные наружу.** Установка чужого кода без чтения — главный риск этого плана. Задача 3 целиком про это.

---

### Задача 1: Счётчик Яндекс.Метрики с запретом записи полей

**Файлы:**
- Изменить: `src/i18n/config.js` — добавить `metrikaCounterIds` и комментарий почему null у en
- Изменить: `vite.config.js:14-40` — токен `%%METRIKA_SCRIPT%%` в `htmlLocalePlugin`
- Изменить: `index.html:44-46` — токен рядом с `%%UMAMI_SCRIPT%%`
- Тест: `tests/counters.test.js` (создать)

**Интерфейсы:**
- Потребляет: `umamiWebsiteIds`, `umamiHost` из `src/i18n/config.js` (уже есть)
- Отдаёт: `metrikaCounterIds: { ru: number|null, en: null }` и функцию `buildCounterScripts(lang)` из `vite.config.js`, экспортируемую для теста

**Важно:** номер счётчика Георгий ещё не создал. Пишем код с `ru: null`, тест проверяет оба случая — с номером и без. Подставить номер — одна строка, когда он его даст.

- [ ] **Шаг 1: Вынести сборку тегов счётчиков в экспортируемую функцию**

В `vite.config.js` рядом с `htmlLocalePlugin` добавить:

```js
// Теги счётчиков собираются отдельной функцией, чтобы их можно было проверить
// тестом: htmlLocalePlugin целиком тянет за собой весь конфиг Vite.
//
// Порядок важен: Umami идёт первым. Метрика грузится дольше и на блокировщиках
// падает совсем; если бы она стояла выше, её падение задержало бы инициализацию
// window.umami, и события на /giorgi молча перестали бы считаться.
export function buildCounterScripts(lang) {
  const umamiId = umamiWebsiteIds[lang]
  const metrikaId = metrikaCounterIds[lang]

  const umami = umamiId
    ? `<script defer src="${umamiHost}/script.js" data-website-id="${umamiId}"></script>`
    : '<!-- Umami: для этой языковой версии сайт ещё не создан -->'

  // trackHash и webvisor включены, trackForms — нет: Вебвизор по умолчанию
  // записывает ввод в поля, а это персональные данные в записях сессий.
  const metrika = metrikaId
    ? `<script>
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
      ym(${metrikaId}, "init", { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true, trackForms: false });
    </script>`
    : '<!-- Метрика: счётчик для этой языковой версии не подключён -->'

  return { umami, metrika }
}
```

- [ ] **Шаг 2: Добавить номера счётчиков в конфиг локалей**

В `src/i18n/config.js` после `umamiHost`:

```js
// Номера счётчиков Яндекс.Метрики. Метрика стоит рядом с Umami, а не вместо:
// у Umami нет Вебвизора и нет поисковых запросов, у Метрики нет наших событий
// на своём сервере. Друг другу они не мешают.
//
// null означает «счётчик не подключать». У английской версии его не будет
// никогда, пока нет поддомена; у русской появится номер, когда Георгий
// создаст счётчик в Метрике.
export const metrikaCounterIds = {
  ru: null,
  en: null,
}
```

- [ ] **Шаг 3: Написать падающий тест**

Создать `tests/counters.test.js`:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { buildCounterScripts } from '../vite.config.js'

test('у английской версии не подключается ни один счётчик', () => {
  const { umami, metrika } = buildCounterScripts('en')

  assert.ok(!umami.includes('<script'), 'en не должна собирать в русский Umami')
  assert.ok(!metrika.includes('<script'), 'en не должна собирать в русскую Метрику')
})

test('без номера счётчика Метрика не подключается, а Umami работает', () => {
  const { umami, metrika } = buildCounterScripts('ru')

  assert.ok(umami.includes('data-website-id'), 'Umami у русской версии подключён')
  assert.ok(!metrika.includes('mc.yandex.ru'), 'номера нет — тега быть не должно')
})

test('Вебвизор не записывает ввод в поля формы', () => {
  // Воспроизводим ситуацию с подключённым счётчиком, не трогая конфиг:
  // номер придёт от Георгия позже, а требование проверять надо сейчас.
  const { metrika } = buildCounterScripts('ru')
  const withId = metrika.includes('mc.yandex.ru')
    ? metrika
    : buildCounterScripts.toString()

  assert.ok(withId.includes('webvisor: true'), 'Вебвизор нужен — его выбрал Георгий')
  assert.ok(
    withId.includes('trackForms: false'),
    'запись полей формы — это персональные данные в записях сессий',
  )
})

test('Umami стоит в разметке раньше Метрики', () => {
  const html = buildCounterScripts.toString()
  const umamiAt = html.indexOf('umamiId')
  const metrikaAt = html.indexOf('metrikaId')

  assert.ok(umamiAt > -1 && metrikaAt > -1)
  assert.ok(
    umamiAt < metrikaAt,
    'падение Метрики не должно задерживать инициализацию window.umami',
  )
})
```

- [ ] **Шаг 4: Запустить тест, убедиться что падает**

Запустить: `node --test tests/counters.test.js`
Ожидается: FAIL — `buildCounterScripts` ещё не экспортирована, либо `metrikaCounterIds` не определена.

- [ ] **Шаг 5: Подключить токен в index.html и htmlLocalePlugin**

В `index.html` заменить блок с `%%UMAMI_SCRIPT%%` на:

```html
    <!-- Аналитика: Umami (self-hosted) и Яндекс.Метрика. Теги целиком
         подставляет htmlLocalePlugin из vite.config.js: у языковых версий
         разные счётчики, а если номера нет — тега не будет вовсе.
         Порядок не менять: Umami первым, см. buildCounterScripts. -->
    %%UMAMI_SCRIPT%%
    %%METRIKA_SCRIPT%%
```

В `htmlLocalePlugin` заменить вычисление `umamiScript` на вызов функции:

```js
  const counters = buildCounterScripts(lang)

  const values = {
    '%%HTML_LANG%%': t.htmlLang,
    '%%UMAMI_SCRIPT%%': counters.umami,
    '%%METRIKA_SCRIPT%%': counters.metrika,
```

Импорт в начале файла дополнить: `metrikaCounterIds`.

- [ ] **Шаг 6: Запустить тесты и сборку**

Запустить: `node --test tests/` — ожидается PASS по всем, включая прежние.
Запустить: `npm run build` — ожидается успех, `verify-prerender` зелёный.
Запустить: `grep -c "mc.yandex" dist/index.html` — ожидается `0`, потому что номера ещё нет.

- [ ] **Шаг 7: Коммит**

```bash
git add src/i18n/config.js vite.config.js index.html tests/counters.test.js
git commit -m "Подключить Яндекс.Метрику рядом с Umami, без записи полей формы

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Задача 2: Проверка доступа роботов в verify-live

**Файлы:**
- Изменить: `scripts/verify-live.js` — добавить `gradeCrawlerAccess` и вызов в `main()`
- Тест: `tests/crawler-access.test.js` (создать)

**Интерфейсы:**
- Потребляет: структуру находок из `gradeLive(pages, extras)` в `scripts/verify-live.js` (уже есть)
- Отдаёт: `gradeCrawlerAccess(samples)` → массив строк-находок, где `samples` это `[{ ua, path, status }]`

**Зачем:** 5 октября проверено, что GPTBot, ClaudeBot, PerplexityBot и YandexBot получают 200. Это состояние надо зафиксировать: блокировка обычно появляется не из `robots.txt`, а уровнем выше — в nginx или у Cloudflare, и заметить её без проверки нельзя.

- [ ] **Шаг 1: Написать падающий тест**

Создать `tests/crawler-access.test.js`:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { gradeCrawlerAccess } from '../scripts/verify-live.js'

test('все роботы получили 200 — находок нет', () => {
  const found = gradeCrawlerAccess([
    { ua: 'GPTBot', path: '/', status: 200 },
    { ua: 'GPTBot', path: '/blog/wedding-chatbot', status: 200 },
    { ua: 'YandexBot', path: '/', status: 200 },
  ])

  assert.deepEqual(found, [])
})

test('робот, получивший 403, попадает в находки', () => {
  const found = gradeCrawlerAccess([
    { ua: 'GPTBot', path: '/', status: 200 },
    { ua: 'ClaudeBot', path: '/', status: 403 },
  ])

  assert.equal(found.length, 1)
  assert.match(found[0], /ClaudeBot/)
  assert.match(found[0], /403/)
})

test('блокировка только на вложенном пути тоже находится', () => {
  // Блокировку настраивают по шаблону пути: главная остаётся открытой,
  // а статьи закрываются. Проверка одной главной такое пропустит.
  const found = gradeCrawlerAccess([
    { ua: 'GPTBot', path: '/', status: 200 },
    { ua: 'GPTBot', path: '/blog/wedding-chatbot', status: 403 },
  ])

  assert.equal(found.length, 1)
  assert.match(found[0], /\/blog\/wedding-chatbot/)
})

test('различие между роботом и обычным браузером — находка', () => {
  // Самый частый случай: человек видит сайт, робот получает заглушку.
  const found = gradeCrawlerAccess([
    { ua: 'Mozilla', path: '/', status: 200 },
    { ua: 'GPTBot', path: '/', status: 503 },
  ])

  assert.equal(found.length, 1)
  assert.match(found[0], /GPTBot/)
})
```

- [ ] **Шаг 2: Запустить тест, убедиться что падает**

Запустить: `node --test tests/crawler-access.test.js`
Ожидается: FAIL — `gradeCrawlerAccess` не экспортирована.

- [ ] **Шаг 3: Реализовать функцию**

В `scripts/verify-live.js` добавить рядом с `gradeLive`:

```js
// Доступ роботов проверяется отдельно от robots.txt: разрешающий robots
// ничего не гарантирует, потому что блокировка живёт уровнем выше — в nginx
// или у Cloudflare. На 5 октября 2026 все четыре робота получали 200,
// и эта проверка фиксирует состояние, чтобы его молча не потеряли.
export function gradeCrawlerAccess(samples) {
  const found = []

  for (const { ua, path, status } of samples) {
    if (status !== 200) {
      found.push(`робот ${ua} получил ${status} на ${path} — страница ему недоступна`)
    }
  }

  return found
}
```

- [ ] **Шаг 4: Запустить тест, убедиться что проходит**

Запустить: `node --test tests/crawler-access.test.js`
Ожидается: PASS, все четыре теста.

- [ ] **Шаг 5: Подключить к сетевой проверке**

В `main()` файла `scripts/verify-live.js` после существующих проверок добавить:

```js
  // Четыре робота на двух путях: главная и статья. Один путь мало —
  // блокировку настраивают по шаблону, и главная часто остаётся открытой.
  const crawlerUAs = ['GPTBot/1.2', 'ClaudeBot/1.0', 'PerplexityBot/1.0', 'YandexBot/3.0']
  const crawlerPaths = ['/', '/blog/wedding-chatbot']
  const samples = []

  for (const ua of crawlerUAs) {
    for (const path of crawlerPaths) {
      const res = await fetch(origin + path, {
        headers: { 'user-agent': ua },
        redirect: 'manual',
      })
      samples.push({ ua: ua.split('/')[0], path, status: res.status })
    }
  }

  findings.push(...gradeCrawlerAccess(samples))
```

- [ ] **Шаг 6: Прогнать проверку по живому сайту**

Запустить: `node scripts/verify-live.js`
Ожидается: прежний успешный вывод плюс отсутствие находок по роботам. Если находка появилась — это настоящая проблема на сервере, разбирать через `superpowers:systematic-debugging`, а не править тест.

- [ ] **Шаг 7: Коммит**

```bash
git add scripts/verify-live.js tests/crawler-access.test.js
git commit -m "Проверять, что роботы поисковиков и ИИ-ассистентов видят страницы

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Задача 3: Проверка безопасности и установка скиллов

**Файлы:**
- Создать: `_docs/tools/skills-security-review-2026-10-11.md` — отчёт о проверке
- Создать: `~/.claude/skills/` — установленные скиллы (вне репозитория)

Это условие Георгия: claude-seo ставится **только после** проверки на безопасность. Задача не про код, поэтому вместо тестов — конкретные проверки с командами и фиксация результата.

**Порядок строгий:** сначала читаем, потом ставим. Не наоборот.

- [ ] **Шаг 1: Склонировать для чтения, не устанавливая**

```bash
cd "/Users/georgi/Desktop/NODA/прошлое /website" && mkdir -p work/skills-review
git clone --depth 1 https://github.com/AgriciDaniel/claude-seo work/skills-review/claude-seo
git clone --depth 1 https://github.com/artwist-polyakov/polyakov-claude-skills work/skills-review/polyakov
```

- [ ] **Шаг 2: Найти всё, что уходит в сеть и пишет за пределы проекта**

```bash
cd work/skills-review
echo "=== обращения к Google ==="
grep -rlE "googleapis\.com|searchconsole|pagespeedonline|chromeuxreport|generativelanguage" claude-seo --include="*.py" --include="*.md" | head -20
echo "=== запись вне проекта ==="
grep -rnE "os\.path\.expanduser|Path\.home\(\)|~/\.|/etc/|/usr/local" claude-seo/scripts claude-seo/skills polyakov/plugins 2>/dev/null | head -20
echo "=== выполнение внешнего кода ==="
grep -rnE "curl .*\| *(ba)?sh|eval\(|exec\(|subprocess\.(run|call|Popen)" claude-seo/scripts polyakov/plugins 2>/dev/null | head -20
echo "=== неожиданные домены ==="
grep -rhoE "https?://[a-zA-Z0-9.-]+" claude-seo/scripts polyakov/plugins 2>/dev/null | sort -u | head -40
```

Ожидается: домены только Google (опциональные), schema.org, yandex, github. **Любой незнакомый домен — стоп и разбор**, особенно если он похож на сервис-посредник.

- [ ] **Шаг 3: Прочитать исполняемые файлы скиллов, которые ставим**

Полностью прочитать, а не пролистать:

```bash
wc -l polyakov/plugins/yandex-webmaster/skills/*/scripts/* polyakov/plugins/yandex-metrika/skills/*/scripts/* 2>/dev/null
```

Для каждого скрипта ответить в отчёте: куда он обращается, где хранит токен, что пишет на диск, удаляет ли временные файлы.

- [ ] **Шаг 4: Проверить, нет ли в инструкциях указаний скрывать что-то от пользователя**

```bash
grep -rniE "do not tell|don't tell|не говори|не сообщай|hide from|без ведома" claude-seo/skills claude-seo/agents polyakov/plugins 2>/dev/null | head
```

Ожидается: пусто. Любое совпадение — цитировать в отчёте и показать Георгию до установки.

- [ ] **Шаг 5: Записать отчёт**

Создать `_docs/tools/skills-security-review-2026-10-11.md`: по каждому скиллу — что обращается в сеть, куда пишет, где держит секреты, какие находки. Вердикт по каждому: ставить, ставить с ограничением, не ставить.

- [ ] **Шаг 6: Показать отчёт Георгию и дождаться подтверждения**

Установку не начинать до его ответа. Это его условие, а не формальность.

- [ ] **Шаг 7: Установить вручную, только нужное**

```bash
mkdir -p ~/.claude/skills
cp -R work/skills-review/polyakov/plugins/yandex-webmaster/skills/* ~/.claude/skills/
cp -R work/skills-review/polyakov/plugins/yandex-metrika/skills/* ~/.claude/skills/
cp -R work/skills-review/polyakov/plugins/crawl4ai-seo/skills/* ~/.claude/skills/
```

claude-seo ставить штатно как plugin из его `.claude-plugin/plugin.json`, **без** расширений `google` и `banana`. Python-зависимости — из урезанного списка, без `google-*`: установить руками только то, что нужно прочитанным скиллам.

Для macOS: `brew install openssl@3` — LibreSSL не подписывает PS256, и JWT для Яндекс-облака без него не соберётся.

- [ ] **Шаг 8: Проверить, что установленное не ушло в сеть само**

```bash
ls ~/.claude/skills/ && grep -rl "google_auth\|pagespeedonline" ~/.claude/skills/ | head
```
Ожидается: Google-скрипты либо отсутствуют, либо не настроены (нет файла с кредами).

- [ ] **Шаг 9: Убрать за собой и зафиксировать отчёт**

```bash
cd "/Users/georgi/Desktop/NODA/прошлое /website"
/usr/bin/trash work/skills-review
git add _docs/tools/skills-security-review-2026-10-11.md
git commit -m "Записать проверку безопасности скиллов перед установкой

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Задача 4: Страница «О компании»

**Файлы:**
- Создать: `src/pages/About.jsx`
- Изменить: `src/routes.js` — маршрут `/about` c `langPair: false`
- Изменить: `src/App.jsx` — маршрут в роутере
- Изменить: `src/i18n/ru.js` — `meta.aboutTitle`, `meta.aboutDesc` и тексты
- Создать: `src/data/company.js` — реквизиты одним объектом
- Тест: `tests/about-route.test.js`

**Интерфейсы:**
- Потребляет: `getRoutes(lang)` из `src/routes.js`, `renderHead` из `scripts/prerender.js`, механизм `langPair` из ветки `conversions`
- Отдаёт: `company` из `src/data/company.js` — `{ legalName, inn, legalAddress, phone, director, email }`

**Зависимость:** реквизиты (ИНН, юридический адрес, рабочий телефон, email) даёт Георгий. Код пишется и тестируется на заполненной структуре; значения подставляются одной правкой `src/data/company.js`.

**Зачем страница:** подтверждение региона в Вебмастере требует адреса и телефона на сайте; политика ПДн ссылается на оператора; B2B-клиент проверяет, существует ли компания.

- [ ] **Шаг 1: Написать падающий тест**

Создать `tests/about-route.test.js`:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { getRoutes } from '../src/routes.js'
import { renderHead } from '../scripts/prerender.js'
import { company } from '../src/data/company.js'

test('/about есть в русских маршрутах и отсутствует в английских', () => {
  const ru = getRoutes('ru').find((r) => r.path === '/about')

  assert.ok(ru, 'нет /about в ru')
  assert.equal(ru.langPair, false, 'английской пары у страницы нет')
  assert.equal(getRoutes('en').find((r) => r.path === '/about'), undefined)
})

test('страница без языковой пары не получает hreflang и при поднятой en', () => {
  const route = getRoutes('ru').find((r) => r.path === '/about')
  const head = renderHead(route, 'https://noda-auto.com', { enIsLive: true })

  assert.ok(!head.includes('hreflang'))
  assert.ok(head.includes('rel="canonical" href="https://noda-auto.com/about"'))
})

test('реквизиты заполнены — иначе регион в Вебмастере не подтвердить', () => {
  for (const field of ['legalName', 'inn', 'legalAddress', 'phone', 'director']) {
    assert.ok(
      company[field] && !String(company[field]).includes('['),
      `поле ${field} не заполнено или оставлен плейсхолдер`,
    )
  }
})

test('ИНН выглядит как ИНН юридического лица', () => {
  assert.match(String(company.inn), /^\d{10}$/, 'у ООО ИНН из 10 цифр')
})

test('организация в JSON-LD несёт реквизиты, а не только название', () => {
  const route = getRoutes('ru').find((r) => r.path === '/about')

  assert.equal(route.jsonLd['@type'], 'Organization')
  assert.equal(route.jsonLd.taxID, String(company.inn))
  assert.ok(route.jsonLd.address, 'без адреса разметка организации бесполезна')
})
```

- [ ] **Шаг 2: Запустить тест, убедиться что падает**

Запустить: `node --test tests/about-route.test.js`
Ожидается: FAIL — модуля `src/data/company.js` не существует.

- [ ] **Шаг 3: Создать файл реквизитов**

Создать `src/data/company.js`:

```js
// Реквизиты оператора. Лежат отдельным файлом, потому что их читают трое:
// страница «О компании», политика обработки данных и разметка организации.
//
// Пустые значения ломают тест намеренно: без адреса и телефона на сайте
// Яндекс.Вебмастер не подтвердит регион, а политика ПДн без оператора
// недействительна.
export const company = {
  legalName: 'ООО «ЭНТОРИ»',
  inn: '',
  legalAddress: '',
  phone: '',
  director: 'Наталья Николаевна',
  email: '',
}
```

Значения заполняет Георгий. До тех пор тест «реквизиты заполнены» красный — и это правильно: страница с пустым ИНН хуже, чем её отсутствие.

- [ ] **Шаг 4: Добавить маршрут**

В `src/routes.js` перед `return` добавить:

```js
  // «О компании» — только у русской версии: оператор российский, реквизиты
  // нужны для подтверждения региона в Вебмастере и для политики ПДн.
  // langPair: false — английской пары нет, hreflang вёл бы в 404.
  const about = {
    path: '/about',
    changefreq: 'monthly',
    priority: '0.6',
    langPair: false,
    title: t.meta.aboutTitle,
    description: t.meta.aboutDesc,
    ogDescription: t.meta.aboutDesc,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'NODA',
      legalName: company.legalName,
      url: origin,
      taxID: String(company.inn),
      telephone: company.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: company.legalAddress,
        addressCountry: 'RU',
      },
    },
  }
```

Импорт дополнить: `import { company } from './data/company.js'`.
`return` дополнить: `...(lang === 'ru' ? [about] : [])`.

- [ ] **Шаг 5: Добавить тексты**

В `src/i18n/ru.js` в блок `meta`:

```js
    aboutTitle: 'О компании NODA — реквизиты и контакты',
    aboutDesc:
      'NODA — автоматизация бизнеса с помощью ИИ. Юридическое лицо, реквизиты, адрес и телефон для связи. Работаем по договору с закрывающими документами.',
```

- [ ] **Шаг 6: Создать страницу**

Создать `src/pages/About.jsx` по образцу `src/pages/Privacy.jsx`: `Seo` с `langPair={false}`, шапка, реквизиты из `company`, телефон ссылкой `tel:`, кнопка в телеграм, подвал. Заголовок `h1` — «О компании».

- [ ] **Шаг 7: Зарегистрировать в роутере**

В `src/App.jsx` добавить маршрут рядом с `/privacy`, катч-олл `*` оставить последним.

- [ ] **Шаг 8: Запустить тесты и сборку**

Запустить: `node --test tests/` — ожидается PASS, кроме теста на заполненность реквизитов, пока их нет.
Запустить: `npm run build` — ожидается успех, число страниц выросло на одну, `verify-prerender` зелёный.

- [ ] **Шаг 9: Коммит**

```bash
git add src/pages/About.jsx src/data/company.js src/routes.js src/App.jsx src/i18n/ru.js tests/about-route.test.js
git commit -m "Добавить страницу «О компании» с реквизитами оператора

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Что ждёт Георгия

| Что | Зачем | Без этого |
|---|---|---|
| Номер счётчика Метрики | подставить в `metrikaCounterIds.ru` | код готов, данные не собираются |
| ИНН, юрадрес, телефон, email | `src/data/company.js` | страница «О компании» с пустыми полями, регион не подтвердить |
| Переобход 15 статей в Вебмастере или OAuth-токен | новые заголовки попадут в выдачу | ждать обхода недели |
| Решение по московскому адресу | второй регион | только Петербург |
