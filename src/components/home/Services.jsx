import { t } from '../../i18n'
import { goTo } from './scroll'

// Две услуги. Цена только у аудита: разработка оценивается после него.
export default function Services() {
  const { title, dev, consulting } = t.home.services
  return (
    <section className="v1-section" id="services">
      <div className="v1-sec-head">
        <h2 className="v1-sec-title">{title}</h2>
      </div>
      <div className="home-services">
        <article className="tframe corners home-svc">
          <span className="cnr-tl"></span><span className="cnr-br"></span>
          <h3 className="home-svc-t">{dev.title}</h3>
          <p className="home-svc-lead">{dev.lead}</p>
          <p className="home-svc-d">{dev.desc}</p>
          <div className="home-svc-foot">
            <span className="home-price">{dev.price}</span>
            <a className="m-btn" href="#cta" onClick={(e) => goTo(e, '#cta')}>{dev.button}</a>
          </div>
        </article>
        <article className="tframe corners home-svc">
          <span className="cnr-tl"></span><span className="cnr-br"></span>
          <h3 className="home-svc-t">{consulting.title}</h3>
          {consulting.parts.map((p) => (
            <div className="home-svc-part" key={p.title}>
              <b>{p.title}</b>
              <p>{p.desc}</p>
            </div>
          ))}
          <div className="home-svc-foot">
            <span className="home-price">{consulting.price}</span>
            <a className="m-btn" href="#cta" onClick={(e) => goTo(e, '#cta')}>{consulting.button}</a>
          </div>
        </article>
      </div>
    </section>
  )
}
