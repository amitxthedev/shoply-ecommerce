import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Icon } from '../ui/Icon'
import { SectionHeading } from '../common/SectionHeading'

/*
 * NewsletterSection — white band, centered (task-required section; the
 * approved spec defers newsletter capture to V2 / DS-DEC-04, so this is
 * the plain version: no discount promise, no backend — submit shows an
 * inline confirmation only). Top-label field per §9.1, full-width primary
 * CTA on mobile (§16.2.5 pattern). Confirmation fades in (Animate.css,
 * 150 ms) and announces via role="status" (A11Y-12).
 */
export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = (event) => {
    event.preventDefault()
    if (!email.trim()) return
    setSent(true)
  }

  return (
    <section className="bg-white">
      <Container className="py-12 sm:py-[72px] md:py-24">
        <div className="mx-auto max-w-[640px] text-center">
          <SectionHeading
            align="center"
            eyebrow="Newsletter"
            title="One email a week,"
            accent="no noise."
          />

          <p className="mx-auto mt-4 max-w-[52ch] text-body text-body-copy">
            New arrivals, restocks and the occasional field note from the
            workshop. Unsubscribe anytime — we never share your address.
          </p>

          {sent ? (
            <p
              role="status"
              className="animate__animated animate__fadeIn mx-auto mt-8 max-w-[480px] bg-primary-100 p-4 text-body text-primary-700"
              style={{ '--animate-duration': '150ms' }}
            >
              Thanks — check your inbox to confirm your subscription.
            </p>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mx-auto mt-8 flex max-w-[520px] flex-col items-stretch gap-3 text-left sm:flex-row sm:items-end"
            >
              <Input
                label="Email address"
                name="newsletter-email"
                type="email"
                required
                placeholder="you@example.com"
                helper="One email a week. Unsubscribe anytime."
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="sm:flex-1"
              />
              {/* Bottom button aligns with the input: helper line (~20px) + its top gap (6px) */}
              <Button
                type="submit"
                size="l"
                className="w-full shrink-0 sm:mb-[26px] sm:w-auto"
              >
                Subscribe
                <Icon icon={ArrowRight} size={18} />
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  )
}
