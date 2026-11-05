import { useState } from 'react'
import { cn } from '../../utils/cn'

/*
 * ProductGallery — PDP image gallery (UI spec §14.4).
 * Main image 4:5 on desktop, full-width on mobile.
 * Thumbnail column (desktop) or row (mobile) beneath.
 * Active thumbnail highlighted with primary-700 border.
 * Image counter chip "1/5" on desktop.
 */
export function ProductGallery({ images = [], alt }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex] || images[0]

  if (images.length === 0) {
    return (
      <div className="aspect-[4/5] overflow-hidden bg-surface-light flex items-center justify-center">
        <span className="text-muted text-body-sm">No image</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-light">
        <img
          src={activeImage}
          alt={alt}
          className="h-full w-full object-cover object-center"
          loading="eager"
        />
        {images.length > 1 && (
          <span className="absolute top-4 right-4 bg-white/80 text-ink px-2.5 py-1 text-micro font-medium rounded-none">
            {activeIndex + 1}/{images.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]">
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'shrink-0 w-[72px] h-[72px] overflow-hidden bg-surface-light border-2 transition-colors duration-150',
                index === activeIndex
                  ? 'border-primary-700'
                  : 'border-transparent hover:border-line-strong',
              )}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={img}
                alt={`${alt} — view ${index + 1}`}
                className="h-full w-full object-cover object-center"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
