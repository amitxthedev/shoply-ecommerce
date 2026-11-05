import { useParams } from 'react-router-dom'
import { getDemoOrderById, ORDER_STATUS_LABELS } from '../../data/account'
import { formatMoney } from '../../utils/format'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

/*
 * OrderDetailPage — Order detail (UI spec §14.8).
 * H2 order number + status badge → items table · totals · address snapshot
 * card · payment row · status timeline → Cancel order danger-ghost (only PENDING).
 */
export function OrderDetailPage() {
  const { id } = useParams()
  const order = getDemoOrderById(id)

  if (!order) {
    return (
      <div>
        <h2 className="font-display text-h2 font-bold text-ink mb-4">Order not found</h2>
        <p className="text-body text-body-copy mb-6">
          The order you're looking for doesn't exist.
        </p>
        <Button variant="primary" size="m" to="/account/orders">
          Back to orders
        </Button>
      </div>
    )
  }

  const statusInfo = ORDER_STATUS_LABELS[order.status] || { label: order.status, tone: 'neutral' }
  const canCancel = order.status === 'PENDING'

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-h2 font-bold text-ink mb-1">
            {order.id}
          </h2>
          <p className="text-body-sm text-muted">
            Placed on {formatDate(order.date)}
          </p>
        </div>
        <Badge tone={statusInfo.tone} size="m" uppercase>
          {statusInfo.label}
        </Badge>
      </div>

      {/* Items table */}
      <div className="border border-line rounded-none overflow-hidden mb-6">
        <div className="bg-surface-light border-b border-line px-4 py-3">
          <span className="font-display text-label font-semibold text-ink">Items</span>
        </div>
        <div>
          {order.items.map((item) => (
            <div
              key={item.slug}
              className="flex items-center gap-4 px-4 py-4 border-b border-line last:border-b-0"
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden bg-surface-light rounded-none">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-medium text-ink">{item.name}</p>
                <p className="text-body-sm text-muted">
                  {item.quantity} × {formatMoney(item.price)}
                </p>
              </div>
              <span className="text-body-sm font-semibold text-ink tabular-nums">
                {formatMoney(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="bg-surface-light rounded-none p-4 lg:p-6 mb-6">
        <div className="space-y-2 text-body text-body-copy">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="tabular-nums font-medium">{formatMoney(order.total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="tabular-nums font-medium">
              {order.shippingMethod === 'express' ? '$14.95' : 'Free'}
            </span>
          </div>
        </div>
        <div className="border-t border-line mt-3 pt-3 flex justify-between">
          <span className="font-display font-semibold text-ink">Total</span>
          <span className="font-display font-bold text-ink tabular-nums">{formatMoney(order.total)}</span>
        </div>
      </div>

      {/* Address snapshot card */}
      <div className="border border-line rounded-none p-4 lg:p-6 mb-6">
        <h3 className="font-display text-label font-semibold text-ink mb-3">
          Shipping address
        </h3>
        <p className="text-body-sm text-body-copy">
          {order.address.fullName}<br />
          {order.address.address1}
          {order.address.address2 && <><br />{order.address.address2}</>}<br />
          {order.address.city}, {order.address.state} {order.address.zip}<br />
          {order.address.country}
        </p>
      </div>

      {/* Payment row */}
      <div className="border border-line rounded-none p-4 lg:p-6 mb-6">
        <h3 className="font-display text-label font-semibold text-ink mb-3">
          Payment
        </h3>
        <p className="text-body-sm text-body-copy">{order.paymentMethod}</p>
      </div>

      {/* Status timeline */}
      <div className="border border-line rounded-none p-4 lg:p-6 mb-6">
        <h3 className="font-display text-label font-semibold text-ink mb-4">
          Order timeline
        </h3>
        <div className="space-y-4">
          {order.timeline.map((event, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="h-3 w-3 mt-1.5 bg-primary-700 rounded-none shrink-0" />
              <div>
                <p className="text-body-sm font-medium text-ink">{event.status}</p>
                <p className="text-body-sm text-muted">
                  {formatDate(event.timestamp)} at {formatTime(event.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel order — only when PENDING */}
      {canCancel && (
        <div className="flex justify-end">
          <Button variant="danger" size="m" onClick={() => {}}>
            Cancel order
          </Button>
        </div>
      )}
    </div>
  )
}






