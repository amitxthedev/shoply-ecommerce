import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatMoney } from '../utils/format'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'

/*
 * CartPage — dedicated cart page (UI spec §14.5).
 * Grid `1fr | 380` gap 32. Left: H1 + N items, line rows separated by hairlines.
 * Right: summary card (surface-light, 0px, padding 24): Subtotal · Shipping ·
 * Total → Proceed to checkout → Continue shopping → trust line.
 * Empty state: icon + "Your cart is empty" + primary "Browse products".
 */
export function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    shipping,
    total,
    cartCount,
    clearCart,
    FREE_SHIPPING_THRESHOLD,
  } = useCart()

  if (items.length === 0) {
    return (
      <section className="bg-white">
        <Container className="py-12 sm:py-[72px] md:py-24">
          <div className="max-w-[520px] mx-auto text-center">
            <div className="h-16 w-16 mx-auto bg-surface-light rounded-none flex items-center justify-center mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <h1 className="font-display text-h1 font-bold text-ink mb-4">
              Your cart is empty
            </h1>
            <p className="text-body text-body-copy mb-8">
              Add some essentials to get started.
            </p>
            <Button variant="primary" size="l" to="/products">
              Browse products
            </Button>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="bg-white">
      <Container className="py-12 sm:py-[72px] md:py-24">
        {/* H1 + item count */}
        <div className="mb-8">
          <h1 className="font-display text-h1 font-bold text-ink mb-2">
            Shopping cart
          </h1>
          <p className="text-body-sm text-muted">
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Grid: 1fr | 380 */}
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
          {/* Left — cart items */}
          <div className="mb-8 lg:mb-0">
            <div className="border-t border-line">
              {items.map((item) => (
                <CartItem
                  key={`${item.slug}-${item.color}-${item.size}`}
                  item={item}
                  onUpdateQuantity={(qty) => updateQuantity(item.slug, item.color, item.size, qty)}
                  onRemove={() => removeFromCart(item.slug, item.color, item.size)}
                />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Button variant="ghost" size="m" to="/products">
                Continue shopping
              </Button>
              <button
                type="button"
                onClick={clearCart}
                className="text-body-sm text-muted hover:text-error-700 transition-colors"
              >
                Clear cart
              </button>
            </div>
          </div>

          {/* Right — summary card */}
          <div className="lg:sticky lg:top-[100px]">
            <div className="bg-surface-light rounded-none p-6 lg:p-8">
              <h2 className="font-display text-h4 font-semibold text-ink mb-4">
                Order summary
              </h2>

              <div className="space-y-3 text-body text-body-copy">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium">{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="tabular-nums font-medium">
                    {shipping === 0 ? 'Free' : formatMoney(shipping)}
                  </span>
                </div>
                {subtotal < FREE_SHIPPING_THRESHOLD && items.length > 0 && (
                  <p className="text-body-sm text-muted">
                    Add {formatMoney(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
                  </p>
                )}
              </div>

              <div className="border-t border-line mt-4 pt-4 flex justify-between">
                <span className="font-display font-semibold text-ink">Total</span>
                <span className="font-display font-bold text-ink tabular-nums">{formatMoney(total)}</span>
              </div>

              <div className="mt-6 space-y-3">
                <Button variant="primary" size="l" className="w-full" to="/checkout">
                  Proceed to checkout
                </Button>
                <Button variant="ghost" size="m" className="w-full" to="/products">
                  Continue shopping
                </Button>
              </div>

              <div className="mt-6 flex items-center gap-2 text-body-sm text-muted">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Secure checkout · Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

/*
 * CartItem — single cart line row (UI spec §14.5).
 * Grid: 96×96 image plate · name/options/price stack · qty stepper · line total · remove.
 */
function CartItem({ item, onUpdateQuantity, onRemove }) {
  const increment = () => onUpdateQuantity(Math.min(item.quantity + 1, 10))
  const decrement = () => onUpdateQuantity(Math.max(item.quantity - 1, 1))

  return (
    <div className="grid grid-cols-[96px_1fr] gap-4 py-6 border-b border-line last:border-b-0">
      {/* Image */}
      <div className="h-24 w-24 shrink-0 overflow-hidden bg-surface-light rounded-none">
        {item.image && (
          <img
            src={item.image}
            alt={item.alt || item.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col justify-between">
        <div>
          <Link
            to={`/products/${item.slug}`}
            className="font-display text-label font-semibold text-ink hover:text-primary-700 transition-colors"
          >
            {item.name}
          </Link>
          <div className="flex flex-wrap gap-2 mt-1">
            {item.color && (
              <span className="text-body-sm text-muted">{item.color}</span>
            )}
            {item.size && (
              <span className="text-body-sm text-muted">Size {item.size}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
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
              className="text-body-sm text-muted hover:text-error-700 transition-colors"
            >
              Remove
            </button>
          </div>

          <span className="text-price-card font-semibold tabular-nums text-ink">
            {formatMoney(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}
