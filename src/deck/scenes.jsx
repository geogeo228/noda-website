import { TileVideo } from './parts'

// Живые сцены для плиток «Что умеет ИИ». Это иллюстрации на CSS без текста и
// цифр: показывают, что происходит, не выдавая себя за реальный экран.
// Анимации запускаются, когда слайд становится активным ([data-active=true]).

const range = (n) => Array.from({ length: n }, (_, i) => i)

function Sees() {
  // Три полки с товаром; рамки распознавания появляются по очереди.
  const rows = [[34, 52, 40, 58, 44, 50], [48, 36, 56, 42, 54, 38], [40, 56, 46, 34, 52, 44]]
  return (
    <div className="dk-scene dk-sees" aria-hidden="true">
      {rows.map((row, r) => (
        <div className="dk-shelf" key={r}>
          {row.map((h, c) => (
            <div className="dk-item" key={c} style={{ height: `${h}%` }}>
              <b className="dk-det" style={{ '--d': `${0.5 + (r * 6 + c) * 0.11}s` }} />
            </div>
          ))}
        </div>
      ))}
      <i className="dk-scan" />
    </div>
  )
}

function Hears() {
  return (
    <div className="dk-scene dk-hears" aria-hidden="true">
      <div className="dk-wave">
        {range(44).map((i) => (
          <i key={i} style={{ '--d': `${(i % 11) * 0.09}s`, '--h': `${28 + ((i * 37) % 62)}%` }} />
        ))}
      </div>
      <div className="dk-tasks">
        {[78, 64, 70].map((w, i) => (
          <div className="dk-task" key={i} style={{ '--d': `${1.0 + i * 0.7}s` }}>
            <u />
            <span style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function Reads() {
  return (
    <div className="dk-scene dk-reads" aria-hidden="true">
      <div className="dk-doc">
        <div className="dk-doc-photo" />
        <span style={{ width: '62%' }} />
        <span style={{ width: '82%' }} />
        <span style={{ width: '48%' }} />
        <span style={{ width: '70%' }} />
        <i className="dk-scan" />
      </div>
      <div className="dk-arrow">→</div>
      <div className="dk-table">
        {range(4).map((r) => (
          <div className="dk-trow" key={r}>
            {range(3).map((c) => (
              <s key={c} style={{ '--d': `${0.6 + (r * 3 + c) * 0.16}s` }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function Collects() {
  // Лента сообщений прокручивается; часть сообщений подсвечивается как заявки.
  const lines = range(18).map((i) => ({ w: 46 + ((i * 29) % 46), hit: i % 5 === 2 }))
  return (
    <div className="dk-scene dk-collects" aria-hidden="true">
      <div className="dk-feed">
        {[...lines, ...lines].map((l, i) => (
          <div className={`dk-msg${l.hit ? ' hit' : ''}`} key={i} style={{ '--d': `${(i % 18) * 0.17}s` }}>
            <u />
            <span style={{ width: `${l.w}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function Scene({ kind, active, label }) {
  switch (kind) {
    case 'sees':
      return <Sees />
    case 'hears':
      return <Hears />
    case 'reads':
      return <Reads />
    case 'collects':
      return <Collects />
    case 'draws':
      return (
        <div className="dk-scene dk-scene-video">
          <TileVideo src="/assets/Колдун_Бот_визуал.mp4" poster="/assets/poster_koldun.jpg" active={active} label={label} />
        </div>
      )
    case 'answers':
      return (
        <div className="dk-scene dk-scene-video">
          <TileVideo src="/assets/Podryadchik_bot.mp4" poster="/assets/poster_podryadchik.jpg" active={active} label={label} />
        </div>
      )
    default:
      return null
  }
}
