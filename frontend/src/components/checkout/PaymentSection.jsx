import { Button } from '../ui/Button'

/*
 * PaymentSection — Step 3: Payment UI (UI spec §14.6).
 * Hosted Stripe element placeholder (iframe — our styles frame it with 0px input rules).
 * Order note: "Test mode — use card 4242…"
 * No real card collection. Frontend-only.
 */
export function PaymentSection({ total, onBack, onPlaceOrder }) {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-h4 font-semibold text-ink mb-4">
        Payment method
      </h3>

      {/* Stripe placeholder */}
      <div className="border border-line rounded-none p-6 bg-surface-light">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-12 bg-white rounded-none border border-line flex items-center justify-center">
            <span className="text-micro font-semibold text-muted">VISA</span>
          </div>
          <div className="h-8 w-12 bg-white rounded-none border border-line flex items-center justify-center">
            <span className="text-micro font-semibold text-muted">MC</span>
          </div>
          <div className="h-8 w-12 bg-white rounded-none border border-line flex items-center justify-center">
            <span className="text-micro font-semibold text-muted">AMEX</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-11 bg-white border border-line rounded-none px-4 flex items-center">
            <span className="text-body-sm text-muted">Card number</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-11 bg-white border border-line rounded-none px-4 flex items-center">
              <span className="text-body-sm text-muted">MM/YY</span>
            </div>
            <div className="h-11 bg-white border border-line rounded-none px-4 flex items-center">
              <span className="text-body-sm text-muted">CVC</span>
            </div>
          </div>
        </div>

        <p className="text-body-sm text-muted mt-4">
          Test mode — use card 4242 4242 4242 4242, any future date, any CVC.
        </p>
      </div>

      {/* Order note */}
      <div>
        <label htmlFor="order-note" className="mb-2 block text-label font-medium text-ink">
          Order note (optional)
        </label>
        <textarea
          id="order-note"
          rows={3}
          placeholder="Delivery instructions, gift message, etc."
          className="w-full resize-y rounded-none border border-line-strong bg-white px-4 py-3 text-body text-ink outline-none transition-colors placeholder:text-muted focus:border-primary-700 min-h-[80px]"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-body-sm font-medium text-primary-700 underline decoration-2 underline-offset-4 hover:text-primary-800 transition-colors"
        >
          ← Back to shipping
        </button>
        <Button variant="primary" size="l" onClick={onPlaceOrder} className="sm:w-auto">
          Place order · ${total.toFixed(2)}
        </Button>
      </div>
    </div>
  )
}
