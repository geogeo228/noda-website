import { t } from '../../i18n'

export default function HomeCTA() {
  const c = t.home.cta
  return (
    <section className="v1-section v1-cta-sec" id="cta">
      <div className="v1-cta tframe corners">
        <span className="cnr-tl"></span><span className="cnr-br"></span>
        <div className="v1-cta-body">
          <h2 className="v1-cta-title">{c.titleLine1} <br /><span className="v1-cta-title-alt">{c.titleLine2}</span></h2>
          <p className="v1-cta-sub">{c.sub}</p>
          <div className="v1-cta-actions">
            <a className="m-btn" href="https://t.me/BlueFaceBaby99" target="_blank" rel="noopener noreferrer">{c.button}</a>
            <span className="v1-cta-handle">@BlueFaceBaby99</span>
          </div>
        </div>
      </div>
    </section>
  )
}
