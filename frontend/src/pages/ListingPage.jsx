import { useParams, useSearchParams } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/common/SectionHeading'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { products } from '../data/products'
import { categories } from '../data/categories'
import { formatMoney } from '../utils/format'
import { Breadcrumb } from '../components/plp/Breadcrumb'
import { FilterSidebar } from '../components/plp/FilterSidebar'
import { FilterButton } from '../components/plp/FilterButton'
import { Toolbar } from '../components/plp/Toolbar'
import { ProductGrid } from '../components/plp/ProductGrid'

/*
 * ListingPage — Product Listing Page / search results (UI spec §14.3).
 * Reads filter/sort/search state from URL search params, filters and sorts
 * the temporary product data, and renders breadcrumb → count → toolbar →
 * product grid. Desktop shows a sticky filter rail; mobile/tablet opens a
 * filter sheet from the Filter button. No backend — all filtering happens
 * in React state backed by the URL (FR-SRCH-05).
 */
export function ListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { slug: categorySlug } = useParams()

  const categoryFromURL = searchParams.get('category') ?? categorySlug ?? undefined
  const searchQuery = searchParams.get('q') ?? undefined
  const sort = searchParams.get('sort') ?? 'newest'
  const minPriceRaw = searchParams.get('minPrice')
  const maxPriceRaw = searchParams.get('maxPrice')
  const minPrice = minPriceRaw ? Number(minPriceRaw) : undefined
  const maxPrice = maxPriceRaw ? Number(maxPriceRaw) : undefined

  /* Category name lookup (for breadcrumb + heading) */
  const activeCategory = categories.find((c) => c.slug === categoryFromURL)

  /* --- Filter --- */
  const filtered = products.filter((product) => {
    if (categoryFromURL && product.category !== activeCategory?.name) return false
    if (minPrice !== undefined && product.price < minPrice) return false
    if (maxPrice !== undefined && product.price > maxPrice) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (
        !product.name.toLowerCase().includes(q) &&
        !product.category.toLowerCase().includes(q)
      )
        return false
    }
    return true
  })

  /* --- Sort --- */
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    return 0 // newest = catalog order
  })

  const count = sorted.length

  /* --- Active chips --- */
  const chips = []
  if (activeCategory) {
    chips.push({ key: `cat-${activeCategory.slug}`, label: activeCategory.name })
  }
  if (minPrice !== undefined) {
    chips.push({ key: 'min', label: `Min ${formatMoney(minPrice)}` })
  }
  if (maxPrice !== undefined) {
    chips.push({ key: 'max', label: `Max ${formatMoney(maxPrice)}` })
  }
  if (searchQuery) {
    chips.push({ key: 'search', label: `"${searchQuery}"` })
  }
  const hasActiveFilters = chips.length > 0

  /* --- Handlers --- */
  const setCategory = (slug) => {
    const next = new URLSearchParams(searchParams)
    if (slug) next.set('category', slug)
    else next.delete('category')
    next.delete('page')
    setSearchParams(next)
  }

  const setSort = (value) => {
    const next = new URLSearchParams(searchParams)
    next.set('sort', value)
    next.delete('page')
    setSearchParams(next)
  }

  const setPrice = (type, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(type, String(value))
    else next.delete(type)
    next.delete('page')
    setSearchParams(next)
  }

  const removeChip = (key) => {
    const next = new URLSearchParams(searchParams)
    if (key.startsWith('cat-')) {
      next.delete('category')
    } else if (key === 'min') {
      next.delete('minPrice')
    } else if (key === 'max') {
      next.delete('maxPrice')
    } else if (key === 'search') {
      next.delete('q')
    }
    next.delete('page')
    setSearchParams(next)
  }

  const clearAll = () => {
    setSearchParams(new URLSearchParams())
  }

  /* Page title */
  const pageTitle =
    searchQuery
      ? `Search results for "${searchQuery}"`
      : activeCategory
        ? activeCategory.name
        : 'All products'

  return (
    <section className="bg-white">
      <Container className="py-12 sm:py-[72px] md:py-24">
        {/* Breadcrumb */}
        <Breadcrumb
          categoryName={activeCategory?.name}
          searchQuery={searchQuery}
        />

        {/* Heading + count */}
        <div className="mt-6 flex items-center justify-between lg:flex-row lg:items-start">
          <div className="flex-1">
            <SectionHeading
              eyebrow="Catalog"
              title={pageTitle}
              accent={count > 0 ? `— ${count} results` : '— no results'}
            />
          </div>
        </div>

        <div className="mt-8 lg:mt-12 lg:flex lg:gap-12">
          {/* Desktop: sticky filter rail */}
          <FilterSidebar
            activeCategory={categoryFromURL}
            minPrice={minPrice}
            maxPrice={maxPrice}
            setActiveCategory={setCategory}
            setMinPrice={(v) => setPrice('minPrice', v)}
            setMaxPrice={(v) => setPrice('maxPrice', v)}
            clearAll={clearAll}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Main content area */}
          <div className="flex-1">
            {/* Mobile: filter trigger button */}
            <FilterButton
              activeCategory={categoryFromURL}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setActiveCategory={setCategory}
              setMinPrice={(v) => setPrice('minPrice', v)}
              setMaxPrice={(v) => setPrice('maxPrice', v)}
              clearAll={clearAll}
              hasActiveFilters={hasActiveFilters}
              className="lg:hidden mb-6"
            />

            {/* Toolbar */}
            <Toolbar
              chips={chips}
              onRemoveChip={removeChip}
              sort={sort}
              onSortChange={setSort}
            />

            {/* Empty state */}
            {count === 0 && (
              <div className="mt-10 text-center py-12">
                <Badge tone="neutral" size="m">
                  No products found
                </Badge>
                <p className="mt-4 text-body text-body-copy">
                  Try adjusting your filters or search terms.
                </p>
                <Button variant="secondary" size="m" onClick={clearAll} className="mt-6">
                  Clear all filters
                </Button>
              </div>
            )}

            {/* Product grid */}
            {count > 0 && (
              <div className="mt-8">
                <ProductGrid products={sorted} />
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
