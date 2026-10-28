import { useEffect, useRef } from 'react'
import { useDeck } from './ctx'

// Рамка с уголками, как на сайте (классы .tframe и .corners из styles.css).
export function Frame({ className = '', children, ...rest }) {
  return (
    <div className={`tframe corners ${className}`} {...rest}>
      <span className="cnr-tl" />
      <span className="cnr-br" />
      {children}
    </div>
  )
}

export function Tag({ children }) {
  return <div className="dk-tag">{children}</div>
}

export function AlsoDone({ items }) {
  const { ui } = useDeck()
  if (!items?.length) return null
  return (
    <div className="dk-also dk-reveal" style={{ '--i': 5 }}>
      <div className="dk-also-label">{ui.alsoDone}</div>
      <ul className="dk-also-list">
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </div>
  )
}

export function Figure({ children }) {
  return (
    <Frame className="dk-figure dk-reveal" style={{ '--i': 4 }}>
      {children}
    </Frame>
  )
}

// Телефон, нарисованный на CSS. Внутрь кладётся скрин или произвольная разметка.
export function Phone({ src, alt = '', children, className = '', ...rest }) {
  return (
    <div className={`dk-phone ${className}`} {...rest}>
      <div className="dk-phone-notch" />
      <div className="dk-phone-screen">
        {src ? <img src={src} alt={alt} loading="eager" decoding="async" /> : children}
      </div>
    </div>
  )
}

// Окно браузера или ноутбука: строка с точками и адресом.
export function Browser({ src, alt = '', url, className = '', ...rest }) {
  return (
    <div className={`dk-browser ${className}`} {...rest}>
      <div className="dk-browser-bar">
        <i /><i /><i />
        {url && <span className="dk-browser-url">{url}</span>}
      </div>
      <img src={src} alt={alt} loading="eager" decoding="async" />
    </div>
  )
}

// Видео живой плитки: играет, только пока слайд на экране, и стоит на постере.
export function TileVideo({ src, poster, active, label }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (active) {
      const p = v.play()
      if (p && p.catch) p.catch(() => {})
    } else {
      v.pause()
    }
  }, [active])
  return (
    <video
      ref={ref}
      className="dk-video"
      src={encodeURI(src)}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    />
  )
}
