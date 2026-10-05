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

// Порог — половина самой короткой реальной страницы: /giorgi даёт
// 237 символов текста. Он ловит пустую страницу, а не короткую.
// Если однажды появится страница короче — поднимать надо не порог, а страницу.
const MIN_BODY_TEXT = 120

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

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
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

  // 3b. JSON-LD на месте и ровно один. Защита от повторения бага с гидрацией:
  // пререндер однажды вырезал этот <script> из тела как «лишний метатег»,
  // и каждая страница с разметкой Organization или Article перерисовывалась
  // на клиенте заново. Два экземпляра — тоже находка: значит кто-то снова
  // начал добавлять его в head поверх того, что рендерит React.
  const jsonLdCount = [...html.matchAll(/type="application\/ld\+json"/g)].length
  if (route.jsonLd && jsonLdCount === 0) {
    fail(route.path, 'в routes.js объявлен JSON-LD, но в документе его нет — гидрация сломается')
  }
  if (jsonLdCount > 1) {
    fail(route.path, `JSON-LD продублирован (${jsonLdCount} штук): один из них лишний`)
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

// 6. Каждый SEO-тег в head помечен data-default-seo. Иначе seo-defaults.js
// его не снимет, а React после гидрации создаст свой — и на странице
// окажется два title или два canonical, то есть ровно августовский баг.
for (const route of routes) {
  const file = fileFor(route.path)
  if (!existsSync(file)) continue

  const html = readFileSync(file, 'utf8')
  const head = html.slice(0, html.indexOf('</head>'))
  const seoTags = [
    ...head.matchAll(/<title\b[^>]*>/g),
    ...head.matchAll(/<meta\b[^>]*name="description"[^>]*>/g),
    ...head.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g),
    // Только те og-свойства, которые рендерит src/components/Seo.jsx:
    // og:type и og:image стоят в шаблоне статически, Helmet их не повторяет.
    ...head.matchAll(/<meta\b[^>]*property="og:(?:title|description|url)"[^>]*>/g),
  ].map((m) => m[0])

  for (const tag of seoTags) {
    if (!tag.includes('data-default-seo')) {
      fail(route.path, `SEO-тег без data-default-seo, после гидрации станет дублем: ${tag}`)
    }
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

if (errors.length > 0) {
  console.error(`\nПререндер не прошёл проверку (${errors.length}):\n`)
  for (const e of errors) console.error(`  ✗ ${e}`)
  console.error('')
  process.exit(1)
}

console.log(`✓ Пререндер проверен: ${routes.length} страниц и 404.html`)
