import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

function scrollToHash(hash) {
  const el = document.querySelector(hash)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export default function Header() {
  const [open, setOpen] = useState(false)

  const toggle = useCallback((val) => {
    const next = typeof val === 'boolean' ? val : !open
    setOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }, [open])

  const handleNav = useCallback((e, hash) => {
    e.preventDefault()
    toggle(false)
    scrollToHash(hash)
  }, [toggle])

  return (
    <>
      <header className="v1-header">
        <div className="v1-header-inner">
          <a href="#top" className="v1-logo" onClick={(e) => handleNav(e, '#top')}>
            <span className="v1-logo-bracket">[</span>
            <span className="v1-logo-text">NODA</span>
            <span className="v1-logo-bracket">]</span>
          </a>
          <nav className="v1-nav">
            <a href="#about" onClick={(e) => handleNav(e, '#about')}>Обо мне</a>
            <a href="#products" onClick={(e) => handleNav(e, '#products')}>Продукты</a>
            <a href="#cases" onClick={(e) => handleNav(e, '#cases')}>Кейсы</a>
            <a href="#cta" onClick={(e) => handleNav(e, '#cta')}>Контакт</a>
            <Link to="/blog" className="v1-nav-blog">Блог</Link>
          </nav>
          <a className="m-btn v1-header-cta" href="#cta" onClick={(e) => handleNav(e, '#cta')}>Обсудить задачу</a>
          <button
            className={`v1-burger${open ? ' on' : ''}`}
            onClick={() => toggle()}
            aria-label="Открыть меню"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <div className={`v1-drawer${open ? ' is-open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) toggle(false) }}>
        <div className="v1-drawer-panel">
          <div className="v1-drawer-head">
            <span className="v1-drawer-prompt">noda@matrix:~$</span>
            <button className="v1-drawer-close" onClick={() => toggle(false)} aria-label="Закрыть меню">&times;</button>
          </div>
          <nav className="v1-drawer-nav">
            <a href="#about" onClick={(e) => handleNav(e, '#about')}><span>01</span> Обо мне</a>
            <a href="#products" onClick={(e) => handleNav(e, '#products')}><span>02</span> Продукты</a>
            <a href="#cases" onClick={(e) => handleNav(e, '#cases')}><span>03</span> Кейсы</a>
            <a href="#cta" onClick={(e) => handleNav(e, '#cta')}><span>04</span> Контакт</a>
            <Link to="/blog" onClick={() => toggle(false)}><span>05</span> Блог</Link>
          </nav>
          <a className="m-btn" href="#cta" onClick={(e) => handleNav(e, '#cta')}>Обсудить задачу</a>
          <div className="v1-drawer-foot">
            <span className="cursor-blink"></span>
          </div>
        </div>
      </div>
    </>
  )
}
