import { Container } from '../ui/Container'
import { SectionHeading } from '../common/SectionHeading'
import { CategoryCard } from '../common/CategoryCard'
import { categories } from '../../data/categories'

/*
 * CategorySection — UI spec §14.2 module 4 "Shop by category" (white band):
 * eyebrow + two-tone H2, then the tile grid — 2-up mobile (5th tile spans
 * both columns), 5-up desktop, gap 24 (§16.2.4: 2-up on mobile). Tiles
 * reuse the shared CategoryCard: 4:3 plate + count chip + title + arrow.
 * Subcategory lists stay out per C6 / DS-DEC-09.
 */
export function CategorySection() {
  return (
    <section className="bg-white">
      <Container className="py-12 sm:py-[72px] md:py-24">
        <SectionHeading
          eyebrow="Shop by category"
          title="Start with the"
          accent="essentials."
        />

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-5">
          {categories.map((category, index) => (
            <div
              key={category.slug}
              className={
                index === categories.length - 1 ? 'col-span-2 lg:col-span-1' : ''
              }
            >
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
