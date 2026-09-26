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
