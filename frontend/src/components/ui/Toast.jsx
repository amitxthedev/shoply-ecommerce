import { useEffect } from 'react'
import { AlertCircle, Check, Info, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Icon } from './Icon'

/*
 * Toast — UI spec §7.4: 0px, white, shadow-toast (allowed), icon + message,
 * auto-dismiss 4 s when onClose is provided, role="status" (aria-live
 * polite, A11Y-12). Variants: success (green) · error (red) · info (gray).
 * Placement (bottom-right desktop / top-center mobile) belongs to the
 * future toast stack — pass className to position it at usage sites.
 */

const VARIANTS = {
  success: { icon: Check, className: 'text-primary-700' },
  error: { icon: AlertCircle, className: 'text-error-700' },
  info: { icon: Info, className: 'text-muted' },
}

export function Toast({
  variant = 'success',
  message,
  onClose,
  duration = 4000,
  className,
}) {
  const { icon, className: iconClassName } = VARIANTS[variant]

  useEffect(() => {
    if (!onClose) return undefined
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex min-w-[280px] max-w-[360px] items-start gap-3 rounded-none bg-white p-4 shadow-toast',
        className,
      )}
    >
      <Icon icon={icon} size={20} className={cn('mt-0.5 shrink-0', iconClassName)} />
      <p className="flex-1 text-body-sm leading-relaxed text-ink">{message}</p>
      {onClose && (
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={onClose}
          className="-mr-1 -mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-none text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
        >
          <Icon icon={X} size={16} />
        </button>
      )}
    </div>
  )
}
