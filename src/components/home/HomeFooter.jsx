import { Link } from 'react-router-dom'
import { t } from '../../i18n'

export default function HomeFooter() {
  return (
    <footer className="v1-footer">
      <div>{t.home.footer.copy}</div>
      <div className="v1-foot-links">
        <Link className="v1-foot-link" to="/privacy">{t.home.footer.privacy}</Link>
        <a className="v1-foot-link" href="https://t.me/BlueFaceBaby99" target="_blank" rel="noopener noreferrer">{t.home.footer.telegram}</a>
      </div>
    </footer>
  )
}
