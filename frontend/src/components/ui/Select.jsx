import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Field } from './Field'
import { Icon } from './Icon'

/*
 * Select — UI spec §9.2: native-styled, 48h, 0px, custom chevron (no
 * browser chrome). Options accept [{ value, label }] or children for
 * optgroups. Label & helper live in Field.
 */
export function Select({
  label,
  name,
  options = [],
  placeholder,
  helper,
  error,
  required = false,
  disabled = false,
  id: idProp,
  className,
  children,
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
        <div className="relative">
          <select
            id={id}
            name={name}
            aria-required={required || undefined}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            disabled={disabled}
            className={cn(
              'h-12 w-full appearance-none rounded-none border bg-white px-4 pr-11 text-body text-ink outline-none transition-colors disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-light disabled:text-muted',
              hasError
                ? 'border-error-700'
                : 'border-line-strong focus:border-primary-700',
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children ??
              options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
          <span
            className="pointer-events-none absolute inset-y-0 right-0 grid w-11 place-items-center text-muted"
            aria-hidden="true"
          >
            <Icon icon={ChevronDown} size={18} />
          </span>
        </div>
      )}
    </Field>
  )
}
