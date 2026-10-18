import { t } from '../../i18n'
import LegalLine from '../LegalLine'

export default function HomeFooter() {
  return (
    <footer className="v1-footer">
      <div>{t.home.footer.copy}</div>
      <div className="v1-foot-links">
        <a className="v1-foot-link" href="https://t.me/BlueFaceBaby99" data-umami-event="home-footer-telegram" target="_blank" rel="noopener noreferrer">{t.home.footer.telegram}</a>
      </div>
      <LegalLine />
    </footer>
  )
}
