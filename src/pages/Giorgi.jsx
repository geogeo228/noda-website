import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

function track(event) {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(event)
  }
}

export default function Giorgi() {
  return (
    <div className="giorgi-root">
      <Helmet>
        <title>Георгий Кучава — Основатель NODA</title>
        <meta name="description" content="Георгий Кучава — основатель NODA. Автоматизация бизнесов с помощью ИИ, Telegram-боты, консультации." />
        <link rel="canonical" href="https://noda-auto.com/giorgi" />
        <meta property="og:title" content="Георгий Кучава — Основатель NODA" />
        <meta property="og:description" content="Автоматизация бизнесов с помощью ИИ, Telegram-боты, консультации." />
        <meta property="og:url" content="https://noda-auto.com/giorgi" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Георгий Кучава",
          "jobTitle": "Основатель NODA",
          "url": "https://noda-auto.com/giorgi",
          "sameAs": ["https://t.me/giorgikuchava"]
        })}</script>
      </Helmet>
      <div className="giorgi-card">
        <div className="giorgi-avatar">
          <img src="/assets/avatar.jpg" alt="Георгий Кучава" loading="lazy" />
        </div>
        <h1 className="giorgi-name">Георгий Кучава</h1>
        <p className="giorgi-role">Основатель NODA</p>
        <p className="giorgi-bio">
          Автоматизирую бизнесы с помощью ИИ. Пишу боты в Telegram, делаю процессы умнее, объясняю сложное простым языком.
        </p>
        <div className="giorgi-links">
          <a
            className="m-btn giorgi-btn"
            href="https://t.me/giorgikuchava"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('giorgi-telegram')}
          >
            Telegram
          </a>
          <a
            className="m-btn giorgi-btn"
            href="https://t.me/giorgikuchava"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('giorgi-write')}
          >
            Написать мне
          </a>
          <a
            className="m-btn giorgi-btn"
            href="https://t.me/giorgikuchava"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('giorgi-consult')}
          >
            Записаться на консультацию
          </a>
        </div>
        <Link to="/" className="giorgi-back" onClick={() => track('giorgi-site')}>
          &larr; Сайт NODA
        </Link>
      </div>
    </div>
  )
}
