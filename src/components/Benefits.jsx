import ScrambleText from './ScrambleText'
import { t } from '../i18n'

export default function Benefits() {
  return (
    <section className="v1-section">
      <div className="v1-sec-head">
        <span className="v1-sec-tag">{t.benefits.tag}</span>
        <h2 className="v1-sec-title">{t.benefits.title}</h2>
      </div>
      <div className="v1-benefits">
        {t.benefits.items.map((b) => (
          <div key={b.id} className="v1-benefit corners">
            <span className="cnr-tl"></span><span className="cnr-br"></span>
            <div className="v1-benefit-k">{b.id}</div>
            <ScrambleText text={b.title} as="h3" className="v1-benefit-t" />
            <p className="v1-benefit-d">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
