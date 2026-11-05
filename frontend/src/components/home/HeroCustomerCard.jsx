/*
 * HeroCustomerCard — customer/statistics card at the lower-left of the
 * main image. White background, compact typography, small visual indicator.
 */
export function HeroCustomerCard({ count, label }) {
  return (
    <div className="absolute bottom-4 left-4 w-[200px] bg-white border border-line p-4 shadow-toast z-20 lg:w-[240px] lg:p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-6 w-6 bg-primary-700 rounded-none shrink-0" />
        <span className="text-label font-medium text-ink">{count}</span>
      </div>
      <p className="text-body-sm text-muted">{label}</p>
    </div>
  )
}
