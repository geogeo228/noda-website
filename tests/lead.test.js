import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeLead, validateLead, contactKind, LIMITS } from '../src/lib/lead.js'

test('пробелы по краям и внутри схлопываются', () => {
  const lead = normalizeLead({ name: '  Иван   Петров ', contact: ' @ivan ', task: ' отчёты\nвручную ', consent: true })
  assert.deepEqual(lead, { name: 'Иван Петров', contact: '@ivan', task: 'отчёты вручную', consent: true })
})

test('нестроковые и пропущенные поля становятся пустой строкой', () => {
  assert.deepEqual(normalizeLead({ name: 5, contact: null }), { name: '', contact: '', task: '', consent: false })
  assert.deepEqual(normalizeLead(undefined), { name: '', contact: '', task: '', consent: false })
})

// 152-ФЗ: согласие — только явное true. Строка "true" или "on" из чужого
// клиента не считается: галочку ставит человек в нашей форме.
test('согласие засчитывается только как true', () => {
  for (const v of [undefined, false, 'true', 'on', 1]) {
    assert.equal(normalizeLead({ consent: v }).consent, false, String(v))
  }
  assert.equal(normalizeLead({ consent: true }).consent, true)
})

test('телефон в любом привычном виде', () => {
  for (const s of ['+7 900 123-45-67', '8 (900) 123 45 67', '+995 555 12 34 56', '9001234']) {
    assert.equal(contactKind(s), 'phone', s)
  }
})

test('Telegram: @ник, ник без @, ссылка t.me', () => {
  for (const s of ['@ivan_petrov', 'ivan_petrov', 't.me/ivan_petrov', 'https://t.me/ivan_petrov']) {
    assert.equal(contactKind(s), 'telegram', s)
  }
})

test('мусор не считается контактом', () => {
  for (const s of ['', '123', 'иван', '@ab', 'hello world', '+7 900']) {
    assert.equal(contactKind(s), null, s)
  }
})

test('валидная заявка без задачи проходит', () => {
  assert.deepEqual(validateLead({ name: 'Иван', contact: '@ivan_p', task: '', consent: true }), {})
})

test('имя и контакт обязательны', () => {
  assert.deepEqual(validateLead({ name: '', contact: '', task: '', consent: true }), { name: 'required', contact: 'required' })
})

test('без согласия на обработку данных заявка не принимается', () => {
  assert.deepEqual(validateLead({ name: 'Иван', contact: '@ivan_p', task: '', consent: false }), { consent: 'required' })
})

test('контакт в неверном формате', () => {
  assert.deepEqual(validateLead({ name: 'Иван', contact: 'позвоните', task: '', consent: true }), { contact: 'format' })
})

test('слишком длинные поля отбиваются', () => {
  const errors = validateLead({
    name: 'а'.repeat(LIMITS.name + 1),
    contact: '@ivan_p',
    task: 'б'.repeat(LIMITS.task + 1),
    consent: true,
  })
  assert.deepEqual(errors, { name: 'long', task: 'long' })
})
