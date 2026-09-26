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

// Страницы кейсов. Существуют только по-русски: английские кейсы остались
// прежними и в этот заход не переводятся, поэтому у этих страниц нет
// языковой пары — alternates: false снимает с них hreflang, который иначе
// повёл бы на несуществующие страницы английского поддомена.
//
// Состав и тексты пришли из работы над кейсами (сессия ws_worker).
// Пять кейсов получают свои URL — те, где есть материал на два абзаца
// и больше; остальные живут карточками на /cases, чтобы не плодить
// тонкие страницы, которые Google считает мусором.
const casePages = [
  {
    path: '/cases',
    priority: '0.9',
    changefreq: 'weekly',
    title: 'Кейсы NODA: автоматизация и AI-решения для бизнеса',
    description:
      'Проекты NODA с измеримым результатом: сбор данных, подбор подрядчиков, боты для заявок, приложения для мероприятий. Что сделали и что это дало клиенту.',
  },
  {
    path: '/cases/passport-data-collection',
    priority: '0.8',
    changefreq: 'monthly',
    title: 'Автоматизация сбора паспортных данных: кейс на 500 человек',
    description:
      'Веб-форма вместо Excel и папки со сканами: 500 участников заполнили данные сами, логист получил готовую таблицу. Как это устроено и что дало клиенту.',
  },
  {
    path: '/cases/event-delegate-app',
    priority: '0.8',
    changefreq: 'monthly',
    title: 'Приложение для делегатов мероприятия: кейс на 74 участника',
    description:
      'Персональный веб-помощник для делегатов поездки: своя программа, логистика и менеджер у каждого. Собрано за три дня, каркас переиспользуется под новые события.',
  },
  {
    path: '/cases/contractor-search-automation',
    priority: '0.8',
    changefreq: 'monthly',
    title: 'Автоматизация подбора подрядчиков по тендерному ТЗ',
    description:
      'Приложение разбирает ТЗ, подбирает подрядчиков из базы и интернета и готовит запросы. Четыре часа работы менеджера превратились в десять минут.',
  },
  {
    path: '/cases/agency-workspace-selfhosted',
    priority: '0.8',
    changefreq: 'monthly',
    title: 'Своя рабочая среда для агентства вместо Notion: кейс',
    description:
      'Self-hosted система для команды ивент-агентства: проект в центре, работа офлайн, данные в своём контуре. Почему ушли с чужого облака и что это дало.',
  },
  {
    path: '/cases/photo-booth-lead-capture',
    priority: '0.8',
    changefreq: 'monthly',
    title: 'AI-фотобудка на стенде: 50 контактов за день мероприятия',
    description:
      'Фотобудка в телефоне гостя собирает имя, компанию и телефон в обмен на AI-портрет. Как стенд начал приносить контакты, а не только внимание.',
  },
]

export function casePageRoutes(lang) {
  if (lang !== 'ru') return []

  return casePages.map((page) => ({
    ...page,
    ogDescription: page.description,
    jsonLd: null,
    alternates: false,
  }))
}

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

  // Страницы кейсов подключаются здесь одной строкой — ...casePageRoutes(lang) —
  // в тот момент, когда роуты /cases и /cases/:slug появятся в src/App.jsx.
  // Раньше нельзя: проверка на билде требует, чтобы у каждого объявленного
  // маршрута была реально отрендеренная страница, и сборка упадёт.
  return [landing, blog, ...articleRoutes, giorgi]
}
