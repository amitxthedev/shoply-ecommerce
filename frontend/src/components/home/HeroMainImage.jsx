/*
 * HeroMainImage — main fashion photograph for the hero right side.
 * Large central image, square corners, aspect-[4/5], real fashion photography.
 */
export function HeroMainImage({ image, alt }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-white lg:aspect-square shadow-modal">
      <img
        src={image}
        alt={alt}
        className="h-full w-full object-cover object-center"
        loading="eager"
      />
    </div>
  )
}
