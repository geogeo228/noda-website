import { t } from '../../i18n'
import { track } from '../../analytics/track'
import { EVENTS } from '../../analytics/events'

export default function HomeFooter() {
  return (
    <footer className="v1-footer">
      <div>{t.home.footer.copy}</div>
      <a className="v1-foot-link" href="https://t.me/BlueFaceBaby99" target="_blank" rel="noopener noreferrer"
        onClick={() => track(EVENTS.homeTelegram, { place: 'footer' })}>{t.home.footer.telegram}</a>
    </footer>
  )
}
