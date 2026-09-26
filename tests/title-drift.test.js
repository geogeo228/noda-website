import test from 'node:test'
import assert from 'node:assert/strict'
import { hoistedTitleOf, assertNoTitleDrift } from '../scripts/prerender.js'

// Метатеги живут в двух местах: src/components/Seo.jsx рисует их для клиента,
// src/routes.js — для ботов. Спек принял это как цену решения при условии,
// что расхождение ловится на билде. Ловит его только сравнение двух РАЗНЫХ
// источников: заголовка, который React поднял из Seo.jsx, с заголовком из routes.js.

test('заголовок, поднятый React из компонента, достаётся из SSR-вывода', () => {
  const appHtml = '<title>Кейсы — NODA</title><meta name="description" content="x"/><div>тело</div>'
  assert.equal(hoistedTitleOf(appHtml), 'Кейсы — NODA')
})

test('расхождение Seo.jsx и routes.js валит сборку', () => {
  const appHtml = '<title>Старый заголовок</title><div>тело</div>'
  assert.throws(
    () => assertNoTitleDrift(appHtml, 'Новый заголовок', '/blog'),
    /\/blog/,
    'расхождение заголовков должно падать с указанием страницы',
  )
})

test('совпадение заголовков проходит молча', () => {
  const appHtml = '<title>Кейсы — NODA</title><div>тело</div>'
  assert.doesNotThrow(() => assertNoTitleDrift(appHtml, 'Кейсы — NODA', '/blog'))
})

test('страница без поднятого заголовка не валит сборку', () => {
  // У 404 своего маршрута в routes.js нет, и сверять его не с чем.
  assert.doesNotThrow(() => assertNoTitleDrift('<div>тело</div>', null, '/404'))
})
