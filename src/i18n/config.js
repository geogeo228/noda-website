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
