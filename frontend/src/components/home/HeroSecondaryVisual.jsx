/*
 * HeroSecondaryVisual — partially visible secondary fashion image behind
 * the main composition. Peeks out from the top-left of the main image.
 */
export function HeroSecondaryVisual({ image, alt }) {
  return (
    <div className="absolute -top-12 -left-6 w-[280px] h-[360px] overflow-hidden bg-surface-light lg:w-[320px] lg:h-[420px] z-0">
      <img
        src={image}
        alt={alt}
        className="h-full w-full object-cover object-center opacity-90"
        loading="lazy"
      />
    </div>
  )
}
