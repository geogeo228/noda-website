// Оператор персональных данных сайта noda-auto.com. Единый источник
// реквизитов: их читают политика, страница «О компании», подвал и разметка
// организации в routes.js — значение должно быть одно. Реквизиты взяты из
// договора NODA по Колдун-Боту (Договор_NODA_Колдун-Бот, раздел 9).
// Почта privacy@noda-auto.com — адрес на нашем домене с пересылкой
// через Cloudflare Email Routing.
export const OPERATOR = {
  fullName: 'Общество с ограниченной ответственностью «ЭНТОРИ»',
  shortName: 'ООО «ЭНТОРИ»',
  inn: '7814645258',
  ogrn: '1167847149007',
  address: '194100, г. Санкт-Петербург, пр-кт Лесной, д. 63, литера А, помещ. 1-Н, оф. 418',
  email: 'privacy@noda-auto.com',
  // Полное ФИО — как в ЕГРЮЛ и договоре.
  director: 'Ториашвили Наталья Николаевна',
  phone: '+7 965 750-32-74',
  phoneHref: 'tel:+79657503274',
  telegram: '@BlueFaceBaby99',
  telegramUrl: 'https://t.me/BlueFaceBaby99',
}

// Сведения о юрлице для разметки Organization (schema.org). Общие для
// главной (Home.jsx) и routes.js, чтобы разметка не разъехалась.
export const OPERATOR_JSONLD = {
  legalName: OPERATOR.fullName,
  taxID: OPERATOR.inn,
  identifier: { '@type': 'PropertyValue', propertyID: 'ОГРН', value: OPERATOR.ogrn },
  email: OPERATOR.email,
  telephone: OPERATOR.phoneHref.replace('tel:', ''),
  address: {
    '@type': 'PostalAddress',
    postalCode: '194100',
    addressLocality: 'Санкт-Петербург',
    streetAddress: 'пр-кт Лесной, д. 63, литера А, помещ. 1-Н, оф. 418',
    addressCountry: 'RU',
  },
}

// Дата редакции политики — менять при каждой правке текста.
export const PRIVACY_UPDATED = '11 октября 2026 года'
