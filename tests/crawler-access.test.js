import test from 'node:test'
import assert from 'node:assert/strict'
import { gradeCrawlerAccess } from '../scripts/verify-live.js'

// Разрешающий robots.txt ничего не гарантирует: блокировка роботов живёт
// уровнем выше — в nginx или у Cloudflare. На 5 октября 2026 все четыре
// робота получали 200, и эта проверка фиксирует состояние.

test('все роботы получили 200 — находок нет', () => {
  const found = gradeCrawlerAccess([
    { ua: 'GPTBot', path: '/', status: 200 },
    { ua: 'GPTBot', path: '/blog/wedding-chatbot', status: 200 },
    { ua: 'YandexBot', path: '/', status: 200 },
  ])

  assert.deepEqual(found, [])
})

test('робот, получивший 403, попадает в находки', () => {
  const found = gradeCrawlerAccess([
    { ua: 'GPTBot', path: '/', status: 200 },
    { ua: 'ClaudeBot', path: '/', status: 403 },
  ])

  assert.equal(found.length, 1)
  assert.match(found[0], /ClaudeBot/)
  assert.match(found[0], /403/)
})

test('блокировка только на вложенном пути тоже находится', () => {
  // Блокировку настраивают по шаблону пути: главная остаётся открытой,
  // а статьи закрываются. Проверка одной главной такое пропустит.
  const found = gradeCrawlerAccess([
    { ua: 'GPTBot', path: '/', status: 200 },
    { ua: 'GPTBot', path: '/blog/wedding-chatbot', status: 403 },
  ])

  assert.equal(found.length, 1)
  assert.match(found[0], /\/blog\/wedding-chatbot/)
})

test('робот получает заглушку там, где браузер получает страницу', () => {
  // Самый частый случай: человек видит сайт, робот — заглушку. Браузерная
  // строка реально запрашивается в проверке живого сайта, поэтому сравнение
  // здесь не выдуманное: в выборке есть и браузер, и роботы.
  const found = gradeCrawlerAccess([
    { ua: 'Mozilla', path: '/', status: 200 },
    { ua: 'GPTBot', path: '/', status: 503 },
  ])

  assert.equal(found.length, 1, 'браузер в порядке, робот — нет')
  assert.match(found[0], /GPTBot/)
  assert.ok(!found[0].includes('Mozilla'), 'на браузер жаловаться не на что')
})

test('robots.txt и sitemap.xml проверяются наравне со страницами', () => {
  // Закрыть роботам sitemap — тихий способ выбить сайт из индекса:
  // страницы открыты, а карта, по которой их находят, нет.
  const found = gradeCrawlerAccess([
    { ua: 'YandexBot', path: '/robots.txt', status: 200 },
    { ua: 'YandexBot', path: '/sitemap.xml', status: 403 },
  ])

  assert.equal(found.length, 1)
  assert.match(found[0], /sitemap\.xml/)
})

test('переадресация роботу — тоже находка, а не норма', () => {
  // 301 на канонический адрес робот отработает, но 302 на заглушку или
  // на главную — это подмена содержимого, и выглядит она как успех.
  const found = gradeCrawlerAccess([
    { ua: 'GPTBot', path: '/blog/wedding-chatbot', status: 302 },
  ])

  assert.equal(found.length, 1)
  assert.match(found[0], /302/)
})
