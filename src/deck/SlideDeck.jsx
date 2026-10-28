import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MatrixRain from '../components/MatrixRain'
import { DeckContext } from './ctx'
import { LANGS, getDict, langFromSearch } from './content'
import './deck.css'

const W = 1920
const H = 1080

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n))
}

function indexFromHash(hash, total) {
  const n = parseInt(String(hash).replace('#', ''), 10)
  return Number.isFinite(n) ? clamp(n - 1, 0, total - 1) : 0
}

// Полноэкранный просмотрщик слайдов 16:9. Слайд рисуется на холсте 1920×1080
// и масштабируется под окно; на узком экране холст отключается, слайд занимает
// экран целиком и прокручивается по вертикали. Листание: стрелки, пробел,
// клик, свайп. Номер слайда живёт в адресе (#5), по нему же можно открыть
// нужный слайд ссылкой.
//
// slides: [{ id, node: (c, active) => JSX }]; kind: ключ словаря ('deck' | 'intro').
export default function SlideDeck({ slides, kind }) {
  const total = slides.length
  const [index, setIndex] = useState(0)
  const [lang, setLang] = useState('ru')
  const [mounted, setMounted] = useState(false)
  const [fs, setFs] = useState(false)
  const rootRef = useRef(null)
  const touch = useRef(null)

  const dict = useMemo(() => getDict(lang), [lang])
  const t = dict[kind]
  const ui = dict.ui

  // Начальное состояние из адреса: язык и номер слайда.
  useEffect(() => {
    setLang(langFromSearch(window.location.search))
    setIndex(indexFromHash(window.location.hash, total))
    setMounted(true)
    const onHash = () => setIndex(indexFromHash(window.location.hash, total))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [total])

  const go = useCallback(
    (next) => {
      const i = clamp(next, 0, total - 1)
      setIndex(i)
      try {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${i + 1}`)
      } catch {}
    },
    [total],
  )

  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  const toggleFullscreen = useCallback(() => {
    const el = rootRef.current
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen?.()
    else el.requestFullscreen?.().catch(() => {})
  }, [])

  const changeLang = useCallback((l) => {
    setLang(l)
    try {
      const url = new URL(window.location.href)
      if (l === 'ru') url.searchParams.delete('lang')
      else url.searchParams.set('lang', l)
      window.history.replaceState(null, '', url.pathname + url.search + url.hash)
    } catch {}
  }, [])

  // Масштаб холста под окно.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const fit = () => {
      const k = Math.min(window.innerWidth / W, window.innerHeight / H)
      el.style.setProperty('--k', String(k))
    }
    fit()
    window.addEventListener('resize', fit)
    document.addEventListener('fullscreenchange', fit)
    return () => {
      window.removeEventListener('resize', fit)
      document.removeEventListener('fullscreenchange', fit)
    }
  }, [])

  useEffect(() => {
    const onFs = () => setFs(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
        case 'Enter':
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
        case 'Backspace':
          e.preventDefault()
          prev()
          break
        case 'Home':
          go(0)
          break
        case 'End':
          go(total - 1)
          break
        case 'f':
        case 'F':
          toggleFullscreen()
          break
        default:
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go, total, toggleFullscreen])

  // Свайп: горизонтальный жест сильнее вертикального, иначе это прокрутка слайда.
  const onTouchStart = (e) => {
    const p = e.touches[0]
    touch.current = { x: p.clientX, y: p.clientY }
  }
  const onTouchEnd = (e) => {
    const s = touch.current
    touch.current = null
    if (!s) return
    const p = e.changedTouches[0]
    const dx = p.clientX - s.x
    const dy = p.clientY - s.y
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) next()
      else prev()
    }
  }

  // Клик по слайду листает вперёд (в левой трети назад), но не там, где есть
  // ссылки, кнопки и видео. На сенсорных экранах не листаем кликом: там свайп.
  const onClick = (e) => {
    if (e.target.closest('a, button, video, [data-noclick]')) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const x = e.clientX / window.innerWidth
    if (x < 0.25) prev()
    else next()
  }

  const ctx = useMemo(() => ({ t, ui, lang, index, total }), [t, ui, lang, index, total])

  return (
    <DeckContext.Provider value={ctx}>
      <div
        ref={rootRef}
        className={`dk-root${mounted ? ' is-ready' : ''}${fs ? ' is-fs' : ''}`}
        data-kind={kind}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={onClick}
      >
        <MatrixRain />
        <div className="dk-progress" aria-hidden="true">
          <i style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>

        <div className="dk-canvas">
          {slides.map((s, i) => {
            const active = i === index
            return (
              <section
                key={s.id}
                className="dk-slide"
                data-active={active}
                data-slide={i + 1}
                data-id={s.id}
                aria-hidden={!active}
                aria-label={`${ui.slide} ${i + 1} ${ui.of} ${total}`}
              >
                <div className="dk-slide-in">{s.node(t[s.id], active)}</div>
                <footer className="dk-foot">
                  <span className="dk-brand">
                    <b>[</b> {ui.brand} <b>]</b>
                  </span>
                  <span className="dk-num">
                    {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                </footer>
              </section>
            )
          })}
        </div>

        <div className="dk-controls" data-noclick>
          {LANGS.length > 1 && (
            <div className="dk-lang" role="group" aria-label={ui.langLabel}>
              {LANGS.map((l) => (
                <button key={l} type="button" className={l === lang ? 'on' : ''} onClick={() => changeLang(l)}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          )}
          <button type="button" className="dk-fsbtn" onClick={toggleFullscreen} aria-label={fs ? ui.exitFullscreen : ui.fullscreen} title={ui.fullscreen}>
            {fs ? '⤡' : '⤢'}
          </button>
        </div>

        <button type="button" className="dk-arrow-btn dk-arrow-prev" onClick={prev} disabled={index === 0} aria-label={ui.prev}>
          ‹
        </button>
        <button type="button" className="dk-arrow-btn dk-arrow-next" onClick={next} disabled={index === total - 1} aria-label={ui.next}>
          ›
        </button>

        <div className="dk-dots" data-noclick>
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={i === index ? 'on' : ''}
              onClick={() => go(i)}
              aria-label={`${ui.slide} ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </DeckContext.Provider>
  )
}
