import { Link } from 'react-router-dom'
import { Container } from '../ui/Container'
import { SectionHeading } from '../common/SectionHeading'
import { ProductCard } from '../common/ProductCard'
import { trendingProducts } from '../../data/products'

/*
 * TrendingProducts — surface-light band with white product cards (§7.1:
 * separation by surface only). Left-aligned heading + "View all" link row
 * differentiates it from the centered Featured module above; grid is
 * 2-up mobile / 4-up desktop (§16.2.5), gap 24/16 per §6.1. Cards sit in
 * white wrappers so the 1:1 surface-light plates stay visible on the band.
 */
export function TrendingProducts() {
  return (
    <section className="bg-surface-light">
      <Container className="py-12 sm:py-[72px] md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Trending now"
            title="Most reordered"
            accent="this month."
          />
          <Link
            to="/products?sort=bestsellers"
            className="font-display text-[15px] font-semibold text-primary-700 underline decoration-2 underline-offset-4 transition-colors hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
          >
            View all
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {trendingProducts.map((product) => (
            <div key={product.slug} className="bg-white p-4 sm:p-5">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
