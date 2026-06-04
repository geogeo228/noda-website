import { Helmet } from 'react-helmet-async'
import { Link, useParams, Navigate } from 'react-router-dom'
import articles from '../data/articles'

export default function Article() {
  const { slug } = useParams()
  const article = articles.find((a) => a.slug === slug)

  if (!article) return <Navigate to="/blog" replace />

  const related = (article.related || [])
    .map((s) => articles.find((a) => a.slug === s))
    .filter(Boolean)

  return (
    <div className="blog-root">
      <Helmet>
        <title>{article.title} — NODA</title>
        <meta name="description" content={article.desc} />
        <link rel="canonical" href={`https://noda-auto.com/blog/${article.slug}`} />
        <meta property="og:title" content={`${article.title} — NODA`} />
        <meta property="og:description" content={article.desc} />
        <meta property="og:url" content={`https://noda-auto.com/blog/${article.slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": article.title,
          "description": article.desc,
          "author": { "@type": "Organization", "name": "NODA" },
          "publisher": { "@type": "Organization", "name": "NODA" },
          "url": `https://noda-auto.com/blog/${article.slug}`
        })}</script>
      </Helmet>

      <header className="blog-header">
        <Link to="/" className="blog-logo">
          <span className="v1-logo-bracket">[</span>
          <span className="v1-logo-text">NODA</span>
          <span className="v1-logo-bracket">]</span>
        </Link>
      </header>

      <main className="article-main">
        <Link to="/blog" className="article-back">&larr; Все кейсы</Link>

        <div className="article-tags">
          {article.tags.map((t) => (
            <span key={t} className="blog-tag">{t}</span>
          ))}
        </div>

        <h1 className="article-title">{article.title}</h1>
        <p className="article-desc">{article.desc}</p>

        <div className="article-body">
          {article.sections.map((s, i) => (
            <section key={i} className="article-section">
              <h2 className="article-h2">
                <span className="article-h2-marker">//</span> {s.heading}
              </h2>
              {s.body.split('\n\n').map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </section>
          ))}
        </div>

        <div className="article-cta tframe corners">
          <span className="cnr-tl"></span><span className="cnr-br"></span>
          <p>Хотите похожее решение для своего бизнеса?</p>
          <a className="m-btn" href="https://t.me/BlueFaceBaby99" target="_blank" rel="noopener noreferrer">Обсудить задачу</a>
        </div>

        {related.length > 0 && (
          <div className="article-related">
            <h2 className="article-h2"><span className="article-h2-marker">//</span> Похожие кейсы</h2>
            <div className="article-related-grid">
              {related.map((r) => (
                <Link key={r.slug} to={`/blog/${r.slug}`} className="blog-card tframe corners">
                  <span className="cnr-tl"></span><span className="cnr-br"></span>
                  <h3 className="blog-card-title">{r.title}</h3>
                  <span className="blog-card-link">&rarr; Читать</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="article-nav">
          <Link to="/blog">&larr; Все кейсы</Link>
          <Link to="/">На главную</Link>
        </div>
      </main>

      <footer className="blog-footer">
        <Link to="/">&larr; На главную</Link>
      </footer>
    </div>
  )
}
