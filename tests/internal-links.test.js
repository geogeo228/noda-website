import test from 'node:test'
import assert from 'node:assert/strict'
import { gradeOrphans, gradeHomepageReach } from '../scripts/grade-linking.js'

// Поисковик находит страницы, переходя по ссылкам внутри сайта. Страница,
// на которую не ведёт ни одна ссылка, для него почти не существует — быть
// в карте сайта недостаточно. 11 октября 2026 краулер нашёл у нас две такие
// беды сразу: /giorgi без единой входящей ссылки и 14 статей из 15, которые
// главная не поддерживала вообще.

test('страница без входящих ссылок находится', () => {
  const found = gradeOrphans([
    { path: '/', html: '<a href="/blog">Блог</a>' },
    { path: '/blog', html: '<a href="/">Домой</a>' },
    { path: '/giorgi', html: '<a href="/">Домой</a>' },
  ])

  assert.equal(found.length, 1, 'сирота обязана находиться')
  assert.match(found[0], /\/giorgi/)
})

test('главная сиротой не считается', () => {
  // На главную ведут внешние ссылки и прямой ввод адреса: требовать
  // входящую ссылку с самого сайта бессмысленно, она точка входа.
  const found = gradeOrphans([{ path: '/', html: '<p>без ссылок вовсе</p>' }])
  assert.deepEqual(found, [])
})

test('ссылка на себя не спасает от сиротства', () => {
  // Canonical и ссылка «вернуться наверх» ведут на ту же страницу.
  // Если считать их входящими, сирота притворится связанной.
  const found = gradeOrphans([
    { path: '/', html: '<a href="/blog">Блог</a>' },
    { path: '/blog', html: '<a href="/">Домой</a>' },
    { path: '/giorgi', html: '<a href="/giorgi">Я сам</a>' },
  ])

  assert.equal(found.length, 1)
  assert.match(found[0], /\/giorgi/)
})

test('связанная страница молчит', () => {
  const found = gradeOrphans([
    { path: '/', html: '<a href="/blog">Блог</a> <a href="/giorgi">Основатель</a>' },
    { path: '/blog', html: '<a href="/">Домой</a>' },
    { path: '/giorgi', html: '<a href="/">Домой</a>' },
  ])

  assert.deepEqual(found, [])
})

test('ссылка со слешем на конце и с адресом целиком тоже считается', () => {
  // В разметке соседствуют три записи одного адреса: относительная,
  // со слешем на конце и полная с доменом. Страж, который видит только
  // первую, объявит сиротой связанную страницу и его отключат.
  const found = gradeOrphans([
    { path: '/', html: '<a href="/blog/">Блог</a> <a href="https://noda-auto.com/giorgi">Основатель</a>' },
    { path: '/blog', html: '' },
    { path: '/giorgi', html: '' },
  ])

  assert.deepEqual(found, [])
})

test('статья, до которой не доводит ни одна страница, находится', () => {
  // Самый частый у нас случай: статья есть в карте сайта и отдаётся
  // кодом 200, но ссылки на неё нет ни на главной, ни в списке блога.
  const found = gradeOrphans([
    { path: '/', html: '<a href="/blog">Блог</a>' },
    { path: '/blog', html: '<a href="/blog/first">Первая</a>' },
    { path: '/blog/first', html: '<a href="/blog">Назад</a>' },
    { path: '/blog/second', html: '<a href="/blog">Назад</a>' },
  ])

  assert.equal(found.length, 1)
  assert.match(found[0], /second/)
})

// Сиротой статья не считается: на неё ведёт список блога. Но одна входящая
// ссылка из списка — это всё, что у неё есть, и вес с главной до неё не
// доходит. Георгий выбрал блок разборов на главной со ссылкой на каждую
// статью — этот страж следит, чтобы блок не усох обратно.

test('главная обязана вести на каждую статью', () => {
  const found = gradeHomepageReach(
    '<a href="/blog">Блог</a> <a href="/blog/first">Первая</a>',
    ['/blog/first', '/blog/second'],
  )

  assert.equal(found.length, 1, 'непокрытая статья обязана находиться')
  assert.match(found[0], /second/)
})

test('когда главная ведёт на все статьи, страж молчит', () => {
  const found = gradeHomepageReach(
    '<a href="/blog/first">Первая</a> <a href="/blog/second/">Вторая</a>',
    ['/blog/first', '/blog/second'],
  )

  assert.deepEqual(found, [], 'слеш на конце — тот же адрес')
})

test('без статей вовсе страж не придирается', () => {
  // Пока статей нет, проверять нечего: страж не должен валить сборку
  // сайта, у которого просто нет блога.
  assert.deepEqual(gradeHomepageReach('<p>нет ссылок</p>', []), [])
})
