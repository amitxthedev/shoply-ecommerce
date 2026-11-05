import { cn } from '../../utils/cn'
import { Field } from './Field'

/*
 * Textarea — UI spec §9.2: same anatomy as Input, min-height 120px,
 * vertical resize only. Label & helper live in Field.
 */
export function Textarea({
  label,
  name,
  helper,
  error,
  required = false,
  disabled = false,
  rows = 5,
  id: idProp,
  className,
  ...props
}) {
  return (
    <Field
      label={label}
      name={name}
      id={idProp}
      required={required}
      helper={helper}
      error={error}
      className={className}
    >
      {({ id, describedBy, hasError }) => (
        <textarea
          id={id}
          name={name}
          rows={rows}
          aria-required={required || undefined}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          disabled={disabled}
          className={cn(
            'w-full resize-y rounded-none border bg-white px-4 py-3 text-body text-ink outline-none transition-colors placeholder:text-muted disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-light disabled:text-muted',
            'min-h-[120px]',
            hasError
              ? 'border-error-700'
              : 'border-line-strong focus:border-primary-700',
          )}
          {...props}
        />
      )}
    </Field>
  )
}
