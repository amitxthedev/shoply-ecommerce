import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { useCart } from '../context/CartContext'
import { StepIndicator } from '../components/checkout/StepIndicator'
import { AddressForm } from '../components/checkout/AddressForm'
import { ShippingMethodSelector } from '../components/checkout/ShippingMethodSelector'
import { PaymentSection } from '../components/checkout/PaymentSection'
import { OrderSummary } from '../components/checkout/OrderSummary'

/*
 * CheckoutPage — stepped checkout (UI spec §14.6).
 * Step 1: Address → Step 2: Shipping → Step 3: Payment.
 * Grid `1fr | 400` gap 40; summary card sticky (top 100).
 * All costs visible before payment (BR-21). No real payment processing.
 * On submission: validate, console.log values, show confirmation state.
 */
export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [address, setAddress] = useState(null)
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [discountCode, setDiscountCode] = useState('')

  // Calculate shipping based on method
  const shippingCost =
    shippingMethod === 'express' ? 14.95 : subtotal >= 180 ? 0 : 5.95

  // Estimated tax (8.875% — NY rate as placeholder)
  const taxRate = 0.08875
  const tax = Math.round(subtotal * taxRate * 100) / 100

  const total = subtotal + shippingCost + tax

  const handleAddressSubmit = (values) => {
    setAddress(values)
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePlaceOrder = () => {
    // Validate all fields are present
    if (!address) {
      setStep(1)
      return
    }

    // Log checkout form values
    console.log('Checkout submission:', {
      address,
      shippingMethod,
      discountCode,
      items: items.map((i) => ({ slug: i.slug, name: i.name, qty: i.quantity, price: i.price })),
      subtotal,
      shipping: shippingCost,
      tax,
      total,
    })

    // Generate order number
    const orderNum = `SHOP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

    // Clear cart after order
    clearCart()

    // Navigate to order confirmation with order data
    navigate('/order-confirmation', {
      state: {
        orderNumber: orderNum,
        items: [...items],
        address,
        shippingMethod,
        subtotal,
        shipping: shippingCost,
        tax,
        total,
      },
      replace: true,
    })
  }

  // Empty cart redirect
  if (items.length === 0) {
    return (
      <section className="bg-white">
        <Container className="py-12 sm:py-[72px] md:py-24 text-center">
          <h1 className="font-display text-h1 font-bold text-ink mb-4">
            Your cart is empty
          </h1>
          <p className="text-body text-body-copy mb-8">
            Add some products before checking out.
          </p>
          <Button variant="primary" size="m" to="/products">
            Browse products
          </Button>
        </Container>
      </section>
    )
  }

  return (
    <section className="bg-white">
      <Container className="py-12 sm:py-[72px] md:py-24">
        <h1 className="font-display text-h1 font-bold text-ink mb-8">
          Checkout
        </h1>

        <StepIndicator currentStep={step} />

        <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-8">
          {/* Left — step panels */}
          <div>
            {step === 1 && (
              <AddressForm onSubmit={handleAddressSubmit} />
            )}

            {step === 2 && (
              <ShippingMethodSelector
                subtotal={subtotal}
                selected={shippingMethod}
                onSelect={setShippingMethod}
                onBack={() => setStep(1)}
                onContinue={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <PaymentSection
                total={total}
                onBack={() => setStep(2)}
                onPlaceOrder={handlePlaceOrder}
              />
            )}
          </div>

          {/* Right — order summary (sticky) */}
          <div className="mt-8 lg:mt-0">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shipping={shippingCost}
              tax={tax}
              total={total}
              discountCode={discountCode}
              onDiscountChange={setDiscountCode}
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
