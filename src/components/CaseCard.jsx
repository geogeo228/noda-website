import LazyVideo from './LazyVideo'

export default function CaseCard({ c }) {
  return (
    <article className="v1-case tframe corners">
      <span className="cnr-tl"></span><span className="cnr-br"></span>
      <div className="v1-case-body">
        <div className="v1-case-visual">
          {c.media.type === 'video' ? (
            <LazyVideo src={c.media.src} poster={c.media.poster} />
          ) : (
            <img src={c.media.src} alt={c.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>
        <div className="v1-case-text">
          {c.client && <span className="v1-case-client">&#9656; {c.client}</span>}
          <h3 className="v1-case-title">{c.title}</h3>
          <div className="v1-case-row">
            <span className="v1-case-lbl dim">task:</span>
            <span>{c.task}</span>
          </div>
          <div className="v1-case-row">
            <span className="v1-case-lbl">sol:</span>
            <span>{c.solution}</span>
          </div>
          <div className="v1-case-row">
            <span className="v1-case-lbl on">res:</span>
            <div className="v1-case-res">
              {c.results.map((r) => <div key={r}>&#10003; {r}</div>)}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
