import test from 'node:test'
import assert from 'node:assert/strict'
import { gradeBreadcrumbs } from '../scripts/grade-breadcrumbs.js'

// Поисковик видит статью как самостоятельную страницу, пока в её HTML
// нет и видимой строки крошек, и разметки BreadcrumbList. Тогда он не знает,
// что статья лежит внутри «Кейсов», и иерархия сайта в поиске рассыпается.
// Страж ниже проходит по готовому HTML пререндера и находит обе беды раздельно.

const VISIBLE_LINE = '<nav class="article-crumbs"><a href="/">Главная</a></nav>'
const SCHEMA_BREAD = '"@type":"BreadcrumbList"'

test('страница без видимой строки крошек находится', () => {
  // Разметка есть, а строки в HTML нет: поисковик покажет статью без
  // иерархии — страж обязан это поймать и сообщить, где именно.
  const found = gradeBreadcrumbs([
    { path: '/blog/article-a', html: `<script>${SCHEMA_BREAD}</script>` },
  ])

  assert.equal(found.length, 1, 'пропавшая видимая строка обязана находиться')
  assert.match(found[0], /article-a/)
  assert.match(found[0], /видимой строки|article-crumbs/i)
})

test('страница без JSON-LD BreadcrumbList находится', () => {
  // Видимая строка есть, а разметки нет: пользователь видит иерархию,
  // но поисковик — нет. Эту половину страж тоже ловит отдельно, чтобы
  // по сообщению было видно, что чинить.
  const found = gradeBreadcrumbs([
    { path: '/blog/article-b', html: VISIBLE_LINE },
  ])

  assert.equal(found.length, 1, 'пропавшая разметка обязана находиться')
  assert.match(found[0], /article-b/)
  assert.match(found[0], /BreadcrumbList/)
})

test('страница с обеими составляющими молчит', () => {
  // Зелёная ветка: строка и разметка есть — страж не должен придираться.
  // Это не «тест ради теста», а защита от ложноположительного падения
  // сборки, когда условия выполнены.
  const found = gradeBreadcrumbs([
    {
      path: '/blog/article-c',
      html: `${VISIBLE_LINE}<script>${SCHEMA_BREAD}</script>`,
    },
  ])

  assert.deepEqual(found, [])
})

test('пустой список страниц не вызывает жалоб', () => {
  // Пока статей нет, проверять нечего. Страж не должен валить сборку
  // сайта, у которого просто нет блога: иначе его отключат как «красный
  // без причины».
  assert.deepEqual(gradeBreadcrumbs([]), [])
})

test('две беды на одной странице дают две строки', () => {
  // Потерять можно обе части разом — тогда страж должен назвать обе, чтобы
  // правка была понятной. Не одной строкой про «крошки пропали вообще»,
  // а конкретно: нет видимой строки и нет разметки, по отдельности.
  const found = gradeBreadcrumbs([
    { path: '/blog/article-d', html: '<p>вообще никаких крошек</p>' },
  ])

  assert.equal(found.length, 2, 'обе беды обязаны быть названы отдельно')
  // Обе строки должны указывать на ту же страницу — иначе при двух падениях
  // теряется привязка «где чинить».
  for (const line of found) assert.match(line, /article-d/)
})

test('видимая строка среди прочих классов всё равно считается', () => {
  // React может добавить соседний класс, и `class="article-crumbs something"`
  // это та же строка крошек. Страж по подстроке ровно `class="article-crumbs"`
  // не пропустит её — а должен.
  const found = gradeBreadcrumbs([
    {
      path: '/blog/article-e',
      html: `<nav class="article-crumbs extra-modifier">x</nav><script>${SCHEMA_BREAD}</script>`,
    },
  ])

  assert.deepEqual(found, [])
})

test('классы разделителей не выдают себя за строку крошек', () => {
  // Найдено при ревью 18.10.2026: страж искал `article-crumbs` по границе
  // слова, а `-` эту границу даёт — поэтому класс разделителя
  // `article-crumbs-sep` сходил за саму строку крошек. Страж молчал на
  // странице, где самой строки уже нет, и доказать его срабатывание было
  // нельзя. Проверяем список классов по именам, а не по подстроке.
  const found = gradeBreadcrumbs([
    {
      path: '/blog/article-f',
      html:
        '<nav class="article-back"><span class="article-crumbs-sep">/</span>' +
        `<span class="article-crumbs-current">x</span></nav><script>${SCHEMA_BREAD}</script>`,
    },
  ])

  assert.equal(found.length, 1, 'страница без самой строки крошек обязана находиться')
  assert.match(found[0], /article-f/)
})
