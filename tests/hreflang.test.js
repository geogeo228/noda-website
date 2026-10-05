import test from 'node:test'
import assert from 'node:assert/strict'
import { renderHead } from '../scripts/prerender.js'

const route = { path: '/blog', title: 't', description: 'd', ogDescription: 'o', jsonLd: null }

// hreflang должен появляться ровно тогда, когда английская версия поднята:
// ссылка на неотвечающий поддомен — битая разметка, а её отсутствие после
// запуска en оставляет языковые версии несвязанными. Проверить это
// на текущем enIsLive нельзя — он константа модуля, поэтому renderHead
// принимает значение опцией.

test('при поднятой английской версии проставляются все три hreflang', () => {
  const head = renderHead(route, 'https://noda-auto.com', { enIsLive: true })

  assert.ok(head.includes('hreflang="ru"'))
  assert.ok(head.includes('hreflang="en"'))
  assert.ok(head.includes('hreflang="x-default"'))
  assert.ok(head.includes('https://en.noda-auto.com/blog'), 'en-версия должна быть адресуема')
})

test('пока английская версия не поднята, hreflang не проставляется', () => {
  const head = renderHead(route, 'https://noda-auto.com', { enIsLive: false })

  assert.ok(!head.includes('hreflang'), 'ссылка вела бы на неотвечающий поддомен')
  assert.ok(head.includes('rel="canonical"'), 'canonical обязан стоять всегда')
})
