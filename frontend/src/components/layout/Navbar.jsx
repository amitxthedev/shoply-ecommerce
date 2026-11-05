import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useScrolled } from '../../hooks/useScrolled'
import { mainNav } from '../../data/navigation'
import { Icon } from '../ui/Icon'
import { Logo } from '../common/Logo'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import { CartDrawer } from '../cart/CartDrawer'

/*
 * Navbar — UI spec §11:
 *  · Desktop: white, sticky, 72px → 60px + hairline border past 80px scroll.
 *    Three zones: logo · centered nav (Home + categories + Support) · utilities.
 *    Active route: green text + 2px yellow underline. Square icon buttons.
 *  · Mobile: 60px row (logo · search · cart · hamburger) + left drawer with
 *    focus handling (Esc closes, focus returns to trigger).
 * Deferred to later phases: search submits to /search (page not built yet),
 * cart count is a prop (no state layer yet), full focus trap in the drawer.
 */

const UTILITY_BUTTON =
  'grid h-11 w-11 place-items-center rounded-none text-ink transition-colors hover:bg-surface-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700'

export function Navbar() {
  const scrolled = useScrolled(80)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const navigate = useNavigate()
  const drawerRef = useRef(null)
  const triggerRef = useRef(null)
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const { isAuthenticated, user, logout } = useAuth()

  const closeMenu = () => setMenuOpen(false)

  // Drawer: Esc closes, body scroll locks while open, focus enters the panel.
  useEffect(() => {
    if (!menuOpen) return undefined

    // Copy refs at effect time so cleanup never reads a possibly-stale .current
    const drawer = drawerRef.current
    const trigger = triggerRef.current
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    drawer?.focus()
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      trigger?.focus()
    }
  }, [menuOpen])

  const onSearchSubmit = (event) => {
    event.preventDefault()
    const q = query.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setSearchOpen(false)
    setMenuOpen(false)
  }

  const navLinkClass = ({ isActive }) =>
    cn(
      'relative py-2 text-label font-medium transition-colors',
      isActive ? 'text-primary-700' : 'text-ink hover:text-primary-700',
    )

  const renderNavLink = ({ label, to }) => (
    <NavLink key={to} to={to} className={navLinkClass} end={to === '/'}>
      {({ isActive }) => (
        <>
          {label}
          {isActive && (
            <span
              className="absolute -bottom-1 left-0 h-0.5 w-full bg-accent-500"
              aria-hidden="true"
            />
          )}
        </>
      )}
    </NavLink>
  )

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 h-[60px] bg-white transition-all duration-200 md:h-[72px]',
          scrolled && 'md:h-[60px] md:border-b md:border-line',
        )}
      >
        <div className="relative mx-auto flex h-full max-w-[1280px] items-center justify-between px-4 sm:px-6 md:grid md:grid-cols-[200px_1fr_200px] md:px-10">
          {/* Zone 1 — logo */}
          <Logo className="md:justify-self-start" />

          {/* Zone 2 — centered nav (desktop) */}
          <nav
            aria-label="Main"
            className="hidden items-center justify-center gap-6 md:flex"
          >
            {mainNav.map(renderNavLink)}
          </nav>

          {/* Zone 3 — utilities */}
          <div className="flex items-center justify-end md:justify-self-end">
            {/* Desktop expanding search (icon → 280px inline field) */}
            <form
              onSubmit={onSearchSubmit}
              className="hidden items-center md:flex"
              role="search"
            >
              {searchOpen ? (
                <div className="flex items-center bg-white">
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search products"
                    aria-label="Search products"
                    autoFocus
                    className="h-11 w-[280px] border border-line-strong bg-white px-3 text-body text-ink outline-none placeholder:text-muted focus:border-primary-700"
                  />
                  <button
                    type="submit"
                    aria-label="Submit search"
                    className="grid h-11 w-11 place-items-center rounded-none bg-primary-700 text-white transition-colors hover:bg-primary-800"
                  >
                    <Icon icon={Search} />
                  </button>
                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={() => setSearchOpen(false)}
                    className={cn(UTILITY_BUTTON, 'border border-l-0 border-line-strong')}
                  >
                    <Icon icon={X} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  aria-label="Search"
                  onClick={() => setSearchOpen(true)}
                  className={UTILITY_BUTTON}
                >
                  <Icon icon={Search} />
                </button>
              )}
            </form>

            {/* Account */}
            {isAuthenticated ? (
              <div className="relative group">
                <button
                  type="button"
                  aria-label="Account"
                  className={UTILITY_BUTTON}
                >
                  <Icon icon={User} />
                </button>
                <div className="absolute right-0 top-full hidden group-hover:block bg-white border border-line shadow-toast min-w-[160px] z-50">
                  <div className="px-4 py-3 border-b border-line">
                    <p className="text-body-sm font-medium text-ink">{user?.name}</p>
                    <p className="text-body-sm text-muted truncate">{user?.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-body-sm text-ink hover:bg-surface-light transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" aria-label="Account" className={UTILITY_BUTTON}>
                <Icon icon={User} />
              </Link>
            )}

            {/* Wishlist — square heart icon with count badge */}
            <Link
              to="/wishlist"
              aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ''}`}
              className={cn(UTILITY_BUTTON, 'relative')}
            >
              <Icon icon={Heart} />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 min-w-[16px] bg-primary-700 px-1 text-center text-[11px] font-medium leading-4 text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart — square count badge, no layout shift */}
            <button
              type="button"
              aria-label={`Cart${cartCount ? `, ${cartCount} items` : ''}`}
              onClick={() => setCartOpen(true)}
              className={cn(UTILITY_BUTTON, 'relative')}
            >
              <Icon icon={ShoppingBag} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 min-w-[16px] bg-primary-700 px-1 text-center text-[11px] font-medium leading-4 text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile-only menu trigger */}
            <button
              type="button"
              ref={triggerRef}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className={cn(UTILITY_BUTTON, 'md:hidden')}
            >
              <Icon icon={Menu} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — full-height white panel from left, 0px radius (§11.4) */}
      <div
        className={cn(
          'fixed inset-0 z-50 md:hidden',
          menuOpen ? '' : 'pointer-events-none',
        )}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div
          className={cn(
            'absolute inset-0 bg-ink/50 transition-opacity duration-250',
            menuOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={closeMenu}
        />
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          tabIndex={-1}
          className={cn(
            'absolute inset-y-0 left-0 flex w-[300px] max-w-[85vw] flex-col bg-white transition-transform duration-250 focus:outline-none',
            menuOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-line px-4">
            <Logo />
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMenu}
              className={UTILITY_BUTTON}
            >
              <Icon icon={X} />
            </button>
          </div>

          <form onSubmit={onSearchSubmit} className="flex border-b border-line p-4" role="search">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="h-11 min-w-0 flex-1 border border-line-strong px-3 text-body outline-none placeholder:text-muted focus:border-primary-700"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-none bg-primary-700 text-white transition-colors hover:bg-primary-800"
            >
              <Icon icon={Search} />
            </button>
          </form>

          <nav aria-label="Menu" className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-1">
              {mainNav.map(({ label, to }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      cn(
                        'block py-2 font-display text-h4 font-semibold transition-colors',
                        isActive ? 'text-primary-700' : 'text-ink hover:text-primary-700',
                      )
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <hr className="my-4 border-line" />

            <ul className="space-y-1">
              {isAuthenticated ? (
                <>
                  <li>
                    <span className="block py-2 text-label font-medium text-ink">
                      {user?.name} ({user?.email})
                    </span>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => { logout(); closeMenu() }}
                      className="block py-2 text-label font-medium text-ink hover:text-primary-700"
                    >
                      Sign out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="block py-2 text-label font-medium text-ink hover:text-primary-700"
                  >
                    Account / Sign in
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-line px-4 py-4">
            <Link
              to="/shipping-policy"
              onClick={closeMenu}
              className="text-body-sm text-muted hover:text-primary-700"
            >
              Shipping &amp; returns policy
            </Link>
          </div>
        </div>
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

    </>
  )
}
