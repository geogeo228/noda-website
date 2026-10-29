// Ролики плиток «Что умеет ИИ»: mp4 1080×1080, бесшовный цикл.
// Ролик играет, пока слайд активен, иначе ставится на паузу.

import { useEffect, useRef } from 'react'

// Ролик плитки: mp4 играет, пока слайд активен, иначе ставится на паузу.
function Clip({ src, poster, active }) {
  const ref = useRef(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    // Кто отключил анимацию в системе, ролик не смотрит — только постер.
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (active && !reduced) {
      // play() отклоняется, если вкладка не в фокусе — это не ошибка.
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [active])

  return (
    <div className="dk-scene dk-clip" aria-hidden="true">
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" />
    </div>
  )
}

export function Scene({ kind, active, label }) {
  // Все шесть плиток играют ролики: mp4 1080×1080, бесшовный цикл.
  // Номер ролика совпадает с порядком плиток в колоде.
  const TILES = {
    sees: '01-sees',
    hears: '02-hears',
    reads: '03-reads',
    collects: '04-collects',
    draws: '05-draws',
    answers: '06-answers',
  }
  const clip = TILES[kind]
  if (!clip) return null
  return (
    <Clip
      src={`/assets/deck/tile-${clip}.mp4`}
      poster={`/assets/deck/tile-${clip}.webp`}
      active={active}
    />
  )
}
