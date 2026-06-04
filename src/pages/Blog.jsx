import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import articles from '../data/articles'

export default function Blog() {
  return (
    <div className="blog-root">
      <Helmet>
        <title>Кейсы — NODA</title>
        <meta name="description" content="Кейсы и статьи о проектах NODA: ИИ-решения, Telegram-боты, веб-приложения, автоматизация бизнеса." />
        <link rel="canonical" href="https://noda-auto.com/blog" />
        <meta property="og:title" content="Кейсы — NODA" />
        <meta property="og:description" content="Кейсы и статьи о проектах NODA: ИИ-решения, Telegram-боты, веб-приложения." />
        <meta property="og:url" content="https://noda-auto.com/blog" />
      </Helmet>

      <header className="blog-header">
        <Link to="/" className="blog-logo">
          <span className="v1-logo-bracket">[</span>
          <span className="v1-logo-text">NODA</span>
          <span className="v1-logo-bracket">]</span>
        </Link>
      </header>

      <main className="blog-main">
        <div className="blog-head">
          <span className="v1-sec-tag">// cases</span>
          <h1 className="blog-title">Кейсы</h1>
          <p className="blog-subtitle">Реальные проекты. Без воды — только задача, решение и результат.</p>
        </div>

        <div className="blog-grid">
          {articles.map((a) => (
            <Link key={a.slug} to={`/blog/${a.slug}`} className="blog-card tframe corners">
              <span className="cnr-tl"></span><span className="cnr-br"></span>
              <div className="blog-card-tags">
                {a.tags.map((t) => (
                  <span key={t} className="blog-tag">{t}</span>
                ))}
              </div>
              <h2 className="blog-card-title">{a.title}</h2>
              <p className="blog-card-desc">{a.desc}</p>
              <span className="blog-card-link">&rarr; Читать кейс</span>
            </Link>
          ))}
        </div>
      </main>

      <footer className="blog-footer">
        <Link to="/">&larr; На главную</Link>
      </footer>
    </div>
  )
}
