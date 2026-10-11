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

test('различие между роботом и обычным браузером — находка', () => {
  // Самый частый случай: человек видит сайт, робот получает заглушку.
  const found = gradeCrawlerAccess([
    { ua: 'Mozilla', path: '/', status: 200 },
    { ua: 'GPTBot', path: '/', status: 503 },
  ])

  assert.equal(found.length, 1)
  assert.match(found[0], /GPTBot/)
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
