import { useState, useEffect } from 'react'
import { t } from '../i18n'

export default function Footer() {
  const [time, setTime] = useState('')

  useEffect(() => {
    function update() {
      setTime(new Date().toISOString().replace('T', ' ').slice(0, 19))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <footer className="v1-footer">
      <div>[NODA] &copy; 2025 &mdash; <span className="v1-foot-dim">{t.footer.sessionActive}</span></div>
      <div className="v1-foot-dim">{t.footer.uptime} {time} UTC</div>
      <a className="v1-foot-link" href="https://t.me/BlueFaceBaby99" target="_blank" rel="noopener noreferrer">{t.footer.telegram}</a>
    </footer>
  )
}
