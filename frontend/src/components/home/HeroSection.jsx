import { ArrowRight, Store } from 'lucide-react'
import { Container } from '../ui/Container'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'

/*
 * HeroSection — Banner-style hero with background image.
 * Single banner with background image, headline, and CTA.
 * Square corners everywhere, no border radius, minimal shadows.
 * Cream background, deep forest green accents.
 */

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#fafaf0] py-4 sm:py-6 md:py-8 lg:py-10 px-4 sm:px-6 md:px-8">
      <div
        className="relative overflow-hidden bg-[#fafaf0] rounded-none"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&h=600&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <Container className="relative z-10 py-8 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6 md:px-8">
          <div className="max-w-[640px]">
            <Badge tone="white" size="m" icon={Store} className="mb-4 inline-block">
              Shoply · Est. 2026
            </Badge>

            <h1 className="font-display text-h1 font-bold leading-tight text-white lg:text-[48px] mb-4">
              Considered essentials,{' '}
              <span className="text-accent-500">made to last.</span>
            </h1>

            <p className="mt-0 max-w-[44ch] text-body-lg text-white/90 mb-6 lg:mb-8">
              Traceable wool, organic cotton, and full-grain leather — well-made
              staples for a considered wardrobe, priced without games.
            </p>

            <Button size="l" to="/products" className="group bg-primary-700 text-white">
              Shop the collection
              <Icon icon={ArrowRight} size={16} className="ml-2 transition-transform duration-150 group-hover:translate-x-1" />
            </Button>
          </div>
        </Container>
      </div>
    </section>
  )
}
