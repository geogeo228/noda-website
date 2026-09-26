import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { t } from '../i18n'

// Раньше неизвестный слаг редиректил на /blog, а сервер на любой путь отдавал
// код 200 — для бота несуществующая страница выглядела валидной. Это soft 404,
// из-за которого в индекс попадает мусор. Теперь noindex на клиенте
// и код 404 от nginx.
export default function NotFound() {
  return (
    <div className="blog-root">
      <Helmet>
        <title>404 — NODA</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className="article-main">
        <h1 className="article-title">{t.notFound.title}</h1>
        <p className="article-desc">{t.notFound.text}</p>
        <div className="article-nav">
          <Link to="/">{t.notFound.home}</Link>
          <Link to="/blog">{t.notFound.blog}</Link>
        </div>
      </main>
    </div>
  )
}
