import { cn } from '../../utils/cn'

/**
 * Icon wrapper — one icon set (Lucide) with the spec-wide stroke weight of
 * 1.75px on a 20/24 grid, currentColor, decorative by default (UI spec §7.1.10).
 */
export function Icon({
  icon: IconComponent,
  size = 20,
  className,
  decorative = true,
  ...props
}) {
  return (
    <IconComponent
      size={size}
      strokeWidth={1.75}
      aria-hidden={decorative ? 'true' : undefined}
      className={cn('shrink-0', className)}
      {...props}
    />
  )
}
