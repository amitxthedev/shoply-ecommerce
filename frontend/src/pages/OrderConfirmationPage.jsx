import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { formatMoney } from '../utils/format'
import { useCart } from '../context/CartContext'

/*
 * OrderConfirmationPage — Order confirmation (UI spec §14.7).
 * Centered max 720: green circle ✓ (96) → H1 "Thank you — order confirmed"
 * → order number chip (surface-light plate, copy button) → summary card:
 * items · totals · shipping method · delivery estimate window →
 * primary "Track order" + secondary "Continue shopping" → guest-only panel.
 * Clears cart on mount (order is confirmed).
 */

// Shipping method display names
const SHIPPING_METHODS = {
  standard: { name: 'Standard shipping', window: '3–5 business days' },
  express: { name: 'Express shipping', window: '1–2 business days' },
}

export function OrderConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { clearCart } = useCart()

  const [copied, setCopied] = useState(false)

  // Get order data from navigation state (passed from CheckoutPage)
  const orderData = location.state

  // Compute delivery estimate (lazy init to avoid impurity during render)
  const deliveryDays = orderData ? (orderData.shippingMethod === 'express' ? 2 : 5) : 5
  const [deliveryEstimate] = useState(() => {
    const date = new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  })

  // Clear cart on mount (order is confirmed) — only when order data exists
  useEffect(() => {
    if (orderData) {
      clearCart()
    }
  }, [clearCart, orderData])

  // If no order data, redirect to cart
  useEffect(() => {
    if (!orderData) {
      navigate('/cart', { replace: true })
    }
  }, [orderData, navigate])

  if (!orderData) {
    return null
  }

  const {
    orderNumber,
    items = [],
    address,
    shippingMethod = 'standard',
    subtotal = 0,
    shipping = 0,
    tax = 0,
    total = 0,
  } = orderData

  const shippingInfo = SHIPPING_METHODS[shippingMethod] || SHIPPING_METHODS.standard

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section className="bg-white">
      <Container className="py-12 sm:py-[72px] md:py-24">
        <div className="max-w-[720px] mx-auto text-center">
          {/* Green check circle */}
          <div className="h-24 w-24 mx-auto bg-primary-100 rounded-none flex items-center justify-center mb-6">
            <span className="text-4xl text-primary-700">✓</span>
          </div>

          {/* H1 */}
          <h1 className="font-display text-h1 font-bold text-ink mb-2">
            Thank you — order confirmed
          </h1>
          <p className="text-body text-body-copy mb-8">
            A confirmation email will be sent to {address?.email}.
          </p>

          {/* Order number chip */}
          <div className="inline-flex items-center gap-3 bg-surface-light rounded-none px-5 py-3 mb-8">
            <span className="text-body-sm text-muted">Order number</span>
            <span className="font-display text-label font-semibold text-ink">
              {orderNumber}
            </span>
            <button
              type="button"
              onClick={handleCopyOrderNumber}
              className="text-body-sm text-primary-700 underline decoration-2 underline-offset-4 hover:text-primary-800 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Summary card */}
          <div className="bg-surface-light rounded-none p-6 lg:p-8 text-left mb-8">
            {/* Items */}
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div
                  key={`${item.slug}-${item.color}-${item.size}`}
                  className="flex items-center gap-3"
                >
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

            {/* Shipping method + delivery estimate */}
            <div className="border-t border-line pt-4 mb-4 space-y-2">
              <div className="flex justify-between text-body-sm">
                <span className="text-muted">Shipping method</span>
                <span className="text-ink font-medium">
                  {shippingInfo.name} ({shippingInfo.window})
                </span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-muted">Estimated delivery</span>
                <span className="text-ink font-medium">{deliveryEstimate}</span>
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-line pt-4 space-y-2 text-body text-body-copy">
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

            {/* Payment status — demo/pending label */}
            <div className="mt-4 flex items-center gap-2 text-body-sm text-muted">
              <span className="h-4 w-4 bg-surface-light rounded-none flex items-center justify-center text-micro">
                ✓
              </span>
              <span>Payment status: pending (demo — no real payment processed)</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button variant="primary" size="m" to="/account/orders">
              View order details
            </Button>
            <Button variant="secondary" size="m" to="/products">
              Continue shopping
            </Button>
          </div>

          {/* Guest-only panel */}
          {address && !address.email.includes('@shoply') && (
            <div className="bg-surface-light rounded-none p-6 lg:p-8 text-left">
              <h3 className="font-display text-h4 font-semibold text-ink mb-2">
                Create an account to track this order
              </h3>
              <p className="text-body-sm text-body-copy mb-4">
                Save your details for faster checkout next time.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="m" to="/register">
                  Create account
                </Button>
                <button
                  type="button"
                  onClick={() => {}}
                  className="text-body-sm text-muted underline decoration-2 underline-offset-4 hover:text-primary-700 transition-colors"
                >
                  No thanks
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
