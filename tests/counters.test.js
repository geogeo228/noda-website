import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildCounterScripts } from '../vite.config.js'
import { gradePolicyMatchesCounters } from '../scripts/verify-live.js'
import { metrikaCounterIds, umamiWebsiteIds } from '../src/i18n/config.js'

// Счётчиков два. Опасности, которые они создают: собрать данные в чужую
// языковую версию, записать в Вебвизор то, что человек печатает в форме,
// и разойтись с тем, что обещает политика обработки данных.

test('английской версии не задано ни одного счётчика', () => {
  // Защита здесь — не в коде, а в конфиге: функция честно соберёт тег для
  // любой версии, которой задан номер. Значит проверять надо сам конфиг.
  // Английская версия публично не существует, и собирать с неё некуда:
  // в Umami у неё отдельного сайта нет, в Метрике счётчика тоже.
  assert.equal(metrikaCounterIds.en, null, 'en не должна собирать в Метрику')
  assert.equal(umamiWebsiteIds.en, null, 'en не должна собирать в русский Umami')

  const { umami, metrika } = buildCounterScripts('en')
  assert.ok(!metrika.includes('mc.yandex.ru'))
  assert.ok(!umami.includes('data-website-id'))
})

test('без номера счётчика тега Метрики нет вовсе', () => {
  // Номер передаём явно, не из конфига: иначе тест покраснеет в тот день,
  // когда Георгий пришлёт номер, и его проще будет удалить, чем починить.
  const { umami, metrika } = buildCounterScripts('ru', { ru: null, en: null })

  assert.ok(umami.includes('data-website-id'), 'Umami у русской версии подключён')
  assert.ok(!metrika.includes('mc.yandex.ru'), 'номера нет — тега быть не должно')
})

test('подключённая Метрика ведёт Вебвизор', () => {
  const { metrika } = buildCounterScripts('ru', { ru: 12345678, en: null })

  assert.ok(metrika.includes('mc.yandex.ru'), 'с номером тег обязан появиться')
  assert.ok(metrika.includes('ym(12345678'), 'номер должен попасть в вызов')
  assert.ok(metrika.includes('webvisor: true'), 'Вебвизор нужен — его выбрал Георгий')
})

test('Метрике не передаются несуществующие параметры', () => {
  // trackForms в справке Яндекса нет: такой параметр Метрика молча
  // проигнорирует, а код и политика обещали бы защиту, которой нет.
  // Запись полей отключается классом ym-disable-keys на самом поле
  // и настройкой «Записывать все поля» в кабинете — см. тест ниже.
  const { metrika } = buildCounterScripts('ru', { ru: 12345678, en: null })

  const known = [
    'accurateTrackBounce', 'childIframe', 'clickmap', 'defer', 'disableYtm',
    'ecommerce', 'params', 'userParams', 'trackHash', 'trackLinks',
    'trustedDomains', 'type', 'webvisor', 'triggerEvent', 'sendTitle', 'ssr',
  ]
  const passed = [...metrika.matchAll(/([a-zA-Z]+):\s*(?:true|false)/g)].map((m) => m[1])

  assert.ok(passed.length > 0, 'параметры вообще должны передаваться')
  for (const name of passed) {
    assert.ok(known.includes(name), `параметра ${name} у Метрики не существует`)
  }
})

test('каждое поле ввода защищено от записи в Вебвизор', () => {
  // Вебвизор записывает содержимое полей, если в кабинете включено
  // «Записывать все поля», и автоматическая маскировка не срабатывает
  // на полях с нестандартными именами. Поэтому каждое поле помечается
  // явно: ym-disable-keys — не записывать, ym-record-keys — записывать.
  //
  // Формы в этой ветке ещё нет. Тест ждёт её: как только появится поле
  // без пометки, он покраснеет.
  const files = []
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name)
      if (statSync(p).isDirectory()) walk(p)
      else if (/\.jsx?$/.test(name)) files.push(p)
    }
  }
  walk(fileURLToPath(new URL('../src', import.meta.url)))

  const unguarded = []
  for (const file of files) {
    const code = readFileSync(file, 'utf8')
    for (const tag of code.matchAll(/<(input|textarea)\b[^>]*>/g)) {
      if (!/ym-(disable|record)-keys/.test(tag[0])) {
        unguarded.push(`${file.split('/src/')[1]}: ${tag[0].slice(0, 60)}`)
      }
    }
  }

  assert.deepEqual(unguarded, [], 'поля без пометки попадут в записи сессий целиком')
})

test('политика не может утверждать, что Метрики нет, когда счётчик стоит', () => {
  // Политика обработки данных — документ оператора, а не маркетинговый
  // текст. Счётчик, выкаченный раньше правки политики, делает её ложной,
  // и заметить это без проверки нельзя.
  const withCounter = '<script>ym(12345678, "init"'
  const policySaysNo = 'Сейчас Яндекс.Метрика на сайте не подключена.'

  const found = gradePolicyMatchesCounters(withCounter, policySaysNo)
  assert.equal(found.length, 1, 'расхождение обязано находиться')
  assert.match(found[0], /политик/i)

  assert.deepEqual(
    gradePolicyMatchesCounters('<script>umami', policySaysNo),
    [],
    'пока счётчика нет, политика права',
  )
  assert.deepEqual(
    gradePolicyMatchesCounters(withCounter, 'Мы используем Яндекс.Метрику с Вебвизором.'),
    [],
    'счётчик есть и политика о нём говорит — всё сходится',
  )
})
