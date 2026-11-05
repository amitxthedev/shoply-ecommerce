import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'

/*
 * PromoBanner — full-bleed primary-700 band between the product modules
 * (the homepage's mid-page brand moment). Accent-500 eyebrow and heading
 * accent pass AA on green (§4.4 — same precedent as the announcement bar);
 * yellow is never used on light surfaces. Right column carries three
 * policy lines (icon + text) instead of a second section — keeps the band
 * balanced without the excluded USP/feature-strip modules. No countdown
 * (DS-DEC-02) and no coupon promise (DS-DEC-04).
 */

const POLICY_LINES = [
  'Free shipping on orders over $180',
  'Free returns within 30 days',
  'Repairs covered for two years',
]

export function PromoBanner() {
  return (
    <section className="bg-primary-700 text-white">
      <Container className="py-12 sm:py-[72px] md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-6 bg-accent-500" aria-hidden="true" />
              <span className="font-display text-eyebrow font-semibold uppercase text-accent-500">
                Seasonal edit
              </span>
            </div>

            <h2 className="mt-4 max-w-[20ch] font-display text-h2 font-bold text-white">
              Winter weight, <span className="text-accent-500">honestly priced.</span>
            </h2>

            <p className="mt-4 max-w-[54ch] text-body-lg text-white/80">
              Cold-weather layers built to outlast the season — traceable wool,
              waxed cotton and responsibly sourced down. Up to 30% off the
              outerwear edit while stock lasts.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button variant="secondary" size="l" to="/category/outerwear" className="group">
                Shop the winter edit
                <Icon
                  icon={ArrowRight}
                  size={18}
                  className="transition-transform duration-150 group-hover:translate-x-1"
                />
              </Button>
              <Link
                to="/products"
                className="font-display text-[15px] font-semibold text-white underline decoration-2 underline-offset-4 transition-colors hover:text-accent-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
              >
                Browse all products
              </Link>
            </div>
          </div>

          <ul className="space-y-4 lg:min-w-[300px]">
            {POLICY_LINES.map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span
                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center bg-white/10 text-accent-500"
                  aria-hidden="true"
                >
                  <Icon icon={Check} size={16} />
                </span>
                <span className="text-body text-white/90">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
