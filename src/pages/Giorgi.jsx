import { Link } from 'react-router-dom'
import { t } from '../i18n'
import Seo from '../components/Seo'
import { track } from '../analytics/track'
import { EVENTS } from '../analytics/events'

export default function Giorgi() {
  return (
    <div className="giorgi-root">
      <Seo
        path="/giorgi"
        title={t.meta.giorgiTitle}
        description={t.meta.giorgiDesc}
        ogDescription={t.meta.giorgiOgDesc}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: t.giorgi.name,
          jobTitle: t.giorgi.jobTitle,
          sameAs: ['https://t.me/giorgikuchava'],
        }}
      />
      <div className="giorgi-card">
        <div className="giorgi-avatar">
          <img src="/assets/avatar.jpg" alt={t.giorgi.name} loading="lazy" />
        </div>
        <h1 className="giorgi-name">{t.giorgi.name}</h1>
        <p className="giorgi-role">{t.giorgi.role}</p>
        <p className="giorgi-bio">{t.giorgi.bio}</p>
        <div className="giorgi-links">
          <a
            className="m-btn giorgi-btn"
            href="https://t.me/giorgikuchava"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(EVENTS.giorgiTelegram)}
          >
            {t.giorgi.linkTelegram}
          </a>
          <a
            className="m-btn giorgi-btn"
            href="https://t.me/giorgikuchava"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(EVENTS.giorgiWrite)}
          >
            {t.giorgi.linkWrite}
          </a>
          <a
            className="m-btn giorgi-btn"
            href="https://t.me/giorgikuchava"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(EVENTS.giorgiConsult)}
          >
            {t.giorgi.linkConsult}
          </a>
        </div>
        <Link to="/" className="giorgi-back" onClick={() => track(EVENTS.giorgiSite)}>
          {t.giorgi.back}
        </Link>
      </div>
    </div>
  )
}
