import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { Icon } from './Icon'

/*
 * Button — UI spec §8: Poppins 600, square corners (task rule: no radius on
 * buttons), 150ms transitions, mandatory focus ring, sizes L/M/S/full.
 * One primary per view section (§8.4) — enforced at usage sites.
 * States per §7.1: default · hover · active · focus · disabled · loading.
 */

const VARIANTS = {
  primary:
    'bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-900',
  secondary:
    'bg-white text-ink border border-line-strong hover:bg-surface-light active:bg-line',
  ghost:
    'text-primary-700 hover:bg-primary-100 active:bg-primary-100',
  danger: 'bg-error-700 text-white hover:bg-[#941b13] active:bg-[#7d170f]',
}

const SIZES = {
  s: 'h-9 px-4 text-sm',
  m: 'h-11 px-[22px]',
  l: 'h-[52px] px-7',
  full: 'h-[52px] w-full justify-center',
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-none font-display text-[15px] font-semibold leading-none transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40'

export function Button({
  variant = 'primary',
  size = 'm',
  to,
  type = 'button',
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}) {
  const classes = cn(
    BASE,
    VARIANTS[variant],
    SIZES[size],
    loading && 'cursor-wait opacity-70',
    className,
  )

  if (to) {
    return (
      <Link
        to={to}
        className={cn(classes, loading && 'pointer-events-none')}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Icon icon={Loader2} size={16} className="animate-spin" />}
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Icon icon={Loader2} size={16} className="animate-spin" />}
      {children}
    </button>
  )
}
