import { products } from '../data'
import { t } from '../i18n'
import ProductCard from './ProductCard'

export default function Products() {
  return (
    <section className="v1-section" id="products">
      <div className="v1-sec-head">
        <span className="v1-sec-tag">{t.products.tag}</span>
        <h2 className="v1-sec-title">{t.products.title}</h2>
        <p className="v1-sec-sub">{t.products.sub}</p>
      </div>
      <div className="v1-products">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}
