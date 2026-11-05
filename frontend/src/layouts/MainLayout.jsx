import { Outlet } from 'react-router-dom'
import { AnnouncementBar } from '../components/layout/AnnouncementBar'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

/**
 * MainLayout — storefront shell: announcement bar · sticky header · main
 * (route outlet) · footer. Carries the skip-to-content link (A11Y-08).
 * The admin console uses a different layout later (no storefront footer — FR-ADM-01).
 */
export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:font-semibold focus:text-primary-700"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Navbar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
