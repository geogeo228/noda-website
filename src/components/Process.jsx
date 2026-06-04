import { Fragment } from 'react'

const steps = [
  { num: '01', time: '\u23F1 1-2 дня', cmd: '$ ./discuss()', title: 'Обсуждаем задачу', desc: 'Вы рассказываете, что болит. Я предлагаю решение.', bullets: ['созвон 30-60 мин', 'поиск узких мест', 'оценка задачи'] },
  { num: '02', time: '\u23F1 2-3 дня', cmd: '$ ./plan()', title: 'Согласуем план', desc: 'Показываю, как будет работать, до начала разработки.', bullets: ['схема процесса', 'стек и инструменты', 'сроки и стоимость'] },
  { num: '03', time: '\u23F1 1-3 недели', cmd: '$ ./build()', title: 'Делаем и тестируем', desc: 'Разработка + проверка на реальных сценариях.', bullets: ['прототип за неделю', 'промежуточные демо', 'правки на ходу'] },
  { num: '04', time: '\u23F1 1 день', cmd: '$ ./deploy()', title: 'Передаём вам', desc: 'Готовое решение + инструкция + поддержка.', bullets: ['запуск в проде', 'видео-инструкция', '30 дней поддержки'] },
]

export default function Process() {
  return (
    <section className="v1-section" id="process">
      <div className="v1-sec-head">
        <span className="v1-sec-tag">// 04 &middot; process</span>
        <h2 className="v1-sec-title">Как мы работаем?</h2>
      </div>
      <div className="v1-process tframe corners">
        <span className="cnr-tl"></span><span className="cnr-br"></span>
        <div className="v1-proc-grid">
          {steps.map((s, i) => (
            <Fragment key={s.num}>
              {i > 0 && (
                <div className="v1-proc-arrow" aria-hidden="true"><span>&mdash;&gt;</span></div>
              )}
              <div className="v1-proc-card">
                <div className="v1-proc-card-head">
                  <span className="v1-proc-num">{s.num}</span>
                  <span className="v1-proc-time">{s.time}</span>
                </div>
                <div className="v1-proc-cmd">{s.cmd}</div>
                <div className="v1-proc-t">{s.title}</div>
                <div className="v1-proc-d">{s.desc}</div>
                <ul className="v1-proc-bullets">
                  {s.bullets.map((b) => (
                    <li key={b}><span className="v1-proc-bullet-tick">&rsaquo;</span> {b}</li>
                  ))}
                </ul>
              </div>
            </Fragment>
          ))}
        </div>
        <div className="v1-proc-foot">
          <span className="v1-proc-foot-prompt">noda@matrix:~$</span>
          <span className="v1-proc-foot-cmd">echo "сроки зависят от сложности"</span>
          <span className="v1-proc-foot-out">&rarr; типичный проект: 2-4 недели</span>
        </div>
      </div>
    </section>
  )
}
