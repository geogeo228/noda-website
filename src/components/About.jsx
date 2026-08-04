import { t } from '../i18n'

export default function About() {
  return (
    <section className="v1-section" id="about">
      <div className="v1-sec-head">
        <span className="v1-sec-tag">{t.about.tag}</span>
        <h2 className="v1-sec-title">{t.about.title}</h2>
      </div>
      <div className="v1-about tframe corners">
        <span className="cnr-tl"></span><span className="cnr-br"></span>
        <div className="v1-about-body">
          <div className="v1-about-avatar">
            <img src="/assets/avatar.jpg" alt={t.about.name} loading="lazy" />
          </div>
          <div className="v1-about-text">
            <div className="v1-about-line"><span className="v1-k">{t.about.keyName}</span>: <span className="v1-v">"{t.about.name}"</span>,</div>
            <div className="v1-about-line"><span className="v1-k">{t.about.keyRole}</span>: <span className="v1-v">"{t.about.role}"</span>,</div>
            <div className="v1-about-line"><span className="v1-k">{t.about.keyBio}</span>: <span className="v1-v">"{t.about.bio}"</span>,</div>
            <div className="v1-about-line"><span className="v1-k">{t.about.keyContact}</span>: [</div>
            <div className="v1-about-contacts">
              <a className="m-btn" href="https://t.me/BlueFaceBaby99" target="_blank" rel="noopener noreferrer">telegram &rarr; @BlueFaceBaby99</a>
              <a className="m-btn ghost" href="https://max.ru/u/f9LHodD0cOKErTtCwHY7cZOc-FEHHvmgPYuAz8TkKYXkG1W2CFudhSPnnh8" target="_blank" rel="noopener noreferrer">max &rarr;</a>
            </div>
            <div className="v1-about-line">]</div>
          </div>
        </div>
      </div>
    </section>
  )
}
