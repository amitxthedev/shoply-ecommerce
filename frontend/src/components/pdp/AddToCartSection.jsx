import { useCart } from '../../context/CartContext'
import { Button } from '../ui/Button'

/*
 * AddToCartSection — PDP add to cart (UI spec §14.4).
 * Stock status → qty stepper (44) + Add to cart (L pill, flex-1, arrow) →
 * Buy Now (secondary) → delivery info block.
 * No backend — Add to Cart uses CartContext with localStorage.
 */
export function AddToCartSection({ product, quantity, setQuantity, onAddToCart }) {
  const { addToCart } = useCart()
  const { availability, stock } = product
  const soldOut = availability === 'SOLD_OUT'
  const lowStock = !soldOut && stock !== undefined && stock <= 5

  const increment = () => setQuantity((q) => Math.min(q + 1, 10))
  const decrement = () => setQuantity((q) => Math.max(q - 1, 1))

  const handleAddToCart = () => {
    addToCart(product, quantity, null, null)
    if (onAddToCart) onAddToCart()
  }

  return (
    <div className="space-y-4">
      {/* Stock status */}
      <div className="flex items-center gap-2">
        {soldOut ? (
          <span className="text-body-sm font-medium text-muted">Sold out</span>
        ) : lowStock ? (
          <span className="text-body-sm font-medium text-accent-500">
            Only {stock} left
          </span>
        ) : (
          <span className="text-body-sm font-medium text-primary-700">In stock</span>
        )}
      </div>

      {/* Qty + Add to cart row */}
      {!soldOut && (
        <div className="flex items-center gap-3">
          {/* Qty stepper */}
          <div className="flex items-center border border-line-strong rounded-none">
            <button
              type="button"
              onClick={decrement}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="grid h-11 w-11 place-items-center text-ink transition-colors hover:bg-surface-light disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <span className="flex-1 text-center text-body font-medium text-ink min-w-[40px]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={increment}
              disabled={quantity >= 10}
              aria-label="Increase quantity"
              className="grid h-11 w-11 place-items-center text-ink transition-colors hover:bg-surface-light disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {/* Add to cart */}
          <Button
            size="l"
            className="flex-1 group"
            onClick={handleAddToCart}
          >
            Add to cart
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Button>
        </div>
      )}

      {/* Buy Now */}
      {!soldOut && (
        <Button
          variant="secondary"
          size="l"
          className="w-full"
          onClick={() => {}}
        >
          Buy now
        </Button>
      )}

      {/* Delivery info block */}
      <div className="mt-4 space-y-3 border-t border-line pt-4">
        <DeliveryRow icon="Truck" text="Free shipping on orders over $180" />
        <DeliveryRow icon="Clock" text="Delivery in 3–5 business days" />
        <DeliveryRow icon="RefreshCw" text="Free returns within 30 days" />
      </div>
    </div>
  )
}

/*
 * DeliveryRow — single delivery info row with icon + text.
 */
function DeliveryRow({ icon, text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 shrink-0 bg-surface-light rounded-none flex items-center justify-center">
        <span className="text-micro text-primary-700">{icon}</span>
      </div>
      <span className="text-body-sm text-body-copy">{text}</span>
    </div>
  )
}
