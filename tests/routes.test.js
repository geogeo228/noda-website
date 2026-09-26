import test from 'node:test'
import assert from 'node:assert/strict'
import { getRoutes } from '../src/routes.js'

test('маршруты покрывают статические страницы и все статьи', () => {
  const routes = getRoutes('ru')
  const paths = routes.map((r) => r.path)

  assert.ok(paths.includes('/'), 'нет лендинга')
  assert.ok(paths.includes('/blog'), 'нет блога')
  assert.ok(paths.includes('/giorgi'), 'нет страницы Георгия')
  assert.ok(paths.filter((p) => p.startsWith('/blog/')).length >= 15, 'статей меньше 15')
})

test('у каждого маршрута непустые title и description', () => {
  for (const lang of ['ru', 'en']) {
    for (const route of getRoutes(lang)) {
      assert.ok(route.title && route.title.trim().length > 0, `пустой title у ${lang}${route.path}`)
      assert.ok(
        route.description && route.description.trim().length > 0,
        `пустой description у ${lang}${route.path}`,
      )
    }
  }
})

test('пути уникальны — дубль слага перезаписал бы файл', () => {
  for (const lang of ['ru', 'en']) {
    const paths = getRoutes(lang).map((r) => r.path)
    assert.equal(new Set(paths).size, paths.length, `дубликаты путей в ${lang}`)
  }
})

test('пути безопасны для записи на диск', () => {
  const unsafe = /(\.\.|\/\/|\s)/
  for (const lang of ['ru', 'en']) {
    for (const route of getRoutes(lang)) {
      assert.ok(route.path.startsWith('/'), `путь без ведущего слеша: ${route.path}`)
      assert.ok(!unsafe.test(route.path), `небезопасный путь: ${route.path}`)
    }
  }
})

test('JSON-LD лендинга ссылается на домен своего языка', () => {
  const ruLanding = getRoutes('ru').find((r) => r.path === '/')
  const enLanding = getRoutes('en').find((r) => r.path === '/')

  assert.equal(ruLanding.jsonLd.url, 'https://noda-auto.com')
  assert.equal(enLanding.jsonLd.url, 'https://en.noda-auto.com')
})
