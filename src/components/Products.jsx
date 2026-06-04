import { products } from '../data/products'
import ProductCard from './ProductCard'

export default function Products() {
  return (
    <section className="v1-section" id="products">
      <div className="v1-sec-head">
        <span className="v1-sec-tag">// 03 &middot; products</span>
        <h2 className="v1-sec-title">Что мы делаем?</h2>
        <p className="v1-sec-sub">$ ls ./products/ &mdash; 5 решений на выбор</p>
      </div>
      <div className="v1-products">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}
