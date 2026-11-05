import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { Badge } from '../ui/Badge'

/*
 * CategoryCard — home category showcase tile (UI spec §0.5 module 5):
 * 4:3 image plate (empty surface-light plate until photography ships),
 * count chip, title, subcategory link list, square arrow affordance.
 * White card on a surface-light band (§7.1 — separation by surface only).
 */
export function CategoryCard({ category, className }) {
  const { name, slug, count, subcategories, image, to = `/category/${slug}` } = category

  return (
    <Link
      to={to}
      className={cn(
        'group block rounded-none bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700',
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-light">
        {image && (
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        )}
        <Badge className="absolute left-4 top-4">{count} Items</Badge>
      </div>

      <div className="flex items-center justify-between gap-4 p-5 md:p-6">
        <div>
          <h3 className="font-display text-h4 font-semibold text-ink transition-colors duration-200 group-hover:text-primary-700">
            {name}
          </h3>
          {/* Subcategory lists only where provided (homepage omits them — C6/DS-DEC-09) */}
          {subcategories?.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {subcategories.map((item) => (
                <li key={item} className="text-body-sm text-muted">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-none border border-line-strong text-ink transition-colors group-hover:border-primary-700 group-hover:bg-primary-700 group-hover:text-white"
          aria-hidden="true"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
