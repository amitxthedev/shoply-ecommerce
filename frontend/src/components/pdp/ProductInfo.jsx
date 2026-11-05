import { Badge } from '../ui/Badge'
import { formatMoney } from '../../utils/format'
import { useWishlist } from '../../context/WishlistContext'

/*
 * ProductInfo — PDP product details (UI spec §14.4).
 * Category label → H1 → price row → description → material.
 * Includes wishlist toggle button next to product name.
 * Square corners, no border radius, minimal whitespace.
 */
export function ProductInfo({ product }) {
  const { name, category, price, compareAtPrice, description, materials } = product
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const wishlisted = isInWishlist(product.slug)

  const discounted = typeof compareAtPrice === 'number' && compareAtPrice > price
  const discountPercent = discounted
    ? Math.round((1 - price / compareAtPrice) * 100)
    : 0

  const toggleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(product.slug)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <div>
      {/* Category label */}
      <p className="font-display text-eyebrow font-semibold uppercase text-muted mb-2">
        {category}
      </p>

      {/* Product name + wishlist button */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="font-display text-h1 font-bold text-ink leading-tight">
          {name}
        </h1>
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-none border transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 ${
            wishlisted
              ? 'bg-primary-700 text-white border-primary-700'
              : 'bg-white text-muted border-line-strong hover:text-primary-700 hover:border-primary-700'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Price row */}
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-price-hero font-bold tabular-nums text-ink">
          {formatMoney(price)}
        </span>
        {discounted && (
          <>
            <span className="text-body text-muted line-through tabular-nums">
              {formatMoney(compareAtPrice)}
            </span>
            <Badge className="absolute left-0 top-0">
              {discountPercent}% OFF
            </Badge>
          </>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-body text-body-copy mb-4 max-w-[55ch] leading-relaxed">
          {description}
        </p>
      )}

      {/* Materials */}
      {materials && (
        <p className="text-body-sm text-muted mb-4">
          <span className="font-medium text-ink">Materials:</span> {materials}
        </p>
      )}
    </div>
  )
}
