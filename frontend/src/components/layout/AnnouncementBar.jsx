import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'
import { Phone } from 'lucide-react'

/*
 * AnnouncementBar — UI spec §11.1: 40px green bar (36 mobile), white text.
 * Desktop (≥1024): phone left · promo centered (accent link passes AA on green).
 * Tablet/mobile: centered message only. Social icons excluded (DS-DEC-05).
 */
export function AnnouncementBar() {
  return (
    <div className="bg-primary-700 text-white">
      <div className="mx-auto grid h-9 max-w-[1280px] grid-cols-1 items-center px-4 sm:h-10 sm:px-6 md:grid-cols-3 md:px-10">
        <a
          href="tel:+15550123456"
          className="hidden items-center gap-2 text-body-sm text-white/90 transition-colors hover:text-white md:inline-flex"
        >
          <Icon icon={Phone} size={14} />
          Call us: +1 (555) 012-3456
        </a>

        <p className="truncate text-center text-body-sm md:justify-self-center">
          <Link
            to="/shipping-policy"
            className="text-accent-500 underline underline-offset-2 transition-colors hover:text-white"
          >
            Free shipping on orders over $180
          </Link>
        </p>

        {/* Right zone intentionally empty in V1 (social icons excluded — DS-DEC-05) */}
        <span className="hidden md:block" aria-hidden="true" />
      </div>
    </div>
  )
}
