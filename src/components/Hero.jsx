import { useState, useEffect, useRef } from 'react'
import ScrambleText from './ScrambleText'
import useIntersectionObserver from '../hooks/useIntersectionObserver'
import { t } from '../i18n'

function CountUp({ to, suffix = '' }) {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 })
  const [value, setValue] = useState(0)
  const animated = useRef(false)

  useEffect(() => {
    if (!isVisible || animated.current) return
    animated.current = true
    const duration = 1200
    const start = performance.now()

    function tick(t) {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.floor(to * eased))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isVisible, to])

  return (
    <span ref={ref} className="v1-stat-num">
      {value.toLocaleString(t.locale)}{suffix}
    </span>
  )
}

export default function Hero() {
  const [typed, setTyped] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const text = './initialize --mode=agency'

  useEffect(() => {
    let i = 0
    const delay = setTimeout(() => {
      const id = setInterval(() => {
        i++
        setTyped(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(id)
          setTimeout(() => setShowCursor(false), 2000)
        }
      }, 50)
      return () => clearInterval(id)
    }, 500)
    return () => clearTimeout(delay)
  }, [])

  function handleNav(e, hash) {
    e.preventDefault()
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="v1-hero" id="top">
      <div className="v1-hero-meta">
        <span className="v1-hero-prompt">noda@matrix:~$</span>
        <span>{typed}{showCursor && <span className="cursor-blink"></span>}</span>
      </div>
      <div>
        <h1 className="v1-hero-title">
          <span>{t.hero.titleMain}</span><br />
          <span className="v1-hero-title-dim">{t.hero.titleDimPrefix}<ScrambleText text={t.hero.titleScramble} />.</span>
        </h1>
        <p className="v1-hero-sub">
          <span className="v1-hero-sub-mark">&gt;</span> {t.hero.sub}
        </p>
        <div className="v1-hero-actions">
          <a className="m-btn" href="#cta" onClick={(e) => handleNav(e, '#cta')}>{t.hero.ctaPrimary}</a>
          <a className="m-btn ghost" href="#products" onClick={(e) => handleNav(e, '#products')}>{t.hero.ctaSecondary}</a>
        </div>
        <div className="v1-hero-stats">
          {t.hero.stats.map((s) => (
            <div className="v1-stat" key={s.label}>
              <CountUp to={s.to} suffix={s.suffix} />
              <span className="v1-stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
