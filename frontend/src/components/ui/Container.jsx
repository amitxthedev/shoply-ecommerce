import { cn } from '../../utils/cn'

/**
 * Page container — max 1280px, responsive gutters per UI spec §6.3:
 * mobile 16 · tablet (≥768) 24 · desktop (≥1024) 40. Caps at 1280 and
 * centers on wide screens (design never stretches — rule 15).
 */
export function Container({ as: Tag = 'div', className, children, ...props }) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full max-w-[1280px] px-4 sm:px-6 md:px-10',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
