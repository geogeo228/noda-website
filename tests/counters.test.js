import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { buildCounterScripts } from '../vite.config.js'

// Счётчиков два, и они мешают друг другу тремя способами: попадают в чужую
// языковую версию, конфликтуют порядком загрузки, записывают персональные
// данные. Каждый из трёх проверяется отдельно.

test('у английской версии не подключается ни один счётчик', () => {
  const { umami, metrika } = buildCounterScripts('en')

  assert.ok(!umami.includes('<script'), 'en не должна собирать в русский Umami')
  assert.ok(!metrika.includes('<script'), 'en не должна собирать в русскую Метрику')
})

test('без номера счётчика Метрика не подключается, а Umami работает', () => {
  const { umami, metrika } = buildCounterScripts('ru')

  assert.ok(umami.includes('data-website-id'), 'Umami у русской версии подключён')
  assert.ok(!metrika.includes('mc.yandex.ru'), 'номера нет — тега быть не должно')
})

test('подключённая Метрика ведёт Вебвизор, но не пишет поля формы', () => {
  // Номер придёт от Георгия позже, а требование проверять надо сейчас,
  // поэтому передаём номер явно, не трогая конфиг.
  const { metrika } = buildCounterScripts('ru', { ru: 12345678, en: null })

  assert.ok(metrika.includes('mc.yandex.ru'), 'с номером тег обязан появиться')
  assert.ok(metrika.includes('webvisor: true'), 'Вебвизор нужен — его выбрал Георгий')
  assert.ok(
    metrika.includes('trackForms: false'),
    'запись полей формы — это персональные данные в записях сессий',
  )
})

test('Umami в разметке идёт раньше Метрики', () => {
  // Метрика грузится дольше и на блокировщиках не грузится совсем. Встань она
  // выше — её падение задержало бы инициализацию window.umami, и события
  // на /giorgi молча перестали бы считаться.
  //
  // Порядок задаёт index.html, а не функция, поэтому читаем шаблон: проверка
  // массива из самой функции была бы проверкой самой себя.
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  const umamiAt = html.indexOf('%%UMAMI_SCRIPT%%')
  const metrikaAt = html.indexOf('%%METRIKA_SCRIPT%%')

  assert.ok(umamiAt > -1, 'токен Umami пропал из шаблона')
  assert.ok(metrikaAt > -1, 'токен Метрики пропал из шаблона')
  assert.ok(umamiAt < metrikaAt, 'падение Метрики не должно задерживать window.umami')
})
