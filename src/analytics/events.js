// Все события Umami сайта — в одном месте. Компоненты импортируют имена
// отсюда, а не пишут строками: так тест проверяет формат каждого имени,
// а в отчёте Umami остаётся одна система имён.
//
// Схема та же, что у /giorgi с первого дня: <страница>-<действие>, kebab-case.
// Одно имя на действие, место действия — в свойствах события: цель в Umami
// заводится на имя, а разбивка по местам видна в свойствах.
// Длина имени строго меньше 50: длиннее Umami молча обрезает.
export const EVENTS = {
  // /giorgi — живут с 5 октября 2026 и копят статистику. Не переименовывать.
  giorgiTelegram: 'giorgi-telegram',
  giorgiWrite: 'giorgi-write',
  giorgiConsult: 'giorgi-consult',
  giorgiSite: 'giorgi-site',

  // Главная
  homeTelegram: 'home-telegram', // { place: 'cta' | 'founder' | 'footer' | 'form-error' }
  homeMax: 'home-max', // { place: 'founder' }
  homeLeadSubmit: 'home-lead-submit',
  homeLeadError: 'home-lead-error', // { reason: 'network' | 'server' | 'invalid' }
  homeCaseArticle: 'home-case-article', // { case: id кейса }

  // Статьи блога
  blogArticleRead: 'blog-article-read', // { slug }
  blogArticleTelegram: 'blog-article-telegram', // { slug, place?: 'form-error' }
  blogLeadSubmit: 'blog-lead-submit', // { slug } — форма в конце статьи
  blogLeadError: 'blog-lead-error', // { slug, reason }
}
