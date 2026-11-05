/*
 * HeroRightVisual — right-side hero composition matching the reference.
 * A medium main fashion image with four overlapping cards at its corners.
 * All elements use square corners and explicit dimensions.
 */
import { Link } from 'react-router-dom'
import { Badge } from '../ui/Badge'

export function HeroRightVisual() {
  return (
    <div className="relative inline-block max-w-[520px]">
      {/* Secondary image — partially visible behind main image, top-left */}
      <div className="absolute -top-4 -left-3 w-[160px] h-[200px] overflow-hidden bg-surface-light z-0">
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=320&h=400&fit=crop"
          alt="Secondary fashion detail"
          className="h-full w-full object-cover object-center opacity-90"
          loading="lazy"
        />
      </div>

      {/* Main fashion photograph — medium, central */}
      <div className="relative aspect-[4/5] overflow-hidden bg-white shadow-modal z-10">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=480&h=600&fit=crop"
          alt="Model wearing charcoal wool overcoat"
          className="h-full w-full object-cover object-center"
          loading="eager"
        />
      </div>

      {/* Floating product card — upper-right, overlapping main image */}
      <Link
        to="/products/wool-overcoat"
        className="absolute -top-4 right-0 w-[180px] bg-white border border-line shadow-toast z-20"
      >
        <div className="relative h-[100px] overflow-hidden bg-surface-light">
          <img
            src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=360&h=360&fit=crop"
            alt="Wool Overcoat — Charcoal"
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
          <Badge tone="success" size="s" className="absolute left-3 top-3 rounded-none">
            In stock
          </Badge>
        </div>
        <div className="p-3">
          <h4 className="font-display text-h4 font-semibold text-ink leading-none mb-1">
            Wool Overcoat — Charcoal
          </h4>
          <span className="text-body font-semibold text-ink tabular-nums">$189.00</span>
        </div>
      </Link>

      {/* Customer/stats card — lower-left of main image */}
      <div className="absolute bottom-4 left-0 w-[180px] bg-white border border-line shadow-toast z-20 p-3.5">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="h-4 w-4 bg-primary-700 rounded-none shrink-0" />
          <span className="font-display text-label font-semibold text-ink leading-none">1,000+</span>
        </div>
        <p className="text-body-sm text-muted">customers worldwide</p>
      </div>

      {/* Promotional card — lower-right, deep green */}
      <div className="absolute bottom-4 right-0 w-[160px] bg-primary-700 text-white shadow-toast z-20 p-3.5">
        <p className="font-display text-label font-semibold text-white leading-none mb-1">
          New season
        </p>
        <p className="text-body-sm text-primary-100">Free shipping over $180</p>
      </div>
    </div>
  )
}
