import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { getRoutes, getHiddenRoutes } from '../src/routes.js'
import { renderHiddenHead } from '../scripts/prerender.js'
import ru from '../src/deck/content/ru.js'
import { mergeDeep, getDict, langFromSearch } from '../src/deck/content/index.js'

// Презентации /deck и /intro: закрыты от индексации и не должны попасть в
// sitemap, проверка перелинковки и английскую сборку.

test('скрытые маршруты не входят в список для sitemap', () => {
  const visible = getRoutes('ru').map((r) => r.path)
  for (const r of getHiddenRoutes('ru')) assert.ok(!visible.includes(r.path), `${r.path} в sitemap`)
  assert.deepEqual(getHiddenRoutes('ru').map((r) => r.path), ['/deck', '/intro'])
  assert.deepEqual(getHiddenRoutes('en'), [])
})

test('head скрытой страницы: noindex есть, canonical и hreflang нет', () => {
  for (const r of getHiddenRoutes('ru')) {
    const head = renderHiddenHead(r)
    assert.ok(/name="robots" content="noindex, nofollow"/.test(head))
    assert.ok(!head.includes('canonical'))
    assert.ok(!head.includes('hreflang'))
    assert.ok(head.includes(`<title data-default-seo>${r.title}</title>`))
  }
})

test('страницы презентаций сами ставят noindex через Helmet', () => {
  for (const f of ['Deck.jsx', 'Intro.jsx']) {
    const src = readFileSync(new URL(`../src/pages/${f}`, import.meta.url), 'utf8')
    assert.ok(src.includes('name="robots" content="noindex, nofollow"'), `${f}: нет noindex`)
  }
})

test('заголовки в routes.js и в словаре совпадают (иначе упадёт проверка дрейфа)', () => {
  const [deck, intro] = getHiddenRoutes('ru')
  assert.equal(deck.title, ru.ui.docTitleDeck)
  assert.equal(intro.title, ru.ui.docTitleIntro)
})

test('словарь: 13 слайдов клиентской и 6 визитки, у каждого тег', () => {
  assert.equal(Object.keys(ru.deck).length, 13)
  assert.equal(Object.keys(ru.intro).length, 6)
  for (const kind of ['deck', 'intro']) {
    for (const [id, slide] of Object.entries(ru[kind])) {
      assert.ok(slide.tag && slide.title, `${kind}.${id}: нет tag или title`)
    }
  }
})

test('в текстах нет цен', () => {
  const all = JSON.stringify(ru)
  assert.ok(!/₽|руб|\$\s?\d|\d\s?(тыс\.?\s)?р\./i.test(all), 'в словаре найдена цена')
  assert.ok(/первая консультация бесплатно/i.test(all))
})

test('запрещённые цифры не вернулись в тексты', () => {
  const all = JSON.stringify(ru)
  for (const banned of ['1000+', '100+ проектов', 'планёрк', 'демо']) {
    assert.ok(!all.toLowerCase().includes(banned), `в словаре есть «${banned}»`)
  }
  assert.ok(!/(^|\D)0 человек/.test(all), 'в словаре есть «0 человек»')
})

test('перевод накладывается на русский и не ломает форму', () => {
  const base = { a: 'x', list: [{ n: '1' }, { n: '2' }], deep: { k: 'v' } }
  assert.deepEqual(mergeDeep(base, { a: 'y' }), { a: 'y', list: [{ n: '1' }, { n: '2' }], deep: { k: 'v' } })
  // массив другой длины заменять нельзя: слайд получил бы половину плиток
  assert.deepEqual(mergeDeep(base, { list: [{ n: 'a' }] }).list, base.list)
  assert.deepEqual(mergeDeep(base, { list: [{ n: 'a' }, { n: 'b' }] }).list, [{ n: 'a' }, { n: 'b' }])
  // другой тип значения игнорируется
  assert.equal(mergeDeep(base, { a: 5 }).a, 'x')
  const dicts = { ru: base, en: { a: 'en' } }
  assert.equal(getDict('en', dicts).a, 'en')
  assert.equal(getDict('de', dicts).a, 'x')
  assert.equal(getDict('ru', dicts).a, 'x')
})

test('язык берётся из ?lang=', () => {
  assert.equal(langFromSearch('?lang=en'), 'en')
  assert.equal(langFromSearch('?lang=de'), 'ru')
  assert.equal(langFromSearch(''), 'ru')
})

test('картинки презентаций существуют и нет сирот', () => {
  const dir = new URL('../public/assets/deck/', import.meta.url).pathname
  const code = ['slides.jsx', 'scenes.jsx', 'parts.jsx']
    .map((f) => readFileSync(new URL(`../src/deck/${f}`, import.meta.url), 'utf8'))
    .join('\n')

  for (const m of code.matchAll(/\$\{A\}\/([\w-]+\.\w+)/g)) {
    assert.ok(existsSync(join(dir, m[1])), `нет файла public/assets/deck/${m[1]}`)
  }
  for (const m of code.matchAll(/'(\/assets\/[^']+)'/g)) {
    const file = new URL(`../public${m[1]}`, import.meta.url)
    assert.ok(existsSync(decodeURIComponent(file.pathname)), `нет файла public${m[1]}`)
  }
  for (const f of readdirSync(dir)) {
    const stem = f.replace(/\.\w+$/, '')
    const style = stem.startsWith('style-') ? stem.slice(6) : null
    assert.ok(code.includes(stem) || (style && code.includes(`'${style}'`)), `сирота: public/assets/deck/${f}`)
  }
})
