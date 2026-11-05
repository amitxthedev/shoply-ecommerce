import { cn } from '../../utils/cn'

/*
 * ProductVariantSelector — PDP size and color selection (UI spec §14.4).
 * Size tiles (44 min, square), color swatches (32px circles).
 * Selected state: primary-700 border + fill.
 * Out of stock: disabled with line-through.
 */
export function ProductVariantSelector({ colors = [], sizes = [], selectedColor, selectedSize, onSelectColor, onSelectSize }) {
  return (
    <div className="space-y-6">
      {/* Color selection */}
      {colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-label font-medium text-ink">
              Color: <span className="font-normal text-muted">{selectedColor || 'Select'}</span>
            </p>
          </div>
          <div className="flex gap-3">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onSelectColor(color)}
                className={cn(
                  'h-8 w-8 rounded-none border-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700',
                  selectedColor === color
                    ? 'border-primary-700 bg-primary-700'
                    : 'border-line-strong bg-surface-light hover:border-primary-700',
                )}
                aria-label={color}
                aria-pressed={selectedColor === color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size selection */}
      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-label font-medium text-ink">
              Size: <span className="font-normal text-muted">{selectedSize || 'Select'}</span>
            </p>
            <button
              type="button"
              className="text-body-sm text-primary-700 underline decoration-2 underline-offset-4 hover:text-primary-800"
            >
              Size guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onSelectSize(size)}
                className={cn(
                  'h-11 min-w-[44px] px-3 rounded-none border transition-colors duration-150 text-body-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700',
                  selectedSize === size
                    ? 'border-primary-700 bg-primary-700 text-white'
                    : 'border-line-strong bg-white text-ink hover:border-primary-700',
                )}
                aria-pressed={selectedSize === size}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
