import test from 'node:test'
import assert from 'node:assert/strict'
import { company } from '../src/data/company.js'
import { OPERATOR } from '../src/data/operator.js'
import { getRoutes } from '../src/routes.js'

// Реквизиты оператора лежат в одном месте и читаются из него всюду: политикой,
// подвалом, страницей «О компании» и разметкой организации. Один раз они уже
// разошлись — адрес в двух файлах был написан по-разному.

test('реквизиты берутся из одного источника, а не копируются', () => {
  assert.equal(company.inn, OPERATOR.inn)
  assert.equal(company.ogrn, OPERATOR.ogrn)
  assert.equal(company.legalAddress, OPERATOR.address)
  assert.equal(company.email, OPERATOR.email)
})

test('ИНН и ОГРН проходят проверку контрольной цифрой', () => {
  // Опечатка в одной цифре даёт формально существующий, но чужой номер.
  // Контрольная цифра её поймает, а глаз — нет.
  const inn = String(company.inn)
  assert.match(inn, /^\d{10}$/, 'у юридического лица ИНН из 10 цифр')

  const weights = [2, 4, 10, 3, 5, 9, 4, 6, 8]
  const sum = weights.reduce((acc, w, i) => acc + w * Number(inn[i]), 0)
  assert.equal((sum % 11) % 10, Number(inn[9]), 'контрольная цифра ИНН не сходится')

  const ogrn = String(company.ogrn)
  assert.match(ogrn, /^\d{13}$/, 'у ООО ОГРН из 13 цифр')
  assert.equal(
    Number(ogrn[12]),
    Number(ogrn.slice(0, 12)) % 11 % 10,
    'контрольная цифра ОГРН не сходится',
  )
})

test('имя директора записано полностью, а не обращением', () => {
  // В разметке организации и в документах должно стоять то же, что в ЕГРЮЛ.
  // «Наталья Николаевна» — обращение, у него нет фамилии.
  const parts = company.director.trim().split(/\s+/)
  assert.ok(parts.length >= 3, `ФИО неполное: ${company.director}`)
})

test('страница «О компании» не появляется в маршрутах без телефона', () => {
  // Яндекс.Вебмастер подтверждает регион только при адресе И телефоне города
  // на сайте. Страница без телефона не даёт того, ради чего её делают,
  // а посетителю показывает компанию, с которой нельзя связаться.
  //
  // Поэтому запрет привязан к появлению маршрута, а не висит красным всегда:
  // пока страницы нет, проверять нечего; как только её заведут с пустым
  // телефоном, тест покраснеет.
  const hasPage = getRoutes('ru').some((r) => r.path === '/company')

  if (hasPage) {
    assert.notEqual(company.phone, '', 'маршрут /company заведён, а телефона нет')
  } else {
    assert.equal(company.phone, '', 'телефон появился — пора заводить /company')
  }
})
