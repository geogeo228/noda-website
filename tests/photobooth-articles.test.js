import test from 'node:test'
import assert from 'node:assert/strict'
import articles from '../src/data/articles.js'

// Кластер статей про онлайн ИИ-фотобудку (18.10.2026). Статьи пишет
// исполнитель, поэтому машина стережёт то, что глазом пропускается:
// выдуманные цифры, длину сниппета, ссылку на главную статью кластера
// и названия, которые нельзя раскрывать.
const CLUSTER = [
  'ai-photobooth-likeness',
  'ai-photobooth-1000-guests',
  'ai-photobooth-characters',
  'ai-photobooth-sponsor-logo',
  'ai-photobooth-link-sharing',
  'ai-photobooth-promo',
]
// Только цифры, которые назвал Георгий или которые прозвучали у клиента.
const ALLOWED = new Set(['1', '2', '5', '10', '25', '300', '500', '1000', '100000'])
const FORBIDDEN = /нож|Сергеев|Владимир|Колдун|Дягилев/i
const nums = (s) => (s.match(/\d+(?:[\s ]\d{3})*/g) || []).map((n) => n.replace(/[\s ]/g, ''))

for (const slug of CLUSTER) {
  test(`${slug}: статья есть и собрана по правилам`, () => {
    const a = articles.find((x) => x.slug === slug)
    assert.ok(a, 'статьи нет в src/data/articles.js')
    assert.ok((a.title + ' — NODA').length <= 60, `заголовок длинный: ${a.title.length}`)
    assert.ok(a.desc.length >= 80 && a.desc.length <= 160, `desc ${a.desc.length} символов, нужно 80–160`)
    assert.ok(a.sections.length >= 3 && a.sections.length <= 6, 'разделов от 3 до 6')
    assert.ok(a.related.includes('ai-photobooth-cost'), 'related должен вести на ai-photobooth-cost')
    for (const r of a.related) assert.ok(articles.some((x) => x.slug === r), `related на несуществующую статью ${r}`)
    const text = [a.title, a.desc, ...a.sections.flatMap((s) => [s.heading, s.body])].join('\n')
    for (const n of nums(text)) assert.ok(ALLOWED.has(n), `цифра ${n} не из разрешённых`)
    assert.doesNotMatch(text, FORBIDDEN, 'в тексте имя клиента, его ниша или название продукта')
    for (const s of a.sections) assert.ok(s.body.length >= 200, `раздел «${s.heading}» короче 200 символов`)
  })
}
