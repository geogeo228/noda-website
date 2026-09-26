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

// React 19 сам поднимает <title>, <meta>, <link> и JSON-LD из дерева
// компонентов и при серверном рендере эмитит их в начало вывода. Нам они
// не нужны: источник правды для head — src/routes.js, а два canonical
// на странице мы уже один раз пережили. Вырезаем их из тела; на клиенте
// React создаст их заново и поднимет в head, а статические теги оттуда
// к тому моменту снимет src/seo-defaults.js.
function stripHoistedTags(appHtml) {
  return appHtml
    .replace(/<title[^>]*>[\s\S]*?<\/title>/g, '')
    .replace(/<meta\b[^>]*>/g, '')
    .replace(/<link\b[^>]*>/g, '')
    .replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g, '')
}

// Заголовок, который React поднял из src/components/Seo.jsx. Нужен, чтобы
// сверить его с src/routes.js: это два РАЗНЫХ источника одних и тех же
// метатегов, и сравнение сгенерированного HTML с routes.js их разъезд
// не поймало бы — оно сравнивает источник сам с собой.
export function hoistedTitleOf(appHtml) {
  const match = appHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/)
  return match ? match[1].trim() : null
}

export function assertNoTitleDrift(appHtml, expectedTitle, path) {
  if (expectedTitle === null) return

  const rendered = hoistedTitleOf(appHtml)
  if (rendered === null) return

  if (rendered !== expectedTitle) {
    throw new Error(
      `${path}: заголовок разъехался. src/components/Seo.jsx рисует ` +
        `"${rendered}", src/routes.js объявляет "${expectedTitle}". ` +
        'Клиент и поисковик увидят разные заголовки — поправьте оба места.',
    )
  }
}

function buildPage(template, appHtml, headHtml) {
  return template
    .replace(/\s*<title data-default-seo>[\s\S]*?<\/title>/g, '')
    .replace(/\s*<meta data-default-seo[^>]*>/g, '')
    .replace('</head>', `  ${headHtml}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${stripHoistedTags(appHtml)}</div>`)
}

async function main() {
  const { render } = await import(`../${ssrDir}/entry-server.js`)
  const template = readFileSync(join(outDir, 'index.html'), 'utf8')
  const routes = getRoutes(lang)

  for (const route of routes) {
    const appHtml = await render(route.path)
    assertNoTitleDrift(appHtml, route.title, route.path)
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
