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
              <p className="v1-case-metric">{c.metric}</p>
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
