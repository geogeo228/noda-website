import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import articles from '../src/data/articles.js'

// Страж для прохода гуманайзером по статьям (18.10.2026). Текст можно
// переписывать живее, но нельзя трогать то, на чём держатся SEO и продажи:
// слаги, заголовки, теги, связи, структуру разделов и любые цифры —
// метрики «2 дня вместо 21» утверждены Георгием, их гуманайзер смягчать не должен.
const before = JSON.parse(readFileSync(new URL('./fixtures/articles-before.json', import.meta.url), 'utf8'))
const numbers = (s) => (s.match(/\d+(?:[\s ]\d{3})*(?:[.,]\d+)?/g) || []).map((n) => n.replace(/[\s ]/g, '')).sort()

test('статей столько же и в том же порядке', () => {
  assert.deepEqual(articles.map((a) => a.slug), before.map((a) => a.slug))
})

for (const old of before) {
  test(`${old.slug}: неизменяемые поля и цифры на месте`, () => {
    const a = articles.find((x) => x.slug === old.slug)
    assert.equal(a.title, old.title, 'заголовок статьи не меняем')
    assert.deepEqual(a.tags, old.tags)
    assert.deepEqual(a.related, old.related)
    assert.equal(a.sections.length, old.sections.length, 'число разделов не меняем')
    a.sections.forEach((s, i) => assert.equal(s.heading, old.sections[i].heading, `заголовок раздела ${i + 1} не меняем`))
    assert.ok(a.desc.length <= 160, `desc длиннее 160 символов: ${a.desc.length}`)
    assert.deepEqual(numbers(a.desc), numbers(old.desc), 'цифры в desc изменились')
    a.sections.forEach((s, i) => {
      assert.deepEqual(numbers(s.body), numbers(old.sections[i].body), `цифры в разделе ${i + 1} изменились`)
      assert.ok(s.body.length >= old.sections[i].body.length * 0.6, `раздел ${i + 1} урезан больше чем на 40%`)
    })
  })
}
