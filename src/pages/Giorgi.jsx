import { Link } from 'react-router-dom'
import { useEffect } from 'react'

function track(event) {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(event)
  }
}

export default function Giorgi() {
  useEffect(() => {
    document.title = 'Георгий Кучава — Основатель NODA'
  }, [])

  return (
    <div className="giorgi-root">
      <div className="giorgi-card">
        <div className="giorgi-avatar">
          <img src="/assets/avatar.jpg" alt="Георгий Кучава" />
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
