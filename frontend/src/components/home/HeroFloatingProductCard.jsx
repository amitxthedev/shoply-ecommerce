/*
 * HeroFloatingProductCard — floating product card at the upper-right of
 * the main image. Product image + name + price + small badge.
 */
import { Link } from 'react-router-dom'
import { Badge } from '../ui/Badge'

export function HeroFloatingProductCard({ product }) {
  const { name, price, image, alt } = product

  return (
    <Link
      to={`/products/${product.slug}`}
      className="absolute -top-10 right-4 w-[180px] h-[240px] overflow-hidden bg-white border border-line shadow-modal z-20 lg:w-[200px] lg:h-[280px]"
    >
      <div className="relative h-[120px] bg-surface-light lg:h-[150px]">
        <img
          src={image}
          alt={alt ?? name}
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <Badge tone="success" size="m" className="mb-2 rounded-none">
          In stock
        </Badge>
        <h4 className="font-display text-h4 font-semibold text-ink leading-none mb-1">
          {name}
        </h4>
        <span className="text-body font-semibold text-ink tabular-nums">${price}</span>
      </div>
    </Link>
  )
}
