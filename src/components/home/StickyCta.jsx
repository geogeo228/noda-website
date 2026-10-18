import { useEffect, useState } from 'react'
import { t } from '../../i18n'

const TELEGRAM = 'https://t.me/BlueFaceBaby99'

// Плавающая кнопка «Написать в Telegram» только для телефона (на широком
// экране скрыта стилями). Появляется, когда первый экран с кнопками уже
// проскроллен, и прячется, когда на экране основной призыв или подвал, чтобы
// не дублировать и не закрывать строку реквизитов. Пока скрыта — не получает
// фокус с клавиатуры (visibility в стилях).
export default function StickyCta() {
  const [past, setPast] = useState(false)
  const [near, setNear] = useState(false)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const hero = document.getElementById('top')
    const cta = document.getElementById('cta')
    const foot = document.querySelector('.v1-footer')
    const seen = new Set()
    const toNear = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) seen.add(en.target)
        else seen.delete(en.target)
      }
      setNear(seen.size > 0)
    })
    const toHero = new IntersectionObserver(([en]) => setPast(!en.isIntersecting))
    if (hero) toHero.observe(hero)
    ;[cta, foot].forEach((el) => el && toNear.observe(el))
    return () => { toHero.disconnect(); toNear.disconnect() }
  }, [])

  const on = past && !near
  return (
    <div className={`v1-sticky${on ? ' is-on' : ''}`}>
      <a className="m-btn primary" href={TELEGRAM} data-umami-event="home-sticky-telegram" target="_blank" rel="noopener noreferrer">
        {t.home.cta.button}
      </a>
    </div>
  )
}
