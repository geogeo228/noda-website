// Приёмник заявок с noda-auto.com: проверяет заявку и пересылает её Георгию
// в Telegram. Ничего не хранит.
//
// Секреты (wrangler secret put): TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
// Переменные (wrangler.toml): ALLOWED_ORIGINS — через запятую.
// Привязка (необязательна): LEAD_LIMITER — Workers Rate Limiting.
import { normalizeLead, validateLead, MIN_FILL_MS } from '../../../src/lib/lead.js'
import { formatLeadMessage } from './message.js'

const MAX_BODY_BYTES = 4096

function allowedOrigin(request, env) {
  const origin = request.headers.get('origin')
  const list = (env.ALLOWED_ORIGINS || 'https://noda-auto.com').split(',').map((s) => s.trim())
  return origin && list.includes(origin) ? origin : null
}

function json(body, status, origin) {
  const headers = { 'content-type': 'application/json; charset=utf-8', vary: 'Origin' }
  if (origin) headers['access-control-allow-origin'] = origin
  return new Response(JSON.stringify(body), { status, headers })
}

async function sendToTelegram(env, text) {
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, disable_web_page_preview: true }),
  })
  return res.ok
}

export default {
  async fetch(request, env) {
    const origin = allowedOrigin(request, env)

    if (request.method === 'OPTIONS') {
      if (!origin) return new Response(null, { status: 403 })
      return new Response(null, {
        status: 204,
        headers: {
          'access-control-allow-origin': origin,
          'access-control-allow-methods': 'POST, OPTIONS',
          'access-control-allow-headers': 'content-type',
          'access-control-max-age': '86400',
          vary: 'Origin',
        },
      })
    }

    if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405, origin)
    if (!origin) return json({ ok: false, error: 'origin' }, 403, null)

    if (env.LEAD_LIMITER) {
      const ip = request.headers.get('cf-connecting-ip') || 'unknown'
      const { success } = await env.LEAD_LIMITER.limit({ key: ip })
      if (!success) return json({ ok: false, error: 'rate' }, 429, origin)
    }

    const raw = await request.text()
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
      return json({ ok: false, error: 'size' }, 400, origin)
    }

    let body
    try {
      body = JSON.parse(raw)
    } catch {
      return json({ ok: false, error: 'json' }, 400, origin)
    }
    if (!body || typeof body !== 'object') return json({ ok: false, error: 'json' }, 400, origin)

    // Ловушки для ботов. Отвечаем «принято», чтобы бот не подбирал обход.
    const honeypot = typeof body.website === 'string' && body.website.trim() !== ''
    const tooFast = !(Number(body.elapsed) >= MIN_FILL_MS)
    if (honeypot || tooFast) return json({ ok: true }, 200, origin)

    const lead = normalizeLead(body)
    const errors = validateLead(lead)
    if (Object.keys(errors).length > 0) return json({ ok: false, errors }, 400, origin)

    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      console.error('lead-form: не заданы секреты TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID')
      return json({ ok: false, error: 'config' }, 500, origin)
    }

    const page = typeof body.page === 'string' ? body.page.slice(0, 200) : ''
    let delivered = false
    try {
      delivered = await sendToTelegram(env, formatLeadMessage(lead, { page }))
    } catch (err) {
      console.error('lead-form: Telegram недоступен', err)
    }
    if (!delivered) return json({ ok: false, error: 'delivery' }, 502, origin)

    return json({ ok: true }, 200, origin)
  },
}
