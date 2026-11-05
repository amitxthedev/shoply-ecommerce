import { useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import { formatMoney } from '../../utils/format'
import { Button } from '../ui/Button'

/*
 * CartDrawer — slide-in cart drawer from navbar (UI spec §7.3 pattern).
 * Opens from navbar cart icon. Esc closes, focus returns to trigger.
 * Shows cart items, subtotal, checkout CTA, empty state.
 */
export function CartDrawer({ open, onClose }) {
  const { items, removeFromCart, updateQuantity, subtotal, shipping, total, cartCount } = useCart()

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/50 transition-opacity duration-250" aria-hidden="true" />
      <div
        className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-white shadow-modal transition-transform duration-250 translate-x-0"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-line px-4">
          <h2 className="font-display text-h4 font-semibold text-ink">
            Cart ({cartCount})
          </h2>
          <button
            type="button"
            aria-label="Close cart"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-none text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="h-16 w-16 bg-surface-light rounded-none flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <h3 className="font-display text-h4 font-semibold text-ink mb-2">
                Your cart is empty
              </h3>
              <p className="text-body-sm text-muted mb-6">
                Add some essentials to get started.
              </p>
              <Button variant="primary" size="m" to="/products" onClick={onClose}>
                Continue shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartDrawerItem
                  key={`${item.slug}-${item.color}-${item.size}`}
                  item={item}
                  onUpdateQuantity={(qty) => updateQuantity(item.slug, item.color, item.size, qty)}
                  onRemove={() => removeFromCart(item.slug, item.color, item.size)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer — summary + checkout */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-line px-4 py-4 space-y-3">
            <div className="flex justify-between text-body-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-medium text-ink tabular-nums">{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between text-body-sm">
              <span className="text-muted">Shipping</span>
              <span className="font-medium text-ink tabular-nums">
                {shipping === 0 ? 'Free' : formatMoney(shipping)}
              </span>
            </div>
            <div className="flex justify-between border-t border-line pt-3">
              <span className="font-display font-semibold text-ink">Total</span>
              <span className="font-display font-bold text-ink tabular-nums">{formatMoney(total)}</span>
            </div>
            <Button variant="primary" size="l" className="w-full" to="/cart" onClick={onClose}>
              View cart
            </Button>
            <Button variant="secondary" size="m" className="w-full" to="/checkout" onClick={onClose}>
              Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

/*
 * CartDrawerItem — single line item in the drawer.
 */
function CartDrawerItem({ item, onUpdateQuantity, onRemove }) {
  const increment = () => onUpdateQuantity(Math.min(item.quantity + 1, 10))
  const decrement = () => onUpdateQuantity(Math.max(item.quantity - 1, 1))

  return (
    <div className="flex gap-3 border-b border-line pb-4 last:border-b-0 last:pb-0">
      {/* Image */}
      <div className="h-16 w-16 shrink-0 overflow-hidden bg-surface-light rounded-none">
        {item.image && (
          <img
            src={item.image}
            alt={item.alt || item.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <a
          href={`/products/${item.slug}`}
          className="font-display text-label font-semibold text-ink leading-none hover:text-primary-700 transition-colors"
        >
          {item.name}
        </a>

        <div className="flex flex-wrap gap-2 mt-1">
          {item.color && (
            <span className="text-body-sm text-muted">{item.color}</span>
          )}
          {item.size && (
            <span className="text-body-sm text-muted">Size {item.size}</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-price-card font-semibold tabular-nums text-ink">
            {formatMoney(item.price)}
          </span>

          <div className="flex items-center gap-2">
            {/* Qty stepper */}
            <div className="flex items-center border border-line-strong rounded-none">
              <button
                type="button"
                onClick={decrement}
                disabled={item.quantity <= 1}
                aria-label="Decrease quantity"
                className="grid h-8 w-8 place-items-center text-ink transition-colors hover:bg-surface-light disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <span className="flex-1 text-center text-body-sm font-medium text-ink min-w-[24px]">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={increment}
                disabled={item.quantity >= 10}
                aria-label="Increase quantity"
                className="grid h-8 w-8 place-items-center text-ink transition-colors hover:bg-surface-light disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={onRemove}
              aria-label="Remove item"
              className="grid h-8 w-8 place-items-center text-muted transition-colors hover:text-error-700"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
