import { contactKind, telegramUsername } from '../../../src/lib/lead.js'

// Простой текст без parse_mode: пользовательский ввод не надо экранировать,
// и никакая звёздочка в имени не сломает отправку. Ссылки Telegram делает
// кликабельными сам.
export function formatLeadMessage(lead, { page } = {}) {
  let contact = lead.contact
  if (contactKind(contact) === 'telegram') {
    contact = `${contact} — https://t.me/${telegramUsername(contact)}`
  }

  const lines = [
    'Заявка с сайта noda-auto.com',
    '',
    `Имя: ${lead.name}`,
    `Контакт: ${contact}`,
  ]
  if (lead.task) lines.push(`Задача: ${lead.task}`)
  if (page) lines.push(`Страница: ${page}`)
  // Фиксируем в самой заявке: Telegram — единственное место, где она хранится
  if (lead.consent) lines.push('Согласие на обработку данных: да')
  return lines.join('\n')
}
