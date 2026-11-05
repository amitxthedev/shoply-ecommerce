import { useState } from 'react'
import { X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Checkbox } from '../ui/Checkbox'
import { SectionHeading } from '../common/SectionHeading'
import { categories } from '../../data/categories'
import { Icon } from '../ui/Icon'

/*
 * FilterSheet — mobile/tablet filter overlay (UI spec §16.3).
 * Opens from FilterButton on <1024. Same filters as FilterSidebar
 * (category + price range) with Apply / Clear all. Overlay dismisses
 * on backdrop click or close button (0px, no shadow per project rules).
 */
export function FilterSheet({
  open,
  onClose,
  activeCategory,
  minPrice,
  maxPrice,
  setActiveCategory,
  clearAll,
}) {
  const [minInput, setMinInput] = useState(minPrice ?? '')
  const [maxInput, setMaxInput] = useState(maxPrice ?? '')
  const [searchParams, setSearchParams] = useSearchParams()

  if (!open) return null

  const categoryOptions = categories.map((c) => ({
    value: c.slug,
    label: c.name,
  }))

  const onApply = () => {
    const next = new URLSearchParams(searchParams)
    if (minInput) next.set('minPrice', minInput)
    else next.delete('minPrice')
    if (maxInput) next.set('maxPrice', maxInput)
    else next.delete('maxPrice')
    setSearchParams(next)
    onClose()
  }

  const onClearAll = () => {
    clearAll()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-ink/50 transition-opacity duration-250 opacity-100"
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 left-0 flex w-full max-w-[380px] flex-col bg-white z-10 shadow-modal transition-transform duration-250 translate-y-0 focus:outline-none"
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-line px-4">
          <SectionHeading eyebrow="Filter" title="Refine" accent="results." as="h3" className="mb-0" />
          <button
            type="button"
            aria-label="Close filters"
            onClick={onClose}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-none text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
          >
            <Icon icon={X} size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-6">
          {/* Category group */}
          <div className="mb-8">
            <h4 className="font-display text-micro font-semibold uppercase tracking-[0.08em] text-muted mb-4">
              Category
            </h4>
            <ul className="space-y-3">
              {categoryOptions.map((option) => {
                const isActive = activeCategory === option.value
                return (
                  <li key={option.value}>
                    <Checkbox
                      name={`category-${option.value}`}
                      checked={isActive}
                      onChange={() => setActiveCategory(isActive ? undefined : option.value)}
                      label={option.name}
                      description={`${categories.find((c) => c.slug === option.value)?.count} items`}
                    />
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Price range group */}
          <div className="mb-8">
            <h4 className="font-display text-micro font-semibold uppercase tracking-[0.08em] text-muted mb-4">
              Price
            </h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                label="Min"
                name="price-min"
                type="number"
                placeholder="0"
                value={minInput}
                onChange={(e) => setMinInput(e.target.value)}
                className="h-11"
              />
              <Input
                label="Max"
                name="price-max"
                type="number"
                placeholder="999"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Link
              to="/products"
              onClick={onClearAll}
              className="font-display text-[15px] font-semibold text-primary-700 underline decoration-2 underline-offset-4 transition-colors hover:text-primary-800"
            >
              Clear all
            </Link>
            <Button variant="primary" size="m" onClick={onApply}>
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
