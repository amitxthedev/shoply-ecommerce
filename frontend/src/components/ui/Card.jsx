import { cn } from '../../utils/cn'

/*
 * Card — UI spec §7.1: 0px corners, NO border, NO shadow. Separation comes
 * from surface color only: a white card sits on a surface-light band, a
 * muted (surface-light) plate sits on white. Optional title/description/
 * action row cover the common content-card layout without forcing it.
 */
export function Card({
  variant = 'white',
  padded = true,
  title,
  description,
  actions,
  footer,
  as: Tag = 'div',
  className,
  children,
  ...props
}) {
  return (
    <Tag
      className={cn(
        'rounded-none',
        variant === 'muted' ? 'bg-surface-light' : 'bg-white',
        padded && 'p-6 md:p-8',
        className,
      )}
      {...props}
    >
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {title && (
              <h3 className="font-display text-h4 font-semibold text-ink">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1.5 text-body-sm text-muted">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children && (
        <div className={cn((title || actions) && 'mt-5')}>{children}</div>
      )}
      {footer && (
        <div className="mt-6 border-t border-line pt-5">{footer}</div>
      )}
    </Tag>
  )
}
