import ScrambleText from './ScrambleText'
import { t } from '../i18n'

export default function Why() {
  return (
    <section className="v1-section">
      <div className="v1-sec-head">
        <span className="v1-sec-tag">{t.why.tag}</span>
        <h2 className="v1-sec-title">{t.why.title}</h2>
      </div>
      <div className="v1-why">
        {t.why.items.map((w) => (
          <div key={w.title} className="v1-why-card">
            <span className="v1-why-ch">[ {w.ch} ]</span>
            <ScrambleText text={w.title} as="h3" className="v1-why-t" />
            <p className="v1-why-d">{w.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
