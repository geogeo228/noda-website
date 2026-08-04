import { Fragment } from 'react'
import { t } from '../i18n'

export default function Process() {
  return (
    <section className="v1-section" id="process">
      <div className="v1-sec-head">
        <span className="v1-sec-tag">{t.process.tag}</span>
        <h2 className="v1-sec-title">{t.process.title}</h2>
      </div>
      <div className="v1-process tframe corners">
        <span className="cnr-tl"></span><span className="cnr-br"></span>
        <div className="v1-proc-grid">
          {t.process.steps.map((s, i) => (
            <Fragment key={s.num}>
              {i > 0 && (
                <div className="v1-proc-arrow" aria-hidden="true"><span>&mdash;&gt;</span></div>
              )}
              <div className="v1-proc-card">
                <div className="v1-proc-card-head">
                  <span className="v1-proc-num">{s.num}</span>
                  <span className="v1-proc-time">{s.time}</span>
                </div>
                <div className="v1-proc-cmd">{s.cmd}</div>
                <div className="v1-proc-t">{s.title}</div>
                <div className="v1-proc-d">{s.desc}</div>
                <ul className="v1-proc-bullets">
                  {s.bullets.map((b) => (
                    <li key={b}><span className="v1-proc-bullet-tick">&rsaquo;</span> {b}</li>
                  ))}
                </ul>
              </div>
            </Fragment>
          ))}
        </div>
        <div className="v1-proc-foot">
          <span className="v1-proc-foot-prompt">noda@matrix:~$</span>
          <span className="v1-proc-foot-cmd">{t.process.footCmd}</span>
          <span className="v1-proc-foot-out">{t.process.footOut}</span>
        </div>
      </div>
    </section>
  )
}
