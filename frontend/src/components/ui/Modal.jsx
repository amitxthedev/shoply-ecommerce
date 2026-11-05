import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Button } from './Button'
import { Icon } from './Icon'

/*
 * Modal — UI spec §7.3: 0px corners, white, padding 32, overlay
 * rgba(10,10,10,0.5), shadow-modal token (one of the two allowed shadows),
 * Esc closes, focus moves into the panel and returns to the trigger on
 * close, Tab is trapped inside (A11Y-06). Title H3 + body + right-aligned
 * action row (secondary + primary). size: confirm = 480, wide = 720.
 */
const SIZES = {
  confirm: 'max-w-[480px]',
  wide: 'max-w-[720px]',
}

export function Modal({
  open,
  onClose,
  title,
  size = 'confirm',
  children,
  actions,
  className,
}) {
  const panelRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    // Remember the opener, move focus into the panel, lock body scroll
    triggerRef.current = document.activeElement
    const panel = panelRef.current
    const focusables = () =>
      panel?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ) ?? []
    focusables()[0]?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      // Trap Tab within the panel (A11Y-06)
      const items = [...focusables()]
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      triggerRef.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(10,10,10,0.5)] p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'max-h-[90vh] w-full overflow-y-auto rounded-none bg-white p-8 shadow-modal',
          SIZES[size],
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-h3 font-semibold text-ink">
            {title}
          </h3>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="-mr-2 -mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-none text-muted transition-colors hover:bg-surface-light hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
          >
            <Icon icon={X} size={20} />
          </button>
        </div>

        <div className="mt-4 text-body text-body-copy">{children}</div>

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          {actions ?? (
            <>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={onClose}>
                Confirm
              </Button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
