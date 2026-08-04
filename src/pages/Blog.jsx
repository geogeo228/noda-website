import { Link } from 'react-router-dom'
import { articles } from '../data'
import { t } from '../i18n'
import Seo from '../components/Seo'

export default function Blog() {
  return (
    <div className="blog-root">
      <Seo
        path="/blog"
        title={t.meta.blogTitle}
        description={t.meta.blogDesc}
        ogDescription={t.meta.blogOgDesc}
      />

      <header className="blog-header">
        <Link to="/" className="blog-logo">
          <span className="v1-logo-bracket">[</span>
          <span className="v1-logo-text">NODA</span>
          <span className="v1-logo-bracket">]</span>
        </Link>
      </header>

      <main className="blog-main">
        <div className="blog-head">
          <span className="v1-sec-tag">{t.blog.tag}</span>
          <h1 className="blog-title">{t.blog.title}</h1>
          <p className="blog-subtitle">{t.blog.subtitle}</p>
        </div>

        <div className="blog-grid">
          {articles.map((a) => (
            <Link key={a.slug} to={`/blog/${a.slug}`} className="blog-card tframe corners">
              <span className="cnr-tl"></span><span className="cnr-br"></span>
              <div className="blog-card-tags">
                {a.tags.map((tag) => (
                  <span key={tag} className="blog-tag">{tag}</span>
                ))}
              </div>
              <h2 className="blog-card-title">{a.title}</h2>
              <p className="blog-card-desc">{a.desc}</p>
              <span className="blog-card-link">{t.blog.readCase}</span>
            </Link>
          ))}
        </div>
      </main>

      <footer className="blog-footer">
        <Link to="/">{t.blog.backHome}</Link>
      </footer>
    </div>
  )
}
