import { ProductCard } from '../../components/common/ProductCard'

/*
 * ProductGrid — responsive product grid (UI spec §14.3 / §15 / §16.3).
 * Desktop with rail: 3-up (grid `280px | 1fr` gap 32).
 * Desktop without rail / search: 4-up.
 * Tablet & mobile: 2-up.
 * Reuses shared ProductCard.
 */
export function ProductGrid({ products }) {
  return (
    <div className="grid gap-6 lg:gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  )
}
