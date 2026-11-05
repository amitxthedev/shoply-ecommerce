import { Button } from '../ui/Button'

/*
 * ShippingMethodSelector — Step 2: Shipping method selection (UI spec §14.6).
 * Method radio cards (0px, surface-light, selected = 2px primary-700).
 * Content from approved DEC-05: Standard 3–5 days, Express 1–2 days.
 */
const SHIPPING_METHODS = [
  {
    id: 'standard',
    name: 'Standard shipping',
    window: '3–5 business days',
    price: 5.95,
    freeThreshold: 180,
  },
  {
    id: 'express',
    name: 'Express shipping',
    window: '1–2 business days',
    price: 14.95,
    freeThreshold: null,
  },
]

export function ShippingMethodSelector({ subtotal, selected, onSelect, onBack, onContinue }) {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-h4 font-semibold text-ink mb-4">
        Delivery method
      </h3>

      <div className="space-y-3">
        {SHIPPING_METHODS.map((method) => {
          const isSelected = selected === method.id
          const isFree = method.freeThreshold !== null && subtotal >= method.freeThreshold
          const displayPrice = isFree ? 'Free' : `$${method.price.toFixed(2)}`

          return (
            <label
              key={method.id}
              className={`flex items-start gap-4 p-4 rounded-none border-2 cursor-pointer transition-colors duration-150 ${
                isSelected
                  ? 'border-primary-700 bg-primary-100'
                  : 'border-line bg-surface-light hover:border-line-strong'
              }`}
            >
              <input
                type="radio"
                name="shippingMethod"
                value={method.id}
                checked={isSelected}
                onChange={() => onSelect(method.id)}
                className="mt-1 shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-label font-semibold text-ink">
                    {method.name}
                  </span>
                  <span className="text-body font-semibold text-ink tabular-nums">
                    {displayPrice}
                  </span>
                </div>
                <p className="text-body-sm text-muted mt-0.5">
                  {method.window}
                  {isFree && ' · Free on orders over $180'}
                </p>
              </div>
            </label>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-body-sm font-medium text-primary-700 underline decoration-2 underline-offset-4 hover:text-primary-800 transition-colors"
        >
          ← Back to address
        </button>
        <Button variant="primary" size="l" onClick={onContinue} className="sm:w-auto">
          Continue to payment
        </Button>
      </div>
    </div>
  )
}
