import { NavLink } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { useAuth } from '../context/AuthContext'

/*
 * AccountLayout — shared account layout (UI spec §14.8).
 * Grid `240 | 1fr` gap 40 (desktop). Left rail: nav items 0px rows,
 * active = primary-100 fill + green text; logout ghost at bottom.
 * Mobile/tablet: horizontal scroll tabs.
 */
const NAV_ITEMS = [
  { label: 'Overview', to: '/account' },
  { label: 'Orders', to: '/account/orders' },
  { label: 'Addresses', to: '/account/addresses' },
  { label: 'Profile', to: '/account/profile' },
]

export function AccountLayout({ children }) {
  const { logout } = useAuth()

  return (
    <section className="bg-white">
      <Container className="py-12 sm:py-[72px] md:py-24">
        {/* Mobile: horizontal tabs */}
        <nav
          aria-label="Account navigation"
          className="flex gap-2 overflow-x-auto pb-4 mb-6 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/account'}
              className={({ isActive: active }) =>
                `shrink-0 h-11 px-4 font-display text-[15px] font-semibold rounded-none transition-colors duration-150 ${
                  active
                    ? 'bg-primary-700 text-white'
                    : 'border border-line bg-white text-ink hover:bg-surface-light'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop: grid with left rail */}
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
          {/* Left rail (hidden on mobile) */}
          <aside className="hidden lg:block">
            <nav aria-label="Account navigation">
              <ul className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/account'}
                      className={({ isActive: active }) =>
                        `block py-3 px-4 font-display text-[15px] font-semibold rounded-none transition-colors duration-150 ${
                          active
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-ink hover:bg-surface-light hover:text-primary-700'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-8 pt-4 border-t border-line">
              <button
                type="button"
                onClick={logout}
                className="block w-full text-left py-3 px-4 font-display text-[15px] font-semibold text-ink hover:bg-surface-light hover:text-error-700 transition-colors rounded-none"
              >
                Sign out
              </button>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </Container>
    </section>
  )
}






