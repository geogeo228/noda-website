import ScrambleText from './ScrambleText'

const items = [
  { ch: '\u03BB', title: 'Быстро', desc: 'Готовое решение без долгих ожиданий' },
  { ch: '\u2713', title: 'Работает', desc: 'Тестируем все возможные сценарии' },
  { ch: '~', title: 'Понятно', desc: 'Без технического жаргона' },
  { ch: '\u221E', title: 'Сопровождение', desc: 'Остаёмся на связи после запуска' },
]

export default function Why() {
  return (
    <section className="v1-section">
      <div className="v1-sec-head">
        <span className="v1-sec-tag">// 06 &middot; why</span>
        <h2 className="v1-sec-title">Почему мы?</h2>
      </div>
      <div className="v1-why">
        {items.map((w) => (
          <div key={w.title} className="v1-why-card">
            <span className="v1-why-ch">[ {w.ch} ]</span>
            <ScrambleText text={w.title} as="h3" className="v1-why-t" />
            <p className="v1-why-d">{w.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
