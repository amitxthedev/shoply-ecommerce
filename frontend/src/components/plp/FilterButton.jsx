import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { FilterSheet } from './FilterSheet'
import { cn } from '../../utils/cn'

/*
 * FilterButton — mobile/tablet filter trigger (UI spec §16.3).
 * Manages its own open state; opens FilterSheet on <1024.
 * Shows active filter count badge. Hidden on desktop (rail is always visible).
 */
export function FilterButton({
  activeCategory,
  minPrice,
  maxPrice,
  setActiveCategory,
  clearAll,
  className,
}) {
  const [open, setOpen] = useState(false)
  const [searchParams] = useSearchParams()

  const filterCount =
    (activeCategory ? 1 : 0) +
    (minPrice !== undefined ? 1 : 0) +
    (maxPrice !== undefined ? 1 : 0) +
    (searchParams.get('q') ? 1 : 0)

  return (
    <>
      <Button
        variant="secondary"
        size="m"
        className={cn(
          'flex items-center gap-2 lg:hidden w-full sm:w-auto',
          className,
        )}
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal size={16} />
        Filters
        {filterCount > 0 && (
          <Badge size="s" className="ml-2">
            {filterCount}
          </Badge>
        )}
      </Button>

      <FilterSheet
        open={open}
        onClose={() => setOpen(false)}
        activeCategory={activeCategory}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setActiveCategory={setActiveCategory}
        clearAll={clearAll}
      />
    </>
  )
}
