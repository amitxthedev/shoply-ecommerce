/*
 * HeroPromoCard — promotional card at the lower-right of the main image.
 * Deep green background (#06571D), white typography, compact content.
 */
export function HeroPromoCard({ headline, subhead }) {
  return (
    <div className="absolute bottom-4 right-4 w-[180px] bg-primary-700 text-white p-4 shadow-toast z-20 lg:w-[220px] lg:p-5">
      <p className="font-display text-label font-semibold leading-none mb-1">{headline}</p>
      <p className="text-body-sm text-primary-100">{subhead}</p>
    </div>
  )
}
