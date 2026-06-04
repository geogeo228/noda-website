import ScrambleText from './ScrambleText'

const items = [
  { id: '#01', title: 'Быстрый запуск', desc: 'Без месяцев разработки и долгих внедрений' },
  { id: '#02', title: 'Больше времени на важное', desc: 'Рутинные задачи — на автопилоте' },
  { id: '#03', title: 'Клиенты не теряются', desc: 'Автоматический follow-up и напоминания' },
  { id: '#04', title: 'Разгрузка задач', desc: 'Система берёт рутину на себя, пока вы занимаетесь важным' },
]

export default function Benefits() {
  return (
    <section className="v1-section">
      <div className="v1-sec-head">
        <span className="v1-sec-tag">// 02 &middot; benefits</span>
        <h2 className="v1-sec-title">Что вы получите?</h2>
      </div>
      <div className="v1-benefits">
        {items.map((b) => (
          <div key={b.id} className="v1-benefit corners">
            <span className="cnr-tl"></span><span className="cnr-br"></span>
            <div className="v1-benefit-k">{b.id}</div>
            <ScrambleText text={b.title} as="h3" className="v1-benefit-t" />
            <p className="v1-benefit-d">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
