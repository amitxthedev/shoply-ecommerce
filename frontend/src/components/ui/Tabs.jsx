import { useState } from 'react'
import { cn } from '../../utils/cn'

/*
 * Tabs — UI spec §8.3: height 44, active = primary-700 fill + white text,
 * inactive = white + 1px line outline + ink text, focus 2px outline.
 * Square corners (task rule overrides the spec's pill tabs).
 * Horizontal scroll on mobile (overflow-x-auto). Works controlled
 * (value/onChange) or uncontrolled (defaultValue). Tabs = buttons with
 * id={`tab-${id}`} so the caller's panel can point back with
 * aria-labelledby (A11Y-04): panel id={`tabpanel-${id}`}.
 */
export function Tabs({
  tabs,
  value,
  defaultValue,
  onChange,
  ariaLabel = 'Sections',
  className,
}) {
  const [internal, setInternal] = useState(defaultValue ?? tabs[0]?.id)
  const active = value ?? internal

  const select = (id) => {
    if (value === undefined) setInternal(id)
    onChange?.(id)
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            onClick={() => select(tab.id)}
            className={cn(
              'h-11 shrink-0 rounded-none px-5 font-display text-[15px] font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700',
              isActive
                ? 'bg-primary-700 text-white'
                : 'border border-line bg-white text-ink hover:bg-surface-light',
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
