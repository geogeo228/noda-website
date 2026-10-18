import { Link } from 'react-router-dom'
import { articles } from '../../data'
import { t } from '../../i18n'

// Разборы кейсов: главная ведёт на каждую статью блога отдельно.
// Иначе вес с главной до статьи не доходит и она держится только
// на одной ссылке из списка /blog. Следит за этим страж
// gradeHomepageReach в scripts/grade-linking.js.
export default function Analyses() {
  return (
    <section className="v1-section" id="analyses">
      <div className="v1-sec-head">
        <h2 className="v1-sec-title">{t.home.analyses.title}</h2>
      </div>
      <div className="home-analyses">
        {articles.map((a) => (
          <Link key={a.slug} to={`/blog/${a.slug}`}>{a.title}</Link>
        ))}
      </div>
    </section>
  )
}
