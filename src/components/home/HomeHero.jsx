import ScrambleText from '../ScrambleText'
import CountUp from '../CountUp'
import { t } from '../../i18n'
import { goTo } from './scroll'

const TELEGRAM = 'https://t.me/BlueFaceBaby99'

// «ИИ-решения» не рвём по дефису: иначе на экране ноутбука заголовок
// переносился как «ИИ-» / «решения». Текст заголовка не меняется.
function MainTitle({ text }) {
  const word = 'ИИ-решения'
  const i = text.indexOf(word)
  if (i < 0) return text
  return <>{text.slice(0, i)}<span className="nb">{word}</span>{text.slice(i + word.length)}</>
}

// Шапка без терминальной строки и без подзаголовка: заголовок, две кнопки и
// три цифры про NODA. Главная кнопка ведёт прямо в Telegram: человеку с
// телефона не нужно сначала листать к призыву внизу.
export default function HomeHero() {
  return (
    <section className="v1-hero" id="top">
      <div className="v1-hero-in">
        <h1 className="v1-hero-title">
          <span><MainTitle text={t.hero.titleMain} /></span><br />
          <span className="v1-hero-title-dim">{t.hero.titleDimPrefix}<ScrambleText text={t.hero.titleScramble} />.</span>
        </h1>
        <div className="v1-hero-actions home-hero-actions">
          <a className="m-btn primary" href={TELEGRAM} data-umami-event="home-hero-telegram" target="_blank" rel="noopener noreferrer">{t.hero.ctaPrimary}</a>
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
