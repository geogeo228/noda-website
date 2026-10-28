import ru from './ru.js'
import en, { EN_READY } from './en.js'

const dictionaries = { ru, en }

export const LANGS = EN_READY ? ['ru', 'en'] : ['ru']

// Глубокое слияние: перевод поверх русского оригинала. Массивы заменяются
// целиком, но только если в переводе столько же элементов, иначе слайд
// получил бы половину плиток; тогда остаётся русский вариант.
export function mergeDeep(base, over) {
  if (over === undefined || over === null) return base
  if (Array.isArray(base)) {
    if (!Array.isArray(over) || over.length !== base.length) return base
    return base.map((item, i) => mergeDeep(item, over[i]))
  }
  if (base && typeof base === 'object') {
    const out = {}
    for (const key of Object.keys(base)) out[key] = mergeDeep(base[key], over[key])
    return out
  }
  return typeof over === typeof base ? over : base
}

export function getDict(lang, dicts = dictionaries) {
  if (lang === 'ru' || !dicts[lang]) return dicts.ru
  return mergeDeep(dicts.ru, dicts[lang])
}

// Язык из адреса: ?lang=en. Любое другое значение даёт русский.
export function langFromSearch(search) {
  const value = new URLSearchParams(search || '').get('lang')
  return value === 'en' ? 'en' : 'ru'
}
