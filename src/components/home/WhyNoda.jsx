import { t } from '../../i18n'

// Значки по порядку пунктов: скорость, простой язык, связь после запуска.
// Рисуем инлайном, как значки в карточках кейсов, — без иконочного пакета.
const ICONS = [
  <path key="a" d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  <><path key="a" d="M4 5h16v11H9l-5 4z" /><path key="b" d="M8 10h8" /></>,
  <><path key="a" d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1" /><path key="b" d="M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1" /></>,
]

export default function WhyNoda() {
  const w = t.home.why
  return (
    <section className="v1-section">
      <div className="v1-sec-head">
        <h2 className="v1-sec-title">{w.title}</h2>
      </div>
      <div className="v1-why home-why">
        {w.items.map((item, i) => (
          <div key={item.title} className="v1-why-card">
            {ICONS[i] && (
              <svg className="home-why-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ICONS[i]}
              </svg>
            )}
            <h3 className="v1-why-t">{item.title}</h3>
            <p className="v1-why-d">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
