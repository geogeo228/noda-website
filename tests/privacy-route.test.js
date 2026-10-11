import test from 'node:test'
import assert from 'node:assert/strict'
import { getRoutes } from '../src/routes.js'
import { renderHead } from '../scripts/prerender.js'

// Политика обработки данных есть только у русской версии: оператор — ООО
// «ЭНТОРИ», форма заявки только на noda-auto.com. Английской пары у неё нет,
// и hreflang на en.noda-auto.com/privacy вёл бы в 404 даже после запуска en.

test('/privacy есть в русских маршрутах и отсутствует в английских', () => {
  const ru = getRoutes('ru').find((r) => r.path === '/privacy')
  assert.ok(ru, 'нет /privacy в ru')
  assert.equal(ru.langPair, false)
  assert.ok(ru.title.includes('персональных данных'))
  assert.equal(getRoutes('en').find((r) => r.path === '/privacy'), undefined)
})

test('страница без языковой пары не получает hreflang и при поднятой en', () => {
  const route = getRoutes('ru').find((r) => r.path === '/privacy')
  const head = renderHead(route, 'https://noda-auto.com', { enIsLive: true })
  assert.ok(!head.includes('hreflang'))
  assert.ok(head.includes('rel="canonical" href="https://noda-auto.com/privacy"'))
})

test('страницы с парой по-прежнему получают hreflang', () => {
  const route = getRoutes('ru').find((r) => r.path === '/blog')
  const head = renderHead(route, 'https://noda-auto.com', { enIsLive: true })
  assert.ok(head.includes('hreflang="en"'))
})
