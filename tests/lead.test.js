import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeLead, validateLead, contactKind, LIMITS } from '../src/lib/lead.js'

test('пробелы по краям и внутри схлопываются', () => {
  const lead = normalizeLead({ name: '  Иван   Петров ', contact: ' @ivan ', task: ' отчёты\nвручную ' })
  assert.deepEqual(lead, { name: 'Иван Петров', contact: '@ivan', task: 'отчёты вручную' })
})

test('нестроковые и пропущенные поля становятся пустой строкой', () => {
  assert.deepEqual(normalizeLead({ name: 5, contact: null }), { name: '', contact: '', task: '' })
  assert.deepEqual(normalizeLead(undefined), { name: '', contact: '', task: '' })
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
  assert.deepEqual(validateLead({ name: 'Иван', contact: '@ivan_p', task: '' }), {})
})

test('имя и контакт обязательны', () => {
  assert.deepEqual(validateLead({ name: '', contact: '', task: '' }), { name: 'required', contact: 'required' })
})

test('контакт в неверном формате', () => {
  assert.deepEqual(validateLead({ name: 'Иван', contact: 'позвоните', task: '' }), { contact: 'format' })
})

test('слишком длинные поля отбиваются', () => {
  const errors = validateLead({
    name: 'а'.repeat(LIMITS.name + 1),
    contact: '@ivan_p',
    task: 'б'.repeat(LIMITS.task + 1),
  })
  assert.deepEqual(errors, { name: 'long', task: 'long' })
})
