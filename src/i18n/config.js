// Языковая конфигурация без обращений к import.meta — файл читает и клиент,
// и vite.config.js при генерации sitemap/robots.

export const origins = {
  ru: 'https://noda-auto.com',
  en: 'https://en.noda-auto.com',
}

// Пока английская версия не поднята на поддомене, hreflang на неё ставить
// нельзя: ссылка ведёт в никуда, и поисковик считает разметку битой.
// Переключить в true в тот же день, когда en.noda-auto.com начнёт отвечать.
export const enIsLive = false

// Идентификаторы сайтов в нашем Umami (self-hosted на Railway, скрипт
// отдаётся с analytics.noda-auto.com). У каждой языковой версии он свой:
// одним ID два домена не разделить, статистика смешалась бы в одну кучу.
// null означает «счётчик не подключать» — для английской версии сайт
// в Umami появится, когда поднимем поддомен.
export const umamiWebsiteIds = {
  ru: '37ad3e20-e916-4fd6-bb35-1572b12a238c',
  en: null,
}

export const umamiHost = 'https://analytics.noda-auto.com'
