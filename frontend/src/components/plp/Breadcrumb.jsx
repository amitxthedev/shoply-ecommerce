import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../utils/cn'

/*
 * Breadcrumb — PLP breadcrumb navigation (UI spec §14.3).
 * Shows Home > Category name, or Home > Search results for "query".
 * Square corners, no borders, minimal whitespace.
 */
export function Breadcrumb({ categoryName, searchQuery }) {
  const location = useLocation()

  const crumbs = [
    { label: 'Home', to: '/' },
  ]

  if (searchQuery) {
    crumbs.push({ label: `Search results for "${searchQuery}"`, to: location.pathname })
  } else if (categoryName) {
    crumbs.push({ label: categoryName, to: location.pathname })
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap gap-1.5 text-body-sm text-muted"
    >
      {crumbs.map((crumb, index) => (
        <span key={crumb.label} className="flex items-center gap-1">
          {index > 0 && (
            <span className="mx-1" aria-hidden="true">
              /
            </span>
          )}
          <Link
            to={crumb.to}
            className={cn(
              index === crumbs.length - 1 ? 'text-ink font-medium' : 'text-muted hover:text-primary-700',
            )}
          >
            {crumb.label}
          </Link>
        </span>
      ))}
    </nav>
  )
}
