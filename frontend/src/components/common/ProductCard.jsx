import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { formatMoney } from '../../utils/format'
import { Badge } from '../ui/Badge'
import { useWishlist } from '../../context/WishlistContext'

/**
 * ProductCard — UI spec §10 (V1 anatomy):
 *   1:1 image plate on surface-light · green discount badge (only when a
 *   compare-at price exists) · row 1 category + price · row 2 name (2-line
 *   clamp) · row 3 compare-at strike when discounted.
 * Hover: image scales 1.03, name turns green — no lift, no shadow.
 * The whole card is one link to the PDP. Wishlist toggle button overlay
 * on image (top-right). Badges come from the shared Badge component.
 */
export function ProductCard({ product }) {
  const { slug, name, category, price, compareAtPrice, image, alt, availability } =
    product
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const wishlisted = isInWishlist(slug)

  const discounted = typeof compareAtPrice === 'number' && compareAtPrice > price
  const discountPercent = discounted
    ? Math.round((1 - price / compareAtPrice) * 100)
    : 0
  const soldOut = availability === 'SOLD_OUT'

  const toggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (wishlisted) {
      removeFromWishlist(slug)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <Link
      to={`/products/${slug}`}
      className="group block rounded-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-light">
        {image && (
          <img
            src={image}
            alt={alt ?? name}
            loading="lazy"
            className={cn(
              'h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]',
              soldOut && 'opacity-60',
            )}
          />
        )}
        {discounted && (
          <Badge className="absolute left-0 top-0">
            {discountPercent}% OFF
          </Badge>
        )}
        {soldOut && (
          <Badge
            tone="neutral"
            uppercase
            className="absolute bottom-0 left-0"
          >
            Sold out
          </Badge>
        )}
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className={cn(
            'absolute top-2 right-2 grid h-8 w-8 place-items-center rounded-none border transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700',
            wishlisted
              ? 'bg-primary-700 text-white border-primary-700'
              : 'bg-white text-muted border-line-strong hover:text-primary-700 hover:border-primary-700',
          )}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="px-3 pt-3 sm:px-0 sm:pt-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-body-sm text-muted">{category}</span>
          <span className="text-price-card font-semibold tabular-nums text-ink">
            {formatMoney(price)}
          </span>
        </div>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-ink transition-colors duration-150 group-hover:text-primary-700">
          {name}
        </h3>
        {discounted && (
          <p className="mt-1 text-body-sm text-muted line-through tabular-nums">
            {formatMoney(compareAtPrice)}
          </p>
        )}
      </div>
    </Link>
  )
}
