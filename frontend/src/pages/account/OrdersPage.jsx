import { Link } from 'react-router-dom'
import { getDemoOrders, ORDER_STATUS_LABELS } from '../../data/account'
import { formatMoney } from '../../utils/format'
import { Badge } from '../../components/ui/Badge'

/*
 * OrdersPage — Order history (UI spec §14.8).
 * Table (white, 0px, hairline rows): Order · Date · Status badge · Total · View ghost.
 * Status badges per §4.3.
 */
export function OrdersPage() {
  const orders = getDemoOrders()

  if (orders.length === 0) {
    return (
      <div>
        <h2 className="font-display text-h2 font-bold text-ink mb-4">Orders</h2>
        <p className="text-body text-body-copy">
          You haven't placed any orders yet.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-display text-h2 font-bold text-ink mb-6">Orders</h2>

      {/* Desktop table */}
      <div className="hidden md:block overflow-hidden border border-line rounded-none">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line bg-surface-light">
              <th className="px-4 py-3 text-left text-body-sm font-semibold text-ink">Order</th>
              <th className="px-4 py-3 text-left text-body-sm font-semibold text-ink">Date</th>
              <th className="px-4 py-3 text-left text-body-sm font-semibold text-ink">Status</th>
              <th className="px-4 py-3 text-right text-body-sm font-semibold text-ink">Total</th>
              <th className="px-4 py-3 text-right text-body-sm font-semibold text-ink">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const statusInfo = ORDER_STATUS_LABELS[order.status] || { label: order.status, tone: 'neutral' }
              return (
                <tr key={order.id} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-4 text-body-sm font-medium text-ink">{order.id}</td>
                  <td className="px-4 py-4 text-body-sm text-muted">
                    {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-4">
                    <Badge tone={statusInfo.tone} size="s" uppercase>
                      {statusInfo.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-body-sm font-semibold text-ink text-right tabular-nums">
                    {formatMoney(order.total)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      to={`/account/orders/${order.id}`}
                      className="text-body-sm text-primary-700 font-medium underline decoration-2 underline-offset-4 hover:text-primary-800"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {orders.map((order) => {
          const statusInfo = ORDER_STATUS_LABELS[order.status] || { label: order.status, tone: 'neutral' }
          return (
            <div key={order.id} className="border border-line rounded-none p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-label font-semibold text-ink">{order.id}</span>
                <Badge tone={statusInfo.tone} size="s" uppercase>
                  {statusInfo.label}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-sm text-muted">
                  {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="text-body-sm font-semibold text-ink tabular-nums">
                  {formatMoney(order.total)}
                </span>
              </div>
              <Link
                to={`/account/orders/${order.id}`}
                className="block mt-3 text-body-sm text-primary-700 font-medium underline decoration-2 underline-offset-4 hover:text-primary-800"
              >
                View details →
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}




