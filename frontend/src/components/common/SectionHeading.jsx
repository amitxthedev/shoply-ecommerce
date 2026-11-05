import { cn } from '../../utils/cn'

/**
 * SectionHeading — UI spec §5.3: eyebrow (yellow 24×2 dash + uppercase label)
 * precedes every section heading; two-tone title = ink phrase + one green
 * accent phrase (max one accent phrase per heading).
 */
export function SectionHeading({
  eyebrow,
  title,
  accent,
  align = 'left',
  as: Heading = 'h2',
  className,
}) {
  const centered = align === 'center'
  // Page titles (h1) use the Display/H1 scale, sections use Heading/H2 (§5.2)
  const headingSize =
    Heading === 'h1' ? 'text-h1' : Heading === 'h3' ? 'text-h3' : 'text-h2'

  return (
    <div className={cn(centered && 'text-center', className)}>
      {eyebrow && (
        <div className={cn('flex items-center gap-3', centered && 'justify-center')}>
          <span className="h-0.5 w-6 bg-accent-500" aria-hidden="true" />
          <span className="font-display text-eyebrow font-semibold uppercase text-muted">
            {eyebrow}
          </span>
        </div>
      )}
      <Heading className={cn('mt-4 font-bold text-ink', headingSize)}>
        {title}
        {accent && <span className="text-primary-700"> {accent}</span>}
      </Heading>
    </div>
  )
}
