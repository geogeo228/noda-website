import { t } from '../../i18n'

export default function HomeFooter() {
  return (
    <footer className="v1-footer">
      <div>{t.home.footer.copy}</div>
      <a className="v1-foot-link" href="https://t.me/BlueFaceBaby99" target="_blank" rel="noopener noreferrer">{t.home.footer.telegram}</a>
    </footer>
  )
}
