import { useId } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Icon } from './Icon'

/*
 * Field — shared shell for labeled form controls (UI spec §9.1 anatomy):
 *
 *   Label (Inter 500 / 14 / ink, required * in error-700)
 *   [ control slot ]
 *   Helper / error text (Inter 400 / 13)
 *
 * Input, Textarea and Select render through it so label, required marker,
 * aria wiring (aria-required / aria-invalid / aria-describedby) and helper
 * markup exist exactly once. The control receives its props via the render
 * function: children({ id, describedBy, hasError }).
 */
export function Field({
  label,
  name,
  id: idProp,
  required = false,
  helper,
  error,
  className,
  children,
}) {
  const generatedId = useId()
  const id = name ?? idProp ?? generatedId
  const hasHelper = Boolean(helper || error)
  const helperId = `${id}-helper`

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-label font-medium text-ink">
          {label}
          {required && (
            <span className="ml-1 text-error-700" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {children({
        id,
        describedBy: hasHelper ? helperId : undefined,
        hasError: Boolean(error),
      })}

      {hasHelper && (
        <p
          id={helperId}
          className={cn(
            'mt-1.5 text-body-sm',
            error ? 'flex items-center gap-1 text-error-700' : 'text-muted',
          )}
        >
          {error && <Icon icon={AlertCircle} size={14} className="shrink-0" />}
          {error || helper}
        </p>
      )}
    </div>
  )
}
