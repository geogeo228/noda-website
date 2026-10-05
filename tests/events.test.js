import test from 'node:test'
import assert from 'node:assert/strict'
import { EVENTS } from '../src/analytics/events.js'
import { track } from '../src/analytics/track.js'
import { leadTracking } from '../src/analytics/leadTracking.js'

// Umami молча обрезает имя события длиннее 50 символов: цель перестаёт
// совпадать, и конверсии тихо пропадают из отчёта.
test('имена событий: kebab-case, префикс страницы, короче 50 символов', () => {
  const names = Object.values(EVENTS)
  assert.ok(names.length > 0)
  for (const name of names) {
    assert.match(name, /^(home|blog|giorgi)-[a-z0-9]+(-[a-z0-9]+)*$/, name)
    assert.ok(name.length < 50, `${name}: ${name.length} символов`)
  }
  assert.equal(new Set(names).size, names.length, 'имена повторяются')
})

test('track без window (пререндер) ничего не делает и не падает', () => {
  assert.equal(typeof globalThis.window, 'undefined')
  assert.doesNotThrow(() => track(EVENTS.homeTelegram, { place: 'cta' }))
})

test('track без скрипта Umami не падает, с ним — передаёт имя и данные', () => {
  globalThis.window = {}
  try {
    assert.doesNotThrow(() => track(EVENTS.homeLeadSubmit))

    const calls = []
    window.umami = { track: (...args) => calls.push(args) }
    track(EVENTS.homeTelegram, { place: 'founder' })
    track(EVENTS.homeLeadSubmit)
    assert.deepEqual(calls, [['home-telegram', { place: 'founder' }], ['home-lead-submit']])

    // Сломанный трекер не должен ронять клик по ссылке
    window.umami = { track: () => { throw new Error('boom') } }
    assert.doesNotThrow(() => track(EVENTS.homeTelegram, { place: 'cta' }))
  } finally {
    delete globalThis.window
  }
})

// Эти четыре события на /giorgi копят статистику с 5 октября 2026.
// Переименование обнулит цели в Umami — имена заморожены.
test('события /giorgi не переименованы', () => {
  assert.equal(EVENTS.giorgiTelegram, 'giorgi-telegram')
  assert.equal(EVENTS.giorgiWrite, 'giorgi-write')
  assert.equal(EVENTS.giorgiConsult, 'giorgi-consult')
  assert.equal(EVENTS.giorgiSite, 'giorgi-site')
})

test('форма на главной и в статье шлёт разные события, статья — со slug', () => {
  const home = leadTracking('home')
  const article = leadTracking('article', 'ai-photo-bot')
  assert.equal(home.submit, 'home-lead-submit')
  assert.equal(article.submit, 'blog-lead-submit')
  assert.equal(article.error, 'blog-lead-error')
  assert.deepEqual(article.data, { slug: 'ai-photo-bot' })
  assert.deepEqual(home.data, {})
})
