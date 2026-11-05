import { X } from 'lucide-react'
import { Icon } from '../ui/Icon'

/*
 * FilterChip — removable active filter chip shown in the toolbar row
 * (UI spec §14.3: left side, scrollable row on mobile).
 */
export function FilterChip({ label, onRemove }) {
  return (
    <span className="flex items-center gap-2 rounded-none border border-line-strong bg-white px-3 py-1.5 text-body-sm text-ink">
      {label}
      <button
        type="button"
        aria-label={`Remove ${label} filter`}
        onClick={onRemove}
        className="grid h-5 w-5 place-items-center rounded-none text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
      >
        <Icon icon={X} size={12} />
      </button>
    </span>
  )
}
