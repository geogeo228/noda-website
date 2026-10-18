import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// Каждая кнопка «в Telegram» на русской главной и в статье пишет в Umami
// своё событие через атрибут data-umami-event (скрипт Umami ловит клики сам).
// Без этого статистика показывает «ноль действий», и непонятно, никто
// не нажал или мы просто не считаем.
const EXPECTED = [
  ['src/components/home/HomeHero.jsx', 'home-hero-telegram'],
  ['src/components/home/StickyCta.jsx', 'home-sticky-telegram'],
  ['src/components/home/HomeCTA.jsx', 'home-cta-telegram'],
  ['src/components/home/Founder.jsx', 'home-founder-telegram'],
  ['src/components/home/HomeFooter.jsx', 'home-footer-telegram'],
  ['src/pages/Article.jsx', 'article-cta-telegram'],
]

for (const [file, event] of EXPECTED) {
  test(`${file}: ссылка в Telegram пишет событие ${event}`, () => {
    const src = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
    const anchors = src.match(/<a\b[^>]*>/g) || []
    const tg = anchors.filter((a) => /t\.me\/|TELEGRAM/.test(a))
    assert.ok(tg.length > 0, 'в файле нет ссылки в Telegram')
    for (const a of tg) {
      assert.match(a, new RegExp(`data-umami-event="${event}"`), `нет события у ссылки: ${a}`)
    }
  })
}

// Свои заходы не считаем: ?notrack=1 в адресе ставит флаг Umami
// umami.disabled в localStorage, ?notrack=0 снимает. Нужен для телефона,
// где нет консоли браузера.
test('applyNoTrack ставит и снимает флаг umami.disabled', async () => {
  const { applyNoTrack } = await import('../src/analytics/notrack.js')
  const store = new Map()
  const storage = {
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  }
  assert.equal(applyNoTrack('?notrack=1', storage), true)
  assert.equal(store.get('umami.disabled'), '1')
  assert.equal(applyNoTrack('?utm_source=event', storage), false)
  assert.equal(store.get('umami.disabled'), '1', 'чужой параметр флаг не трогает')
  assert.equal(applyNoTrack('?notrack=0', storage), true)
  assert.equal(store.has('umami.disabled'), false)
  assert.equal(applyNoTrack('', storage), false)
})

test('applyNoTrack не падает, если localStorage недоступен', async () => {
  const { applyNoTrack } = await import('../src/analytics/notrack.js')
  const broken = { setItem() { throw new Error('blocked') }, removeItem() { throw new Error('blocked') } }
  assert.doesNotThrow(() => applyNoTrack('?notrack=1', broken))
  assert.doesNotThrow(() => applyNoTrack('?notrack=1', undefined))
})
