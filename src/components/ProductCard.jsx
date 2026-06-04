import ScrambleText from './ScrambleText'
import LazyVideo from './LazyVideo'

export default function ProductCard({ product }) {
  const { tag, badge, badgeFree, title, desc, video, poster, steps, audience, price, cta, flagship } = product

  function handleNav(e) {
    e.preventDefault()
    document.querySelector('#cta')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <article className={`v1-product tframe corners${flagship ? ' flag' : ''}`}>
      <span className="cnr-tl"></span><span className="cnr-br"></span>
      <div className="v1-product-body">
        <div className="v1-product-top">
          <span className="v1-product-tag">[ {tag} ]</span>
          {badge && <span className="v1-product-badge">{badge}</span>}
          {badgeFree && <span className="v1-product-badge v1-product-badge--free">{badgeFree}</span>}
        </div>
        <ScrambleText text={title} as="h3" className="v1-product-title" />
        <p className="v1-product-desc">{desc}</p>
        {video && (
          <div className="v1-product-video corners">
            <span className="cnr-tl"></span><span className="cnr-br"></span>
            <LazyVideo src={video} poster={poster} />
          </div>
        )}
        <ul className="v1-product-list">
          {steps.map((s, i) => (
            <li key={i}><span className="v1-product-li-k">[{String(i + 1).padStart(2, '0')}]</span>{s}</li>
          ))}
        </ul>
        <div className="v1-product-audience">{audience}</div>
        <div className="v1-product-foot">
          <span className="v1-product-price">{price}</span>
          <a className="m-btn" href="#cta" onClick={handleNav}>{cta}</a>
        </div>
      </div>
    </article>
  )
}
