import { t } from '../../i18n'

const TELEGRAM = 'https://t.me/BlueFaceBaby99'
const MAX = 'https://max.ru/u/f9LHodD0cOKErTtCwHY7cZOc-FEHHvmgPYuAz8TkKYXkG1W2CFudhSPnnh8'

export default function Founder() {
  const f = t.home.founder
  return (
    <section className="v1-section" id="about">
      <div className="v1-sec-head">
        <h2 className="v1-sec-title">{f.title}</h2>
      </div>
      <div className="v1-about tframe corners">
        <span className="cnr-tl"></span><span className="cnr-br"></span>
        <div className="v1-about-body">
          <div className="v1-about-avatar">
            <img src="/assets/avatar.jpg" alt={f.name} loading="lazy" />
          </div>
          <div className="home-founder-text">
            <h3 className="home-founder-name">{f.name}</h3>
            <p className="home-founder-role">{f.role}</p>
            <p className="home-founder-bio">{f.bio}</p>
            <div className="home-founder-links">
              <a className="m-btn" href={TELEGRAM} target="_blank" rel="noopener noreferrer">Telegram</a>
              <a className="m-btn ghost" href={MAX} target="_blank" rel="noopener noreferrer">MAX</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
