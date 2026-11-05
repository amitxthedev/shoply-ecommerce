import { useState } from 'react'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { Tabs } from '../ui/Tabs'
import { SectionHeading } from '../common/SectionHeading'
import { ProductCard } from '../common/ProductCard'
import {
  bestSellerProducts,
  featuredProducts,
  newArrivalProducts,
} from '../../data/products'

/*
 * FeaturedProducts — UI spec §14.2 module 5 (white band): centered
 * eyebrow + two-tone H2, centered tab row (New Arrivals active · Featured ·
 * Best Sellers, §14.2/DEC-24), 4-up product grid (2-up mobile, §16.2.5),
 * centered secondary "View all products". Tab content swaps with a 150 ms
 * opacity fade (§18.3 — Animate.css), panels wired via aria-labelledby.
 */

const TABS = [
  { id: 'new', label: 'New Arrivals' },
  { id: 'featured', label: 'Featured' },
  { id: 'bestsellers', label: 'Best Sellers' },
]

const TAB_PRODUCTS = {
  new: newArrivalProducts,
  featured: featuredProducts,
  bestsellers: bestSellerProducts,
}

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('new')

  return (
    <section className="bg-white">
      <Container className="py-12 sm:py-[72px] md:py-24">
        <SectionHeading
          align="center"
          eyebrow="Our products"
          title="Made well,"
          accent="priced fairly."
        />

        <div className="mt-8 flex justify-center">
          <Tabs
            tabs={TABS}
            value={activeTab}
            onChange={setActiveTab}
            ariaLabel="Product collections"
          />
        </div>

        <div
          key={activeTab}
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
          className="animate__animated animate__fadeIn mt-8"
          style={{ '--animate-duration': '150ms' }}
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {TAB_PRODUCTS[activeTab].map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button variant="secondary" size="l" to="/products" className="w-full sm:w-auto">
            View all products
          </Button>
        </div>
      </Container>
    </section>
  )
}
