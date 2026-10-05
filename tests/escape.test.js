import test from 'node:test'
import assert from 'node:assert/strict'
import { escapeAttr, renderHead, stripHoistedTags } from '../scripts/prerender.js'

test('кавычки и скобки в атрибуте экранируются', () => {
  assert.equal(escapeAttr('Кейс "Колдун" & <b>'), 'Кейс &quot;Колдун&quot; &amp; &lt;b&gt;')
})

test('title с кавычками не рвёт разметку head', () => {
  const head = renderHead(
    {
      path: '/blog/x',
      title: 'Бот "Колдун" — NODA',
      description: 'Описание с "кавычками" и <тегом>',
      ogDescription: 'og',
      jsonLd: null,
    },
    'https://noda-auto.com',
  )

  assert.ok(head.includes('<title data-default-seo>Бот &quot;Колдун&quot; — NODA</title>'))

  // Значение каждого атрибута content не должно содержать сырых кавычек:
  // одна такая обрывает атрибут, и остаток описания становится разметкой.
  const contentValues = [...head.matchAll(/content="([^"]*)"/g)].map((m) => m[1])
  assert.equal(contentValues.length, 4, 'ожидались description, og:title, og:description и og:url')
  for (const value of contentValues) {
    assert.ok(!value.includes('"'), `сырая кавычка в content: ${value}`)
    assert.ok(!value.includes('<'), `сырая угловая скобка в content: ${value}`)
  }
  assert.ok(contentValues[0].includes('&quot;кавычками&quot;'), 'кавычки описания не экранированы')
})

test('JSON-LD остаётся в теле: его React считает частью дерева', () => {
  const appHtml =
    '<title>T</title><meta name="description" content="d"/>' +
    '<link rel="canonical" href="https://noda-auto.com/"/>' +
    '<script type="application/ld+json">{"@type":"Organization"}</script>' +
    '<div class="v1-root">тело</div>'

  const stripped = stripHoistedTags(appHtml)

  assert.ok(
    stripped.includes('application/ld+json'),
    'JSON-LD вырезан — это ломает гидрацию на каждой странице, где он есть',
  )
  assert.ok(!stripped.includes('<title>'), 'title должен быть вырезан: его React поднимает в head')
  assert.ok(!stripped.includes('<meta'), 'meta должен быть вырезан')
  assert.ok(!stripped.includes('<link'), 'link должен быть вырезан')
  assert.ok(stripped.includes('тело'), 'разметка страницы должна остаться')
})

test('head не дублирует JSON-LD, который уже есть в теле', () => {
  const head = renderHead(
    {
      path: '/',
      title: 'T',
      description: 'd',
      ogDescription: 'o',
      jsonLd: { '@type': 'Organization' },
    },
    'https://noda-auto.com',
  )

  assert.ok(
    !head.includes('application/ld+json'),
    'два JSON-LD на странице: один из пререндера, другой из React',
  )
})
