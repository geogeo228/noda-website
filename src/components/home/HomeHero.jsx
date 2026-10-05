import ScrambleText from '../ScrambleText'
import CountUp from '../CountUp'
import { t } from '../../i18n'
import { goTo } from './scroll'

// Шапка без терминальной строки и без подзаголовка: заголовок, две кнопки и
// три цифры про NODA.
export default function HomeHero() {
  return (
    <section className="v1-hero" id="top">
      <div>
        <h1 className="v1-hero-title">
          <span>{t.hero.titleMain}</span><br />
          <span className="v1-hero-title-dim">{t.hero.titleDimPrefix}<ScrambleText text={t.hero.titleScramble} />.</span>
        </h1>
        <div className="v1-hero-actions home-hero-actions">
          <a className="m-btn" href="#cta" onClick={(e) => goTo(e, '#cta')}>{t.hero.ctaPrimary}</a>
          <a className="m-btn ghost" href="#results" onClick={(e) => goTo(e, '#results')}>{t.home.hero.ctaSecondary}</a>
        </div>
        <div className="v1-hero-stats">
          {t.home.hero.stats.map((s) => (
            <div className="v1-stat" key={s.label}>
              <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
              <span className="v1-stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
