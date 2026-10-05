import { t } from '../../i18n'
import { track } from '../../analytics/track'
import { EVENTS } from '../../analytics/events'
import LeadForm, { TELEGRAM } from './LeadForm'

// Контактный блок: сначала форма — путь для тех, кто не станет писать
// незнакомому человеку в мессенджер, — под ней Telegram для остальных.
export default function HomeCTA() {
  const c = t.home.cta
  return (
    <section className="v1-section v1-cta-sec" id="cta">
      <div className="v1-cta tframe corners">
        <span className="cnr-tl"></span><span className="cnr-br"></span>
        <div className="v1-cta-body">
          <h2 className="v1-cta-title">{c.titleLine1} <br /><span className="v1-cta-title-alt">{c.titleLine2}</span></h2>
          <p className="v1-cta-sub">{c.sub}</p>
          <LeadForm />
          <div className="v1-cta-actions lead-alt">
            <span className="lead-alt-text">{c.orTelegram}</span>
            <a className="m-btn ghost" href={TELEGRAM} target="_blank" rel="noopener noreferrer"
              onClick={() => track(EVENTS.homeTelegram, { place: 'cta' })}>@BlueFaceBaby99</a>
          </div>
        </div>
      </div>
    </section>
  )
}
