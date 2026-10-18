import { Link } from 'react-router-dom'
import { lang } from '../i18n'
import { OPERATOR } from '../data/operator'

// Строка реквизитов в подвале каждой страницы. Только у русской версии:
// оператор и страница «О компании» есть только на noda-auto.com.
export default function LegalLine() {
  if (lang !== 'ru') return null
  return (
    <div className="legal-line">
      {OPERATOR.shortName} · ИНН {OPERATOR.inn} · ОГРН {OPERATOR.ogrn} ·{' '}
      <Link to="/company">О компании</Link> · <Link to="/giorgi">Основатель</Link> · <Link to="/privacy">Политика конфиденциальности</Link>
    </div>
  )
}
