import test from 'node:test'
import assert from 'node:assert/strict'
import { casePageRoutes } from '../src/routes.js'
import { renderHead } from '../scripts/prerender.js'

// Страницы кейсов существуют только по-русски: английские кейсы остались
// прежними, и переводить их в этот заход не планируется. Значит у них нет
// языковой пары, и hreflang на en.noda-auto.com/cases вёл бы в никуда.

test('кейсы регистрируются только в русской сборке', () => {
  assert.equal(casePageRoutes('en').length, 0, 'в английской сборке кейсов быть не должно')
  assert.equal(casePageRoutes('ru').length, 6, 'ожидались /cases и пять страниц кейсов')
})

test('у каждой страницы кейса есть путь, title и description', () => {
  for (const route of casePageRoutes('ru')) {
    assert.match(route.path, /^\/cases(\/[a-z0-9-]+)?$/, `странный путь: ${route.path}`)
    assert.ok(route.title.trim().length > 0, `пустой title у ${route.path}`)
    assert.ok(route.description.trim().length > 0, `пустой description у ${route.path}`)
  }
})

test('страница без языковой пары не получает hreflang даже при поднятой английской версии', () => {
  const route = casePageRoutes('ru')[0]
  const head = renderHead(route, 'https://noda-auto.com', { enIsLive: true })

  assert.ok(!head.includes('hreflang'), 'hreflang повёл бы на несуществующую английскую страницу')
  assert.ok(head.includes('rel="canonical"'), 'canonical при этом обязан остаться')
})

test('обычная страница при поднятой английской версии hreflang получает', () => {
  const route = { path: '/blog', title: 't', description: 'd', ogDescription: 'o', jsonLd: null }
  const head = renderHead(route, 'https://noda-auto.com', { enIsLive: true })

  assert.ok(head.includes('hreflang="ru"'))
  assert.ok(head.includes('hreflang="x-default"'))
})
