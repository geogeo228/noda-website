import test from 'node:test'
import assert from 'node:assert/strict'
import worker from '../worker/lead-form/src/index.js'
import { formatLeadMessage } from '../worker/lead-form/src/message.js'

const ORIGIN = 'https://noda-auto.com'

function makeEnv(overrides = {}) {
  const sent = []
  const env = {
    TELEGRAM_BOT_TOKEN: 'test-token',
    TELEGRAM_CHAT_ID: '42',
    ALLOWED_ORIGINS: ORIGIN,
    fetch: async (url, init) => {
      sent.push({ url, body: JSON.parse(init.body) })
      return new Response(JSON.stringify({ ok: true }), { status: 200 })
    },
    ...overrides,
  }
  // Подменяем сеть: воркер ходит в Telegram глобальным fetch
  globalThis.fetch = env.fetch
  delete env.fetch
  return { env, sent }
}

function post(body, { origin = ORIGIN, headers = {} } = {}) {
  return new Request('https://lead.noda-auto.com/', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin, 'cf-connecting-ip': '1.2.3.4', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

const good = { name: 'Иван', contact: '@ivan_p', task: 'отчёты вручную', consent: true, website: '', elapsed: 9000, page: '/' }

test('валидная заявка уходит в Telegram и отвечает ok', async () => {
  const { env, sent } = makeEnv()
  const res = await worker.fetch(post(good), env)
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), { ok: true })
  assert.equal(res.headers.get('access-control-allow-origin'), ORIGIN)
  assert.equal(sent.length, 1)
  assert.equal(sent[0].url, 'https://api.telegram.org/bottest-token/sendMessage')
  assert.equal(sent[0].body.chat_id, '42')
  assert.ok(sent[0].body.text.includes('Иван'))
  assert.ok(sent[0].body.text.includes('@ivan_p'))
  assert.ok(sent[0].body.text.includes('Согласие на обработку данных: да'))
  assert.equal(sent[0].body.parse_mode, undefined, 'ввод не экранируется — значит, никакой разметки')
})

test('preflight с разрешённого origin', async () => {
  const { env } = makeEnv()
  const res = await worker.fetch(new Request('https://lead.noda-auto.com/', {
    method: 'OPTIONS', headers: { origin: ORIGIN, 'access-control-request-method': 'POST' },
  }), env)
  assert.equal(res.status, 204)
  assert.equal(res.headers.get('access-control-allow-origin'), ORIGIN)
  assert.match(res.headers.get('access-control-allow-methods'), /POST/)
})

test('чужой origin получает 403 и ничего не отправляется', async () => {
  const { env, sent } = makeEnv()
  const res = await worker.fetch(post(good, { origin: 'https://evil.example' }), env)
  assert.equal(res.status, 403)
  assert.equal(sent.length, 0)
})

test('GET не принимается', async () => {
  const { env } = makeEnv()
  const res = await worker.fetch(new Request('https://lead.noda-auto.com/', { headers: { origin: ORIGIN } }), env)
  assert.equal(res.status, 405)
})

test('заполненный honeypot — тихий отказ: ok для бота, ничего в Telegram', async () => {
  const { env, sent } = makeEnv()
  const res = await worker.fetch(post({ ...good, website: 'http://spam.example' }), env)
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), { ok: true })
  assert.equal(sent.length, 0)
})

test('слишком быстрая отправка — тихий отказ', async () => {
  const { env, sent } = makeEnv()
  const res = await worker.fetch(post({ ...good, elapsed: 800 }), env)
  assert.equal(res.status, 200)
  assert.equal(sent.length, 0)
})

test('невалидная заявка — 400 с ошибками полей', async () => {
  const { env, sent } = makeEnv()
  const res = await worker.fetch(post({ ...good, contact: 'позвоните' }), env)
  assert.equal(res.status, 400)
  assert.deepEqual(await res.json(), { ok: false, errors: { contact: 'format' } })
  assert.equal(sent.length, 0)
})

test('без согласия на обработку данных — 400, в Telegram ничего', async () => {
  const { env, sent } = makeEnv()
  const { consent, ...noConsent } = good
  const res = await worker.fetch(post(noConsent), env)
  assert.equal(res.status, 400)
  assert.deepEqual(await res.json(), { ok: false, errors: { consent: 'required' } })
  assert.equal(sent.length, 0)
})

test('битый JSON и слишком большое тело — 400', async () => {
  const { env } = makeEnv()
  assert.equal((await worker.fetch(post('{oops'), env)).status, 400)
  assert.equal((await worker.fetch(post({ ...good, task: 'x'.repeat(5000) }), env)).status, 400)
})

test('Telegram ответил ошибкой — 502, чтобы сайт предложил написать напрямую', async () => {
  const { env } = makeEnv({ fetch: async () => new Response('{"ok":false}', { status: 400 }) })
  const res = await worker.fetch(post(good), env)
  assert.equal(res.status, 502)
})

test('секреты не заданы — 500, а не падение', async () => {
  const { env } = makeEnv({ TELEGRAM_BOT_TOKEN: undefined })
  const res = await worker.fetch(post(good), env)
  assert.equal(res.status, 500)
})

test('лимит частоты: отказ лимитера даёт 429', async () => {
  const { env, sent } = makeEnv({ LEAD_LIMITER: { limit: async () => ({ success: false }) } })
  const res = await worker.fetch(post(good), env)
  assert.equal(res.status, 429)
  assert.equal(sent.length, 0)
})

test('текст сообщения: все поля, пустая задача не печатается пустой строкой', () => {
  const text = formatLeadMessage({ name: 'Иван', contact: '+7 900 123-45-67', task: '' }, { page: '/' })
  assert.ok(text.includes('Иван'))
  assert.ok(text.includes('+7 900 123-45-67'))
  assert.ok(!text.includes('undefined'))
  assert.ok(!/Задача:\s*$/m.test(text))

  const tg = formatLeadMessage({ name: 'Иван', contact: 'ivan_p', task: 'склад' }, { page: '/' })
  assert.ok(tg.includes('https://t.me/ivan_p'), 'ник без @ превращается в кликабельную ссылку')
  assert.ok(tg.includes('склад'))
})
