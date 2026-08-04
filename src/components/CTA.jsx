import { t } from '../i18n'

export default function CTA() {
  return (
    <section className="v1-section v1-cta-sec" id="cta">
      <div className="v1-cta tframe corners">
        <span className="cnr-tl"></span><span className="cnr-br"></span>
        <div className="v1-cta-body">
          <span className="v1-sec-tag">{t.cta.tag}</span>
          <h2 className="v1-cta-title">{t.cta.titleLine1} <br /><span className="v1-cta-title-alt">{t.cta.titleLine2}</span></h2>
          <p className="v1-cta-sub">
            {t.cta.sub1}<br />
            {t.cta.sub2}
          </p>
          <div className="v1-cta-actions">
            <a className="m-btn" href="https://t.me/BlueFaceBaby99" target="_blank" rel="noopener noreferrer">{t.cta.button}</a>
            <span className="v1-cta-handle">@BlueFaceBaby99<span className="cursor-blink"></span></span>
          </div>
        </div>
      </div>
    </section>
  )
}
