import { ProductCard } from '../common/ProductCard'

/*
 * RelatedProducts — PDP related products (UI spec §14.4).
 * "No related-products row" per C8 — but user requested it.
 * 4-up grid (2-up mobile), gap 24/16. Reuses shared ProductCard.
 */
export function RelatedProducts({ products = [] }) {
  if (products.length === 0) return null

  return (
    <section className="bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-[72px] md:py-24">
        <div className="mb-8">
          <h2 className="font-display text-h2 font-bold text-ink mb-2">
            You may also like
          </h2>
          <p className="text-body text-body-copy">
            Other essentials from the same category.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
