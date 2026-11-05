import { formatMoney } from '../../utils/format'
import { Button } from '../ui/Button'

/*
 * OrderSummary — checkout order summary sidebar (UI spec §14.6).
 * Sticky on desktop (top 100). Line items (thumb 48, name, qty × price) ·
 * Subtotal · Shipping · Estimated tax · Total · lock microcopy.
 * All costs visible before payment (BR-21).
 */
export function OrderSummary({ items, subtotal, shipping, tax, total, discountCode, onDiscountChange }) {
  return (
    <div className="bg-surface-light rounded-none p-6 lg:p-8 lg:sticky lg:top-[100px]">
      <h2 className="font-display text-h4 font-semibold text-ink mb-4">
        Order summary
      </h2>

      {/* Line items */}
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={`${item.slug}-${item.color}-${item.size}`} className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden bg-white rounded-none">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.alt || item.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-medium text-ink leading-none truncate">
                {item.name}
              </p>
              <p className="text-body-sm text-muted mt-0.5">
                {item.quantity} × {formatMoney(item.price)}
              </p>
            </div>
            <span className="text-body-sm font-semibold text-ink tabular-nums">
              {formatMoney(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Discount code */}
      <div className="mb-4">
        <label htmlFor="discount-code" className="mb-1.5 block text-label font-medium text-ink">
          Discount code
        </label>
        <div className="flex gap-2">
          <input
            id="discount-code"
            type="text"
            value={discountCode}
            onChange={(e) => onDiscountChange(e.target.value)}
            placeholder="Enter code"
            className="flex-1 h-11 rounded-none border border-line-strong bg-white px-3 text-body text-ink outline-none placeholder:text-muted focus:border-primary-700"
          />
          <Button variant="secondary" size="m" className="shrink-0">
            Apply
          </Button>
        </div>
      </div>

      {/* Totals */}
      <div className="space-y-2 text-body text-body-copy border-t border-line pt-4">
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
        <div className="flex justify-between">
          <span>Estimated tax</span>
          <span className="tabular-nums font-medium">{formatMoney(tax)}</span>
        </div>
      </div>

      <div className="border-t border-line mt-3 pt-3 flex justify-between">
        <span className="font-display font-semibold text-ink">Total</span>
        <span className="font-display font-bold text-ink tabular-nums">{formatMoney(total)}</span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-body-sm text-muted">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>Secure checkout · Stripe</span>
      </div>
    </div>
  )
}
