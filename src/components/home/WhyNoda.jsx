import { t } from '../../i18n'

export default function WhyNoda() {
  const w = t.home.why
  return (
    <section className="v1-section">
      <div className="v1-sec-head">
        <h2 className="v1-sec-title">{w.title}</h2>
      </div>
      <div className="v1-why home-why">
        {w.items.map((item) => (
          <div key={item.title} className="v1-why-card">
            <h3 className="v1-why-t">{item.title}</h3>
            <p className="v1-why-d">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
