import { HeroSection } from '../components/home/HeroSection'
import { CategorySection } from '../components/home/CategorySection'
import { FeaturedProducts } from '../components/home/FeaturedProducts'
import { PromoBanner } from '../components/home/PromoBanner'
import { TrendingProducts } from '../components/home/TrendingProducts'
import { NewsletterSection } from '../components/home/NewsletterSection'

/**
 * Home (FR-CUS-01) — module order per UI spec §14.2 + the task's nine
 * homepage sections. Announcement bar, navbar and footer come from
 * MainLayout; each section above is its own component (§14.2 order:
 * hero → categories → products → promo → trending → newsletter).
 * Band rhythm: light → white → white → green → light → white (§14.1).
 */
export function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <PromoBanner />
      <TrendingProducts />
      <NewsletterSection />
    </>
  )
}
