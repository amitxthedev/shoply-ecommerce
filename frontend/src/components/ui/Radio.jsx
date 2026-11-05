import { cn } from '../../utils/cn'

/*
 * Radio — UI spec §9.2: 20×20 SQUARE (0px per the radius system), 44px hit
 * area, primary-700 when checked with a white inner marker. Use inside a
 * <fieldset> with a <legend> for group labeling (A11Y-03). Same native-input
 * pattern as Checkbox.
 */
export function Radio({
  label,
  description,
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
        type="radio"
        disabled={disabled}
        className="peer sr-only"
        {...props}
      />
      <span
        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-none border border-line-strong bg-white transition-colors peer-checked:border-primary-700 peer-checked:bg-primary-700 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-700"
        aria-hidden="true"
      >
        <span className="h-2 w-2 bg-white opacity-0 group-has-[:checked]:opacity-100" />
      </span>
      <span className="block">
        <span className="block text-label font-medium text-ink">{label}</span>
        {description && (
          <span className="mt-0.5 block text-body-sm text-muted">
            {description}
          </span>
        )}
      </span>
    </label>
  )
}
