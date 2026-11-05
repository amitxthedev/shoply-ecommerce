import { Link } from 'react-router-dom'
import { footerColumns } from '../../data/navigation'
import { Container } from '../ui/Container'
import { Logo } from '../common/Logo'

/*
 * Footer — UI spec §12: full-bleed green band bookending the announcement bar.
 * 4 columns desktop → 2 tablet → stacked mobile. Links white/80 → white with
 * accent underline on hover. Excluded in V1: social icons, newsletter (DS-DEC-05,
 * FR-NTF-05 V2). Payment marks are static text marks until brand SVGs ship.
 */

const PAYMENT_MARKS = ['Visa', 'Mastercard', 'Amex', 'Discover']

export function Footer() {
  return (
    <footer className="bg-primary-700 text-white">
      <Container className="py-10 md:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          <div className="max-w-[240px]">
            <Logo variant="light" />
            <p className="mt-4 text-body-sm leading-relaxed text-white/80">
              Premium everyday essentials — well-made staples, honestly
              presented.
            </p>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="font-display text-label font-semibold uppercase tracking-[0.08em] text-white">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {column.links.map(({ label, to }) => (
                  <li key={`${column.title}-${label}`}>
                    <Link
                      to={to}
                      className="text-body-sm text-white/80 transition-colors hover:text-white hover:underline hover:decoration-accent-500 hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm text-white/70">
            © 2026 Shoply. Fictional brand for portfolio demo.
          </p>
          <ul
            className="flex flex-wrap items-center gap-4"
            aria-label="Accepted payment methods"
          >
            {PAYMENT_MARKS.map((mark) => (
              <li
                key={mark}
                className="font-display text-micro font-semibold uppercase tracking-[0.06em] text-white/70"
              >
                {mark}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
