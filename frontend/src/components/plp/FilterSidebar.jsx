import { useState } from 'react'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Checkbox } from '../ui/Checkbox'
import { SectionHeading } from '../common/SectionHeading'
import { categories } from '../../data/categories'
import { Icon } from '../ui/Icon'

/*
 * FilterSidebar — desktop sticky filter rail (UI spec §14.3).
 * Groups: Category (checkboxes) + Price range (min/max inputs).
 * Group titles are Label/uppercase/muted; options are checkbox rows
 * with 44px hit areas. Clear all ghost link. Rail is sticky at top 100.
 * Hidden below 1024px — mobile/tablet use FilterSheet instead.
 */
export function FilterSidebar({
  activeCategory,
  minPrice,
  maxPrice,
  setActiveCategory,
  setMinPrice,
  setMaxPrice,
  clearAll,
  hasActiveFilters,
}) {
  const [minInput, setMinInput] = useState(minPrice ?? '')
  const [maxInput, setMaxInput] = useState(maxPrice ?? '')

  const categoryOptions = categories.map((c) => ({
    value: c.slug,
    label: c.name,
  }))

  const onApply = () => {
    setMinPrice(minInput || undefined)
    setMaxPrice(maxInput || undefined)
  }

  return (
    <aside
      className="sticky top-[100px] shrink-0 w-[280px] lg:block hidden border-t border-line pt-5"
    >
      <SectionHeading
        eyebrow="Filter"
        title="Refine"
        accent="your results."
        align="left"
        as="h3"
        className="mb-6"
      />

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
        <Button
          variant="secondary"
          size="s"
          onClick={onApply}
          className="w-full"
        >
          Apply
        </Button>
      </div>

      {hasActiveFilters && (
        <Link
          to="/products"
          onClick={clearAll}
          className="font-display text-[15px] font-semibold text-primary-700 underline decoration-2 underline-offset-4 transition-colors hover:text-primary-800"
        >
          Clear all <Icon icon={X} size={14} className="ml-1" />
        </Link>
      )}
    </aside>
  )
}
