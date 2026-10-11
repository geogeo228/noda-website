import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { t } from '../i18n'
import Seo from '../components/Seo'
import LegalLine from '../components/LegalLine'
import { OPERATOR } from '../data/operator'

// Страница «О компании»: кто стоит за брендом NODA. Только русская версия,
// маршрут в routes.js с langPair: false. Все значения — из operator.js.
const O = OPERATOR

const ROWS = [
  ['Полное наименование', O.fullName],
  ['Сокращённое наименование', O.shortName],
  ['ИНН', O.inn],
  ['ОГРН', O.ogrn],
  ['Юридический адрес', O.address],
  ['Генеральный директор', O.director],
]

export default function Company() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="blog-root">
      <Seo
        path="/company"
        title={t.meta.companyTitle}
        description={t.meta.companyDesc}
        langPair={false}
      />

      <header className="blog-header">
        <Link to="/" className="blog-logo">
          <span className="v1-logo-bracket">[</span>
          <span className="v1-logo-text">NODA</span>
          <span className="v1-logo-bracket">]</span>
        </Link>
      </header>

      <main className="article-main privacy company">
        <h1 className="article-title">О компании</h1>
        <p className="article-desc">
          NODA — бренд, под которым {O.shortName} делает проекты по автоматизации бизнеса
          с помощью ИИ: боты, веб-приложения, аудит процессов и сопровождение внедрения.
        </p>

        <section className="article-section">
          <h2 className="article-h2">Реквизиты</h2>
          <dl className="company-dl">
            {ROWS.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="article-section">
          <h2 className="article-h2">Контакты</h2>
          <dl className="company-dl">
            <div>
              <dt>Телефон</dt>
              <dd><a href={O.phoneHref}>{O.phone}</a></dd>
            </div>
            <div>
              <dt>Telegram</dt>
              <dd><a href={O.telegramUrl} target="_blank" rel="noopener noreferrer">{O.telegram}</a></dd>
            </div>
            <div>
              <dt>Почта</dt>
              <dd><a href={`mailto:${O.email}`}>{O.email}</a></dd>
            </div>
          </dl>
          <p>
            Как мы обращаемся с данными посетителей — в{' '}
            <Link to="/privacy">политике конфиденциальности</Link>.
          </p>
        </section>
      </main>

      <footer className="blog-footer">
        <Link to="/">{t.blog.backHome}</Link>
        <LegalLine />
      </footer>
    </div>
  )
}
