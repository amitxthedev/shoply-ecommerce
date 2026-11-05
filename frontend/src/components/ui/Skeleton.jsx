import { cn } from '../../utils/cn'

/*
 * Skeleton — UI spec §7.5: #EDEDED blocks matching the final layout,
 * shimmer 1.4 s (opacity-based, token --animate-shimmer — no gradient, so
 * rule 14 stays intact). Variants: text (line), block (rect), image (1:1
 * plate). Pair with the reserved aspect ratios of PERF-11.
 */
const VARIANTS = {
  text: 'h-4 w-full',
  block: 'h-24 w-full',
  image: 'aspect-square w-full',
}

export function Skeleton({ variant = 'text', className, ...props }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-shimmer rounded-none bg-skeleton',
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  )
}
