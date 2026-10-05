import { cases } from '../../data'
import { t } from '../../i18n'
import CaseCard from '../CaseCard'
import { track } from '../../analytics/track'
import { EVENTS } from '../../analytics/events'

// Шесть самых сильных результатов — первые шесть в cases.js, порядок там уже
// по силе метрики. Остальные кейсы живут в блоге.
export default function Results() {
  return (
    <section className="v1-section" id="results">
      <div className="v1-sec-head">
        <h2 className="v1-sec-title">{t.home.results.title}</h2>
      </div>
      <div className="home-results">
        {cases.slice(0, 6).map((c) => (
          <CaseCard key={c.id} c={c} compact
            onArticleClick={() => track(EVENTS.homeCaseArticle, { case: c.id })} />
        ))}
      </div>
    </section>
  )
}
