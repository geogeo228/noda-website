import { Link, useParams } from 'react-router-dom'
import { articles } from '../data'
import { t } from '../i18n'
import Seo from '../components/Seo'
import NotFound from '../components/NotFound'

export default function Article() {
  const { slug } = useParams()
  const article = articles.find((a) => a.slug === slug)

  if (!article) return <NotFound />

  const related = (article.related || [])
    .map((s) => articles.find((a) => a.slug === s))
    .filter(Boolean)

  return (
    <div className="blog-root">
      <Seo
        path={`/blog/${article.slug}`}
        title={`${article.title} — NODA`}
        description={article.desc}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.desc,
          author: { '@type': 'Organization', name: 'NODA' },
          publisher: { '@type': 'Organization', name: 'NODA' },
        }}
      />

      <header className="blog-header">
        <Link to="/" className="blog-logo">
          <span className="v1-logo-bracket">[</span>
          <span className="v1-logo-text">NODA</span>
          <span className="v1-logo-bracket">]</span>
        </Link>
      </header>

      <main className="article-main">
        <Link to="/blog" className="article-back">{t.article.backToBlog}</Link>

        <div className="article-tags">
          {article.tags.map((tag) => (
            <span key={tag} className="blog-tag">{tag}</span>
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
          <p>{t.article.ctaText}</p>
          <a className="m-btn" href="https://t.me/BlueFaceBaby99" target="_blank" rel="noopener noreferrer">{t.article.ctaButton}</a>
        </div>

        {related.length > 0 && (
          <div className="article-related">
            <h2 className="article-h2"><span className="article-h2-marker">//</span> {t.article.related}</h2>
            <div className="article-related-grid">
              {related.map((r) => (
                <Link key={r.slug} to={`/blog/${r.slug}`} className="blog-card tframe corners">
                  <span className="cnr-tl"></span><span className="cnr-br"></span>
                  <h3 className="blog-card-title">{r.title}</h3>
                  <span className="blog-card-link">{t.article.read}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="article-nav">
          <Link to="/blog">{t.article.backToBlog}</Link>
          <Link to="/">{t.article.home}</Link>
        </div>
      </main>

      <footer className="blog-footer">
        <Link to="/">{t.blog.backHome}</Link>
      </footer>
    </div>
  )
}
