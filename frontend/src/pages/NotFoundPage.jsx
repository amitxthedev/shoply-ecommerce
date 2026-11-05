import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'

/**
 * Catch-all route — pages from the USER_FLOWS §9 inventory resolve here until
 * they are built (no dead links, no white screens).
 */
export function NotFoundPage() {
  return (
    <section className="py-16 md:py-24">
      <Container className="text-center">
        <p className="font-display text-eyebrow font-semibold uppercase text-muted">
          Error 404
        </p>
        <h1 className="mt-4 text-h3 font-semibold text-ink">Page not found</h1>
        <p className="mx-auto mt-3 max-w-[65ch] text-body text-body-copy">
          The page you are looking for doesn&apos;t exist yet or has moved.
        </p>
        <div className="mt-8 flex justify-center">
          <Button variant="secondary" size="l" to="/">
            Continue shopping
          </Button>
        </div>
      </Container>
    </section>
  )
}
