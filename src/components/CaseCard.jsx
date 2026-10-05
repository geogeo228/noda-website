import { Link } from 'react-router-dom'
import LazyVideo from './LazyVideo'
import { t } from '../i18n'

// Карточка кейса умеет две раскладки.
//
// Новая (есть поле metric): крупная цифра, под ней «было / стало» словами, под
// ними строка мелким с других осей. Так читается за секунду и бьёт суммой, а не
// описанием процесса.
//
// Прежняя (metric нет): task / sol / res списком. Нужна, потому что английская
// версия живёт на своих данных и в этот заход не переписывается — cases.en.js
// остаётся в старой структуре, и ломать его нельзя.
// Значок типа метрики. Читается раньше текста и сразу говорит, про что цифра:
// время, деньги, ноль потерь или охват. Рисуем инлайном, чтобы не тянуть
// иконочный пакет ради четырёх картинок.
const METRIC_ICONS = {
  time: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  money: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 17V7h3.5a2.5 2.5 0 0 1 0 5H9M9 14.5h5" />
    </>
  ),
  zero: (
    <>
      <path d="M12 3l7 3v6c0 4-3 7.5-7 9-4-1.5-7-5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  reach: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
}

function MetricIcon({ kind }) {
  const shape = METRIC_ICONS[kind]
  if (!shape) return null
  return (
    <svg className="v1-case-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {shape}
    </svg>
  )
}

function CaseMedia({ media, title }) {
  return (
    <div className="v1-case-visual">
      {media.type === 'video' ? (
        <LazyVideo src={media.src} poster={media.poster} />
      ) : (
        <img src={media.src} alt={title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
    </div>
  )
}

export default function CaseCard({ c }) {
  return (
    <article className="v1-case tframe corners">
      <span className="cnr-tl"></span><span className="cnr-br"></span>
      <div className="v1-case-body">
        <CaseMedia media={c.media} title={c.title} />

        <div className="v1-case-text">
          {c.client && <span className="v1-case-client">&#9656; {c.client}</span>}
          <h3 className="v1-case-title">{c.title}</h3>

          {c.metric ? (
            <>
              <p className="v1-case-metric">
                <MetricIcon kind={c.icon} />
                <span>{c.metric}</span>
              </p>
              <dl className="v1-case-ba">
                <dt>{t.cases.labelBefore}</dt>
                <dd className="was">{c.before}</dd>
                <dt>{t.cases.labelAfter}</dt>
                <dd className="now">{c.after}</dd>
              </dl>
              {c.extra && <p className="v1-case-extra">{c.extra}</p>}
              {c.task && <p className="v1-case-task">{c.task}</p>}
              {c.article && (
                <Link to={`/blog/${c.article}`} className="v1-case-more">
                  {t.cases.readFull}
                </Link>
              )}
            </>
          ) : (
            <>
              <div className="v1-case-row">
                <span className="v1-case-lbl dim">{t.cases.labelTask}</span>
                <span>{c.task}</span>
              </div>
              <div className="v1-case-row">
                <span className="v1-case-lbl">{t.cases.labelSolution}</span>
                <span>{c.solution}</span>
              </div>
              <div className="v1-case-row">
                <span className="v1-case-lbl on">{t.cases.labelResult}</span>
                <div className="v1-case-res">
                  {c.results.map((r) => <div key={r}>&#10003; {r}</div>)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
