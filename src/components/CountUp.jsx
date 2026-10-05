import { useState, useEffect, useRef } from 'react'
import useIntersectionObserver from '../hooks/useIntersectionObserver'
import { t } from '../i18n'

// Цифра в шапке досчитывает от нуля, когда попадает в экран. prefix нужен для
// значений вроде «от 3 дней»: считается только число, слова стоят на месте.
export default function CountUp({ to, prefix = '', suffix = '' }) {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 })
  const [value, setValue] = useState(0)
  const animated = useRef(false)

  useEffect(() => {
    if (!isVisible || animated.current) return
    animated.current = true
    const duration = 1200
    const start = performance.now()

    function tick(now) {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.floor(to * eased))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isVisible, to])

  return (
    <span ref={ref} className="v1-stat-num">
      {prefix}{value.toLocaleString(t.locale)}{suffix}
    </span>
  )
}
