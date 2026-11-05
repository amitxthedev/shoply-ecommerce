import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

/**
 * Logo lockup — UI spec §1.1: green circle monogram "S" + wordmark
 * "Shoply" with the green period (mirrors the reference construction).
 * `light` = inverse lockup for use on the green footer.
 */
export function Logo({ variant = 'dark', className, to = '/' }) {
  const light = variant === 'light'

  return (
    <Link
      to={to}
      aria-label="Shoply — home"
      className={cn('inline-flex items-center gap-3', className)}
    >
      <span
        className={cn(
          'grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-lg font-bold',
          light ? 'bg-white text-primary-700' : 'bg-primary-700 text-white',
        )}
        aria-hidden="true"
      >
        S
      </span>
      <span
        className={cn(
          'font-display text-xl font-bold tracking-[-0.01em]',
          light ? 'text-white' : 'text-ink',
        )}
      >
        Shoply<span className={light ? 'text-white' : 'text-primary-700'}>.</span>
      </span>
    </Link>
  )
}
