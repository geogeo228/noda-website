import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { t } from '../../i18n'

const LINKS = [
  ['#results', 'results'],
  ['#services', 'services'],
  ['#about', 'founder'],
  ['#cta', 'contact'],
]

export default function HomeHeader() {
  const [open, setOpen] = useState(false)
  const nav = t.home.nav

  const toggle = useCallback((val) => {
    const next = typeof val === 'boolean' ? val : !open
    setOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }, [open])

  const handleNav = useCallback((e, hash) => {
    e.preventDefault()
    toggle(false)
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
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
            {LINKS.map(([hash, key]) => (
              <a key={hash} href={hash} onClick={(e) => handleNav(e, hash)}>{nav[key]}</a>
            ))}
            <Link to="/blog" className="v1-nav-blog">{nav.blog}</Link>
          </nav>
          <a className="m-btn v1-header-cta" href="#cta" onClick={(e) => handleNav(e, '#cta')}>{nav.cta}</a>
          <button className={`v1-burger${open ? ' on' : ''}`} onClick={() => toggle()} aria-label={t.nav.openMenu}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <div className={`v1-drawer${open ? ' is-open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) toggle(false) }}>
        <div className="v1-drawer-panel">
          <div className="v1-drawer-head">
            <span className="v1-logo-text">NODA</span>
            <button className="v1-drawer-close" onClick={() => toggle(false)} aria-label={t.nav.closeMenu}>&times;</button>
          </div>
          <nav className="v1-drawer-nav">
            {LINKS.map(([hash, key]) => (
              <a key={hash} href={hash} onClick={(e) => handleNav(e, hash)}>{nav[key]}</a>
            ))}
            <Link to="/blog" onClick={() => toggle(false)}>{nav.blog}</Link>
          </nav>
          <a className="m-btn" href="#cta" onClick={(e) => handleNav(e, '#cta')}>{nav.cta}</a>
        </div>
      </div>
    </>
  )
}
