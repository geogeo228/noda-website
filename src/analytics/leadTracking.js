import { EVENTS } from './events.js'

// События формы заявки по месту, где она стоит. Схема имён
// <страница>-<действие>; какая именно статья — в свойствах (slug).
export function leadTracking(where, slug) {
  if (where === 'article') {
    return {
      submit: EVENTS.blogLeadSubmit,
      error: EVENTS.blogLeadError,
      telegram: EVENTS.blogArticleTelegram,
      data: { slug },
    }
  }
  return {
    submit: EVENTS.homeLeadSubmit,
    error: EVENTS.homeLeadError,
    telegram: EVENTS.homeTelegram,
    data: {},
  }
}
