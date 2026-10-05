// Правила заявки с сайта. Один модуль на клиент и на воркер
// (worker/lead-form): форма подсвечивает ошибку до отправки, воркер
// перепроверяет то же самое — и правила не могут разъехаться.
// Без обращений к window и import.meta: файл читают браузер, Node в тестах
// и бандл воркера.

export const LIMITS = { name: 80, contact: 80, task: 300 }

// Быстрее человек три поля не заполнит. Отправка раньше — почти наверняка бот.
export const MIN_FILL_MS = 2500

function clean(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : ''
}

export function normalizeLead(raw) {
  const r = raw || {}
  // Согласие на обработку персональных данных (152-ФЗ) — только явное true
  return { name: clean(r.name), contact: clean(r.contact), task: clean(r.task), consent: r.consent === true }
}

const PHONE_CHARS = /^[+\d\s().-]+$/
const TG_USERNAME = /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/

// Ник без @ и ссылка t.me тоже считаются: собственник пишет так, как привык.
export function telegramUsername(contact) {
  const s = contact.replace(/^https?:\/\//i, '').replace(/^t\.me\//i, '').replace(/^@/, '')
  return TG_USERNAME.test(s) ? s : null
}

export function contactKind(contact) {
  const s = clean(contact)
  if (!s) return null
  if (PHONE_CHARS.test(s)) {
    const digits = s.replace(/\D/g, '').length
    return digits >= 7 && digits <= 15 ? 'phone' : null
  }
  return telegramUsername(s) ? 'telegram' : null
}

// Возвращает объект ошибок по полям; пустой объект — заявка годная.
// Коды ошибок (required / format / long) переводит в слова интерфейс.
export function validateLead(lead) {
  const errors = {}
  if (!lead.name) errors.name = 'required'
  else if (lead.name.length > LIMITS.name) errors.name = 'long'

  if (!lead.contact) errors.contact = 'required'
  else if (lead.contact.length > LIMITS.contact) errors.contact = 'long'
  else if (!contactKind(lead.contact)) errors.contact = 'format'

  if (lead.task.length > LIMITS.task) errors.task = 'long'

  if (lead.consent !== true) errors.consent = 'required'
  return errors
}
