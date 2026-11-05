import { Check } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Icon } from './Icon'

/*
 * Checkbox — UI spec §9.2: 20×20 square box, 0px, primary-700 when checked,
 * 44px minimum hit area (label wraps the control). Optional description
 * line; error tint for invalid groups. The native input stays in the DOM
 * (sr-only) so focus, keyboard and form semantics keep working; visuals are
 * driven by peer/group-has-checked variants.
 */
export function Checkbox({
  label,
  description,
  error,
  disabled = false,
  className,
  ...props
}) {
  return (
    <label
      className={cn(
        'group flex min-h-11 cursor-pointer items-start gap-3 py-1.5',
        disabled && 'cursor-not-allowed opacity-40',
        className,
      )}
    >
      <input
        type="checkbox"
        disabled={disabled}
        className="peer sr-only"
        {...props}
      />
      <span
        className={cn(
          'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-none border transition-colors peer-checked:border-primary-700 peer-checked:bg-primary-700 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-700',
          error ? 'border-error-700' : 'border-line-strong bg-white',
        )}
        aria-hidden="true"
      >
        <Icon
          icon={Check}
          size={14}
          className="text-white opacity-0 group-has-[:checked]:opacity-100"
        />
      </span>
      <span className="block">
        <span className="block text-label font-medium text-ink">{label}</span>
        {description && (
          <span className="mt-0.5 block text-body-sm text-muted">
            {description}
          </span>
        )}
        {error && (
          <span className="mt-0.5 block text-body-sm text-error-700">
            {error}
          </span>
        )}
      </span>
    </label>
  )
}
