import { useRef, useState, useEffect, useCallback } from 'react'
import { cases } from '../data/cases'
import CaseCard from './CaseCard'

export default function Cases() {
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)

  const updateDots = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const cards = track.querySelectorAll('.v1-case')
    const center = track.scrollLeft + track.clientWidth / 2
    let best = 0, bd = Infinity
    cards.forEach((c, i) => {
      const cc = c.offsetLeft + c.offsetWidth / 2
      const d = Math.abs(center - cc)
      if (d < bd) { bd = d; best = i }
    })
    setActive(best)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    track.addEventListener('scroll', updateDots)
    window.addEventListener('resize', updateDots)
    updateDots()
    return () => {
      track.removeEventListener('scroll', updateDots)
      window.removeEventListener('resize', updateDots)
    }
  }, [updateDots])

  function goTo(i) {
    const track = trackRef.current
    const card = track?.querySelectorAll('.v1-case')[i]
    if (card) track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2, behavior: 'smooth' })
  }

  return (
    <section className="v1-section" id="cases">
      <div className="v1-sec-head">
        <span className="v1-sec-tag">// 05 &middot; cases</span>
        <h2 className="v1-sec-title">Кейсы</h2>
        <p className="v1-sec-sub">&rarr; Листайте вправо</p>
      </div>
      <div className="v1-cases-wrap">
        <div className="v1-cases" ref={trackRef}>
          {cases.map((c) => <CaseCard key={c.id} c={c} />)}
        </div>
        <div className="v1-cases-dots">
          {cases.map((c, i) => (
            <button
              key={c.id}
              className={`v1-cases-dot${i === active ? ' on' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Кейс ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
