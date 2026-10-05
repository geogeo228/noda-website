import test from 'node:test'
import assert from 'node:assert/strict'
import { gradeLive } from '../scripts/verify-live.js'

// Проверка сборки смотрит файлы на диске и поведения сервера не видит.
// Из-за этого 301 с канонических URL на версию со слешем всплыл случайно:
// sitemap и canonical указывают адрес без слеша, а сервер перебрасывает
// на другой — поисковику дают противоречивые указания.

test('страница, отдающая 200 без редиректа, проблем не даёт', () => {
  const problems = gradeLive([
    { path: '/blog', status: 200, redirect: '', title: 'Кейсы — NODA', expectedTitle: 'Кейсы — NODA' },
  ], { notFound: { status: 404, hasNoindex: true } })

  assert.deepEqual(problems, [])
})

test('301 на каноническом URL — проблема, даже если страница в итоге открывается', () => {
  const problems = gradeLive([
    {
      path: '/blog/x',
      status: 301,
      redirect: 'https://noda-auto.com/blog/x/',
      title: '',
      expectedTitle: 'Статья — NODA',
    },
  ], { notFound: { status: 404, hasNoindex: true } })

  assert.equal(problems.length, 1)
  assert.match(problems[0], /301/)
  assert.match(problems[0], /\/blog\/x/)
})

test('несуществующий URL с кодом 200 — soft 404', () => {
  const problems = gradeLive([], { notFound: { status: 200, hasNoindex: false } })

  assert.ok(problems.some((p) => /soft 404/.test(p)), `нет находки про soft 404: ${problems}`)
})

test('страница 404 без noindex — проблема', () => {
  const problems = gradeLive([], { notFound: { status: 404, hasNoindex: false } })

  assert.ok(problems.some((p) => /noindex/.test(p)), `нет находки про noindex: ${problems}`)
})

test('заголовок на живом сайте расходится с routes.js', () => {
  const problems = gradeLive([
    { path: '/', status: 200, redirect: '', title: 'Старый заголовок', expectedTitle: 'Новый заголовок' },
  ], { notFound: { status: 404, hasNoindex: true } })

  assert.equal(problems.length, 1)
  assert.match(problems[0], /заголовок/)
})

test('пустой заголовок на живом сайте — проблема', () => {
  const problems = gradeLive([
    { path: '/', status: 200, redirect: '', title: '', expectedTitle: 'NODA' },
  ], { notFound: { status: 404, hasNoindex: true } })

  assert.equal(problems.length, 1)
})
