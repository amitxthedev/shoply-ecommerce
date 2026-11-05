import { Container } from '../ui/Container'
import { Logo } from '../common/Logo'

/*
 * AuthLayout — centered card layout for auth pages.
 * Cream background, white card, square corners.
 * Logo at top, form in card, links to other auth pages.
 */
export function AuthLayout({ children, title, subtitle }) {
  return (
    <section className="bg-[#fafaf0] min-h-[calc(100vh-100px)] flex items-center justify-center py-12 sm:py-16 md:py-24">
      <Container className="max-w-[480px] mx-auto px-4 sm:px-6">
        <div className="bg-white border border-line rounded-none shadow-toast p-6 lg:p-8">
          <div className="text-center mb-6">
            <Logo className="inline-flex" />
          </div>

          <h1 className="font-display text-h2 font-bold text-ink text-center mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-body text-body-copy text-center mb-6">
              {subtitle}
            </p>
          )}

          {children}
        </div>
      </Container>
    </section>
  )
}

