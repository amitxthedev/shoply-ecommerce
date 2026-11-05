import { cn } from '../../utils/cn'
import { Icon } from './Icon'

/*
 * Badge — UI spec §7.2. Square (0px), Micro/Badge type = Inter 500 / 12 /
 * 0.02em, no shadow. Tones map to the §4.3 status table — color is always
 * paired with a text label (A11Y-05). Sizes follow the padding spec:
 * s = 6×10 (discount, status) · m = 8×12 (count chip).
 */

const TONES = {
  /* Discount badge, active accents — white on primary-700 */
  primary: 'bg-primary-700 text-white',
  /* Low stock / warning — ink on accent-500 (§4.3) */
  accent: 'bg-accent-500 text-ink',
  /* In stock / success — primary-700 on primary-100 tint (§4.3) */
  success: 'bg-primary-100 text-primary-700',
  /* Error / failed — error-700 on error-100 (§4.3) */
  error: 'bg-error-100 text-error-700',
  /* Sold out / disabled — muted on surface-light (§4.3) */
  neutral: 'bg-surface-light text-muted',
  /* Count chip — white fill, hairline only where it sits on white (§7.2) */
  white: 'border border-line bg-white text-body-copy',
}

const SIZES = {
  s: 'px-2.5 py-1.5',
  m: 'px-3 py-2',
}

const BASE =
  'inline-flex items-center gap-1.5 rounded-none font-sans text-micro font-medium leading-none'

export function Badge({
  tone = 'primary',
  size = 's',
  icon,
  uppercase = false,
  className,
  children,
  ...props
}) {
  return (
    <span
      className={cn(BASE, TONES[tone], SIZES[size], uppercase && 'uppercase', className)}
      {...props}
    >
      {icon && <Icon icon={icon} size={12} />}
      {children}
    </span>
  )
}
