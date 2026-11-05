import { FilterChip } from './FilterChip'

/*
 * Toolbar — PLP toolbar row (UI spec §14.3).
 * Left: active filter chips (scrollable on mobile).
 * Right: inline sort select (Newest · Price low→high · Price high→low).
 */
export function Toolbar({
  chips,
  onRemoveChip,
  sort,
  onSortChange,
}) {
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
  ]

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]">
        {chips.map((chip) => (
          <FilterChip
            key={chip.key}
            label={chip.label}
            onRemove={() => onRemoveChip(chip.key)}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-label font-medium text-ink hidden sm:block">
          Sort by:
        </span>
        <select
          name="sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="h-11 w-[200px] rounded-none border border-line-strong bg-white px-3 pr-10 text-body text-ink outline-none appearance-none transition-colors focus:border-primary-700"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute inset-y-0 right-0 grid w-6 place-items-center text-muted"
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
    </div>
  )
}
