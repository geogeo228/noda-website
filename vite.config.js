import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ru from './src/i18n/ru.js'
import en from './src/i18n/en.js'
import { origins, enIsLive, umamiWebsiteIds, umamiHost } from './src/i18n/config.js'
import { getRoutes } from './src/routes.js'

const dictionaries = { ru, en }

const ogLocales = {
  ru: 'ru_RU',
  en: 'en_US',
}

// Подставляет языковые значения в index.html. Дефолтные SEO-теги там нужны
// краулерам, которые не выполняют JS (превью ссылок в мессенджерах), поэтому
// они должны быть на языке сборки, а не всегда на русском.
function htmlLocalePlugin(lang) {
  const t = dictionaries[lang]
  const websiteId = umamiWebsiteIds[lang]
  const umamiScript = websiteId
    ? `<script defer src="${umamiHost}/script.js" data-website-id="${websiteId}"></script>`
    : '<!-- Umami: для этой языковой версии сайт ещё не создан -->'

  const values = {
    '%%HTML_LANG%%': t.htmlLang,
    '%%UMAMI_SCRIPT%%': umamiScript,
    '%%SITE_TITLE%%': t.meta.siteTitle,
    '%%SITE_DESC%%': t.meta.siteDesc,
    '%%OG_DESC%%': t.meta.ogDesc,
    '%%ORIGIN%%': origins[lang],
    '%%OG_LOCALE%%': ogLocales[lang],
  }

  return {
    name: 'noda-html-locale',
    transformIndexHtml(html) {
      return Object.entries(values).reduce(
        (acc, [token, value]) => acc.replaceAll(token, value),
        html,
      )
    },
  }
}

// Генерирует sitemap.xml и robots.txt под язык сборки. Раньше оба файла
// лежали в public/ статикой и правились руками — при добавлении статьи про
// sitemap легко забыть, а в английскую сборку он попадал бы с русскими URL.
function sitemapPlugin(lang) {
  const origin = origins[lang]

  // Слаги у языковых версий общие — по ним же связываются hreflang.
  // Список маршрутов живёт в src/routes.js: его читают также пререндер
  // и проверка сборки, и добавленная страница должна попасть во все три.
  const routes = getRoutes(lang)

  function alternates(path, langPair) {
    if (!enIsLive || langPair === false) return ''
    return (
      `\n    <xhtml:link rel="alternate" hreflang="ru" href="${origins.ru}${path}" />` +
      `\n    <xhtml:link rel="alternate" hreflang="en" href="${origins.en}${path}" />` +
      `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${origins.en}${path}" />`
    )
  }

  const xmlns =
    'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' +
    (enIsLive ? ' xmlns:xhtml="http://www.w3.org/1999/xhtml"' : '')

  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    `<urlset ${xmlns}>\n` +
    routes
      .map(
        (r) =>
          `  <url>\n    <loc>${origin}${r.path}</loc>${alternates(r.path, r.langPair)}\n` +
          `    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`,
      )
      .join('\n') +
    '\n</urlset>\n'

  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`

  return {
    name: 'noda-sitemap',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
    },
  }
}

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
