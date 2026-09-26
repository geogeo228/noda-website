import test from 'node:test'
import assert from 'node:assert/strict'
import { escapeAttr, renderHead } from '../scripts/prerender.js'

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

test('JSON-LD не может закрыть тег script', () => {
  const head = renderHead(
    {
      path: '/',
      title: 't',
      description: 'd',
      ogDescription: 'o',
      jsonLd: { name: '</script><script>alert(1)</script>' },
    },
    'https://noda-auto.com',
  )

  assert.ok(!head.includes('</script><script>'), 'JSON-LD вырвался из тега')
})
