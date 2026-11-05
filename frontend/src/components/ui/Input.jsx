import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Field } from './Field'
import { Icon } from './Icon'

/*
 * Input — UI spec §9: 48h · 0px · 1px line-strong · white · 16px pad.
 * Focus = green border + 2px offset outline (global :focus-visible);
 * error = red border + inline message via aria-describedby; disabled =
 * surface-light fill. Password type gets the square show/hide toggle (§9.2),
 * icon slots cover search / prefix usages. Label & helper live in Field.
 */

const FIELD_BASE =
  'w-full rounded-none border bg-white text-body text-ink outline-none transition-colors placeholder:text-muted disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-light disabled:text-muted'

export function Input({
  label,
  name,
  type = 'text',
  helper,
  error,
  required = false,
  disabled = false,
  leftIcon,
  rightIcon,
  id: idProp,
  className,
  ...props
}) {
  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && revealed ? 'text' : type
  const hasTrailing = Boolean(rightIcon) || isPassword

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
          {leftIcon && (
            <span
              className="pointer-events-none absolute inset-y-0 left-0 grid w-11 place-items-center text-muted"
              aria-hidden="true"
            >
              <Icon icon={leftIcon} size={18} />
            </span>
          )}

          <input
            id={id}
            name={name}
            type={inputType}
            aria-required={required || undefined}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            disabled={disabled}
            className={cn(
              FIELD_BASE,
              'h-12 px-4',
              leftIcon && 'pl-11',
              hasTrailing && 'pr-12',
              hasError
                ? 'border-error-700'
                : 'border-line-strong focus:border-primary-700',
            )}
            {...props}
          />

          {hasTrailing && (
            <span className="absolute inset-y-0 right-0 grid w-12 place-items-center">
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setRevealed((value) => !value)}
                  aria-label={revealed ? 'Hide password' : 'Show password'}
                  className="grid h-9 w-9 place-items-center rounded-none text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                >
                  <Icon icon={revealed ? EyeOff : Eye} size={18} />
                </button>
              ) : (
                <span
                  className="pointer-events-none text-muted"
                  aria-hidden="true"
                >
                  <Icon icon={rightIcon} size={18} />
                </span>
              )}
            </span>
          )}
        </div>
      )}
    </Field>
  )
}
