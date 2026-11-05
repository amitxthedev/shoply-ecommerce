import { Button } from '../../components/ui/Button'
import { getDemoCustomer, getDemoOrders, getDemoAddresses } from '../../data/account'

/*
 * AccountOverviewPage — Account overview (UI spec §14.8).
 * Greeting H2 + 3 stat cards (orders count, default address, member since)
 * + "View orders" primary.
 */
export function AccountOverviewPage() {
  const customer = getDemoCustomer()
  const orders = getDemoOrders()
  const addresses = getDemoAddresses()
  const defaultAddress = addresses.find((a) => a.isDefault)

  const memberSince = new Date(customer.memberSince).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div>
      <h2 className="font-display text-h2 font-bold text-ink mb-2">
        Welcome back, {customer.name}
      </h2>
      <p className="text-body text-body-copy mb-8">
        Here's an overview of your account.
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8">
        <div className="bg-surface-light rounded-none p-6">
          <p className="text-body-sm text-muted mb-2">Total orders</p>
          <p className="font-display text-h1 font-bold text-ink">{orders.length}</p>
        </div>
        <div className="bg-surface-light rounded-none p-6">
          <p className="text-body-sm text-muted mb-2">Default address</p>
          <p className="text-body font-medium text-ink">
            {defaultAddress ? `${defaultAddress.city}, ${defaultAddress.state}` : 'None set'}
          </p>
        </div>
        <div className="bg-surface-light rounded-none p-6">
          <p className="text-body-sm text-muted mb-2">Member since</p>
          <p className="text-body font-medium text-ink">{memberSince}</p>
        </div>
      </div>

      <Button variant="primary" size="m" to="/account/orders">
        View orders
      </Button>
    </div>
  )
}





