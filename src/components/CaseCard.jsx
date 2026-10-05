import { Link } from 'react-router-dom'
import LazyVideo from './LazyVideo'
import CaseScreen from './CaseScreens'
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
// Значок продукта в подписи карточки. У каждого кейса свой, по смыслу продукта:
// одинаковые значки на всех карточках ничего не различают. Рисуем инлайном,
// чтобы не тянуть иконочный пакет ради десятка картинок.
const PRODUCT_ICONS = {
  camera: (
    <>
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v6c0 4-3 7.5-7 9-4-1.5-7-5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  passport: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9 17h6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.5-4.5" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </>
  ),
  board: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16M15 4v16" />
    </>
  ),
  form: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 16l5-5 4 4 3-3 6 6" />
    </>
  ),
  qr: (
    <>
      <rect x="4" y="4" width="6" height="6" />
      <rect x="14" y="4" width="6" height="6" />
      <rect x="4" y="14" width="6" height="6" />
      <path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" />
    </>
  ),
}

function ProductIcon({ kind }) {
  const shape = PRODUCT_ICONS[kind]
  if (!shape) return null
  return (
    <svg className="v1-case-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {shape}
    </svg>
  )
}

// Цифры в метрике выделяются цветом, слова остаются спокойными: взгляд сразу
// цепляется за «1» и «12», а не за всю фразу целиком.
const NUMBER = /([−-]?\d+(?:[\s\u00a0]\d{3})*%?)/
function Metric({ text }) {
  return text.split(NUMBER).map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))
}

function CaseMedia({ media, title }) {
  return (
    <div className="v1-case-visual">
      {media.type === 'screen' ? (
        <CaseScreen name={media.name} title={title} />
      ) : media.type === 'video' ? (
        <LazyVideo src={media.src} poster={media.poster} />
      ) : (
        <img src={media.src} alt={title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
    </div>
  )
}

// compact — карточка для сетки результатов на новой главной: экран сверху,
// текст под ним, и только главное — название, метрика, было/стало, ссылка на
// статью. Клиент, контекст и мелкая строка там не показываются: Георгий их
// вычеркнул как второстепенное.
// onArticleClick — для аналитики: событие задаёт тот, кто знает, на какой он
// странице (карточка общая для главной и английского лендинга).
export default function CaseCard({ c, compact = false, onArticleClick }) {
  return (
    <article className={`v1-case tframe corners${compact ? ' v1-case-compact' : ''}`}>
      <span className="cnr-tl"></span><span className="cnr-br"></span>
      <div className="v1-case-body">
        <CaseMedia media={c.media} title={c.title} />

        <div className="v1-case-text">
          {!compact && c.client && <span className="v1-case-client">&#9656; {c.client}</span>}
          <h3 className="v1-case-title">
            {compact && <ProductIcon kind={c.icon} />}
            <span>{c.title}</span>
          </h3>

          {c.metric ? (
            <>
              <p className="v1-case-metric">
                {!compact && <ProductIcon kind={c.icon} />}
                <span><Metric text={c.metric} /></span>
              </p>
              <dl className="v1-case-ba">
                <dt>{t.cases.labelBefore}</dt>
                <dd className="was">{c.before}</dd>
                <dt>{t.cases.labelAfter}</dt>
                <dd className="now">{c.after}</dd>
              </dl>
              {!compact && c.extra && <p className="v1-case-extra">{c.extra}</p>}
              {!compact && c.task && <p className="v1-case-task">{c.task}</p>}
              {c.article && (
                <Link to={`/blog/${c.article}`} className="v1-case-more" onClick={onArticleClick}>
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
