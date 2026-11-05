import { getDemoAddresses } from '../../data/account'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'

/*
 * AddressesPage — Saved addresses (UI spec §14.8).
 * Card grid 2-up (0px white cards on band): label, address, Default green chip,
 * edit/delete icon-buttons; Add address primary; max-20 and default-handling
 * messages inline.
 */
export function AddressesPage() {
  const addresses = getDemoAddresses()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-h2 font-bold text-ink">Addresses</h2>
        <Button variant="primary" size="m">
          Add address
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="bg-surface-light rounded-none p-4 lg:p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-h4 font-semibold text-ink">
                {address.label}
              </h3>
              <div className="flex items-center gap-2">
                {address.isDefault && (
                  <Badge tone="success" size="s" uppercase>
                    Default
                  </Badge>
                )}
                <button
                  type="button"
                  aria-label="Edit address"
                  className="grid h-8 w-8 place-items-center rounded-none text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Delete address"
                  className="grid h-8 w-8 place-items-center rounded-none text-muted transition-colors hover:text-error-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 0-2 2H7a2 2 0 0 0-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
            <address className="not-italic text-body-sm text-body-copy">
              {address.fullName}<br />
              {address.address1}
              {address.address2 && <><br />{address.address2}</>}<br />
              {address.city}, {address.state} {address.zip}<br />
              {address.country}
            </address>
          </div>
        ))}
      </div>

      <p className="mt-6 text-body-sm text-muted">
        You can save up to 20 addresses. Default address is used for checkout.
      </p>
    </div>
  )
}




