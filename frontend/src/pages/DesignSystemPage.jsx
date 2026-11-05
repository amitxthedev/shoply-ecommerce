import { useState } from 'react'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Select } from '../components/ui/Select'
import { Checkbox } from '../components/ui/Checkbox'
import { Radio } from '../components/ui/Radio'
import { Badge } from '../components/ui/Badge'
import { Tabs } from '../components/ui/Tabs'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { Toast } from '../components/ui/Toast'
import { Skeleton } from '../components/ui/Skeleton'
import { SectionHeading } from '../components/common/SectionHeading'
import { ProductCard } from '../components/common/ProductCard'
import { CategoryCard } from '../components/common/CategoryCard'
import { cn } from '../utils/cn'

/*
 * Design system gallery — component verification only (NOT an ecommerce
 * page). Bands alternate white ↔ surface-light per §14 rhythm; vertical
 * padding follows §6.2 (48 mobile / 72 tablet / 96 desktop). All copy is
 * real seed copy (§7.1 rule 11 — never lorem ipsum).
 */

/* Demo catalog data (shape matches API_DOCUMENTATION product payload) */
const SAMPLE_PRODUCTS = [
  {
    slug: 'wool-overcoat',
    name: 'Wool Overcoat — Charcoal',
    category: 'Outerwear',
    price: 189,
    compareAtPrice: 240,
    alt: 'Charcoal wool overcoat',
  },
  {
    slug: 'oxford-shirt',
    name: 'Oxford Shirt — White',
    category: 'Tops',
    price: 78,
    alt: 'White oxford shirt',
    availability: 'SOLD_OUT',
  },
  {
    slug: 'merino-crewneck',
    name: 'Merino Crewneck — Forest',
    category: 'Tops',
    price: 96,
    alt: 'Forest green merino crewneck',
  },
]

const SAMPLE_CATEGORY = {
  name: 'Outerwear',
  slug: 'outerwear',
  count: 128,
  subcategories: ['Jackets', 'Coats', 'Overshirts'],
}

/* Palette — UI spec §4.1 core, §4.2 semantic, §4.3 status */
const COLOR_GROUPS = [
  {
    title: 'Brand & neutrals (§4.1)',
    swatches: [
      { name: 'primary-700', hex: '#06571D', note: 'Primary actions, bars, footer' },
      { name: 'primary-800', hex: '#044516', note: 'Button hover' },
      { name: 'primary-900', hex: '#033311', note: 'Button pressed' },
      { name: 'primary-100', hex: '#E3EFE7', note: 'Tint fills, success badge' },
      { name: 'accent-500', hex: '#F2B808', note: 'Eyebrow dash, warning' },
      { name: 'accent-600', hex: '#D9A307', note: 'Accent hover' },
      { name: 'white', hex: '#FFFFFF', note: 'Page surface, cards' },
      { name: 'surface-light', hex: '#F5F6F6', note: 'Bands, plates, input fill' },
      { name: 'ink', hex: '#0A0A0A', note: 'Headings, primary text' },
      { name: 'text-body', hex: '#404040', note: 'Body copy' },
      { name: 'text-muted', hex: '#6E6E6E', note: 'Labels, meta, helper' },
      { name: 'line', hex: '#E5E5E5', note: 'Hairline dividers' },
      { name: 'line-strong', hex: '#C9C9C9', note: 'Control outlines' },
      { name: 'skeleton', hex: '#EDEDED', note: 'Loading blocks' },
    ],
  },
  {
    title: 'Semantic & status (§4.2–4.3)',
    swatches: [
      { name: 'error-700', hex: '#B42318', note: 'Inline errors, decline states' },
      { name: 'error-100', hex: '#FDECEA', note: 'Error banner fill' },
      { name: 'success', hex: '#06571D', note: 'In stock · PAID (primary-700)' },
      { name: 'warning', hex: '#F2B808', note: 'Low stock (accent-500 + ink)' },
      { name: 'disabled', hex: '#6E6E6E', note: 'Sold out (muted on surface)' },
    ],
  },
]

const LIGHT_SWATCHES = new Set([
  '#FFFFFF',
  '#F5F6F6',
  '#E3EFE7',
  '#FDECEA',
  '#E5E5E5',
  '#C9C9C9',
  '#EDEDED',
])

/* Type scale — UI spec §5.2 (mobile → tablet → desktop) */
const TYPE_SCALE = [
  { token: 'Display/H1', cls: 'text-h1', sample: 'Designed to outlast trends', meta: '36 → 48 → 64 · Poppins 700' },
  { token: 'Heading/H2', cls: 'text-h2 font-bold', sample: 'Built for everyday wear', meta: '28 → 32 → 40 · Poppins 700' },
  { token: 'Heading/H3', cls: 'text-h3 font-semibold', sample: 'The details matter', meta: '20 → 24 → 28 · Poppins 600' },
  { token: 'Heading/H4', cls: 'text-h4 font-semibold', sample: 'Care & materials', meta: '17 → 18 → 20 · Poppins 600' },
  { token: 'Body/Large', cls: 'text-body-lg', sample: 'Cut from dense organic cotton, our Oxford shirt softens with every wash and holds its shape for years.', meta: '16 → 17 → 18 · Inter 400' },
  { token: 'Body/Base', cls: 'text-body', sample: 'Free shipping on orders over $180, 30-day returns, and repairs on every piece we make.', meta: '15 → 16 · Inter 400' },
  { token: 'Body/Small', cls: 'text-body-sm', sample: 'Model is 6\'1" and wears size M · Ships in 1–2 business days', meta: '13 → 14 · Inter 400' },
  { token: 'Label', cls: 'text-label font-medium', sample: 'Email address', meta: '14 · Inter 500' },
  { token: 'Eyebrow', cls: 'text-eyebrow font-semibold uppercase', sample: 'New season', meta: '12 → 13 · Poppins 600 · +0.08em' },
  { token: 'Micro/Badge', cls: 'text-micro font-medium', sample: '50% OFF', meta: '12 · Inter 500 · +0.02em' },
  { token: 'Price/Card', cls: 'text-price-card font-semibold', sample: '$189.00', meta: '16 → 17 · Inter 600' },
  { token: 'Price/Hero', cls: 'text-price-hero font-semibold', sample: '$189.00', meta: '22 → 24 → 28 · Inter 600' },
]

/* Spacing — UI spec §6.1 (4px grid) */
const SPACING_SCALE = [
  { token: 'space-1', px: 4, use: 'Icon-to-label, badge padding' },
  { token: 'space-2', px: 8, use: 'Chip gaps, tight stacks' },
  { token: 'space-3', px: 12, use: 'Input inner padding, list gaps' },
  { token: 'space-4', px: 16, use: 'Card padding, mobile gutter' },
  { token: 'space-5', px: 20, use: 'Tablet grid gap' },
  { token: 'space-6', px: 24, use: 'Desktop grid gap, large card padding' },
  { token: 'space-8', px: 32, use: 'Component group gaps, modal padding' },
  { token: 'space-10', px: 40, use: 'Desktop page gutter' },
  { token: 'space-12', px: 48, use: 'Mobile section rhythm' },
  { token: 'space-16', px: 64, use: 'Tablet section rhythm' },
  { token: 'space-20', px: 80, use: 'Desktop sub-sections' },
  { token: 'space-24', px: 96, use: 'Desktop section rhythm' },
  { token: 'space-30', px: 120, use: 'Major section rhythm (home bands)' },
]

const HOME_TABS = [
  { id: 'new', label: 'New Arrivals' },
  { id: 'featured', label: 'Featured' },
  { id: 'bestsellers', label: 'Best Sellers' },
]

const TAB_COPY = {
  new: '12 pieces added this week — from the selvedge denim restock to the new merino knitwear.',
  featured: 'The Wool Overcoat and Oxford Shirt anchor this month’s edit.',
  bestsellers: 'Our three most reordered staples, back in every size.',
}

/* One gallery band: full-bleed background + container + heading */
function GallerySection({ title, description, muted = false, children }) {
  return (
    <section className={muted ? 'bg-surface-light' : 'bg-white'}>
      <Container className="py-12 sm:py-[72px] md:py-24">
        <div className="max-w-[65ch]">
          <h2 className="font-display text-h3 font-semibold text-ink">{title}</h2>
          {description && (
            <p className="mt-2 text-body text-body-copy">{description}</p>
          )}
        </div>
        <div className="mt-8">{children}</div>
      </Container>
    </section>
  )
}

function Swatch({ name, hex, note }) {
  const light = LIGHT_SWATCHES.has(hex)
  return (
    <div>
      <div
        className={cn('h-16 w-full', light && 'border border-line')}
        style={{ backgroundColor: hex }}
      />
      <p className="mt-2 font-display text-micro font-semibold uppercase tracking-[0.06em] text-ink">
        {name}
      </p>
      <p className="text-body-sm text-muted">
        {hex} · {note}
      </p>
    </div>
  )
}

export function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState('new')
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      {/* Intro */}
      <section className="bg-white">
        <Container className="py-12 sm:py-[72px] md:py-24">
          <SectionHeading
            as="h1"
            eyebrow="Shoply"
            title="Reusable"
            accent="UI design system"
          />
          <p className="mt-4 max-w-[65ch] text-body-lg text-body-copy">
            Every token, component and state defined once — square corners,
            no decorative shadows, green and yellow drawn straight from the
            approved design spec.
          </p>
        </Container>
      </section>

      {/* Colors */}
      <GallerySection
        muted
        title="Color palette"
        description="Sampled from the reference and approved in UI spec §4. Red appears only as semantic error; yellow never becomes text on light surfaces."
      >
        <div className="space-y-10">
          {COLOR_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="font-display text-label font-semibold uppercase tracking-[0.08em] text-muted">
                {group.title}
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                {group.swatches.map((swatch) => (
                  <Swatch key={swatch.name} {...swatch} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </GallerySection>

      {/* Typography */}
      <GallerySection
        title="Typography"
        description="Poppins for display, Inter for everything else. Sizes scale through the responsive tokens — one class, three widths."
      >
        <div>
          {TYPE_SCALE.map((row, index) => (
            <div
              key={row.token}
              className={cn(
                'flex flex-col gap-2 py-5 md:flex-row md:items-baseline md:justify-between md:gap-8',
                index > 0 && 'border-t border-line',
              )}
            >
              <p className={cn('max-w-[46ch] text-ink', row.cls)}>
                {row.sample}
              </p>
              <div className="shrink-0 md:text-right">
                <p className="font-display text-micro font-semibold uppercase tracking-[0.06em] text-primary-700">
                  {row.token}
                </p>
                <p className="text-body-sm text-muted">{row.meta}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-surface-light p-6 md:p-10">
          <SectionHeading
            eyebrow="Featured"
            title="Section heading"
            accent="in green"
          />
          <p className="mt-3 max-w-[65ch] text-body text-body-copy">
            Eyebrow dash, two-tone title, body copy — the heading pattern
            every storefront section repeats.
          </p>
        </div>
      </GallerySection>

      {/* Spacing */}
      <GallerySection
        muted
        title="Spacing scale"
        description="Strict 4 px grid. Section rhythm follows the spec: 48 mobile, 72 tablet, 96 desktop."
      >
        <ul className="space-y-3">
          {SPACING_SCALE.map((step) => (
            <li key={step.token} className="flex items-center gap-4">
              <span
                className="h-4 shrink-0 bg-primary-700"
                style={{ width: `${step.px}px` }}
                aria-hidden="true"
              />
              <span className="font-display text-micro font-semibold uppercase tracking-[0.06em] text-ink">
                {step.token}
              </span>
              <span className="text-body-sm text-muted">
                {step.px}px — {step.use}
              </span>
            </li>
          ))}
        </ul>
      </GallerySection>

      {/* Buttons */}
      <GallerySection
        title="Button"
        description="Variants × sizes (§8). Exactly one primary action per view section; loading keeps the label width."
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" size="m">
            Add to cart
          </Button>
          <Button variant="secondary" size="m">
            Continue shopping
          </Button>
          <Button variant="ghost" size="m">
            View all products
          </Button>
          <Button variant="danger" size="m">
            Remove
          </Button>
          <Button variant="primary" size="m" loading>
            Saving
          </Button>
          <Button variant="primary" size="m" disabled>
            Disabled
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Button size="s">Small (36)</Button>
          <Button size="m">Medium (44)</Button>
          <Button size="l">Large (52)</Button>
          <Button to="/design-system" variant="secondary" size="m">
            Renders as link
          </Button>
        </div>
      </GallerySection>

      {/* Badges */}
      <GallerySection
        muted
        title="Badge"
        description="Micro/Badge 12/500, square, status tones from §4.3 — color never travels without a label."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge>50% OFF</Badge>
          <Badge tone="accent">Only 2 left</Badge>
          <Badge tone="success">In stock</Badge>
          <Badge tone="error">Order failed</Badge>
          <Badge tone="neutral" uppercase>
            Sold out
          </Badge>
          <Badge tone="white" size="m">
            1,500+ Items
          </Badge>
          <Badge tone="primary" uppercase>
            Admin
          </Badge>
        </div>
      </GallerySection>

      {/* Form controls */}
      <GallerySection
        title="Form controls"
        description="Top-label pattern for fields (§9), 44 px hit areas for checks, errors wired with aria-describedby."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Input
              label="Email address"
              name="email"
              type="email"
              placeholder="you@example.com"
              helper="Order confirmations and tracking, nothing else."
            />
            <Textarea
              label="Delivery notes"
              name="notes"
              placeholder="Gate code, safe place behind the planter…"
              helper="Optional — couriers read these before every delivery."
            />
            <Select
              label="State"
              name="state"
              placeholder="Select state"
              options={[
                { value: 'ca', label: 'California' },
                { value: 'ny', label: 'New York' },
                { value: 'tx', label: 'Texas' },
              ]}
            />
            <Input
              label="Promo code"
              name="promo"
              required
              placeholder="SPRING10"
              error="That code expired on 31 March."
            />
          </div>

          <div className="space-y-6">
            <fieldset>
              <legend className="mb-2 text-label font-medium text-ink">
                Preferences
              </legend>
              <div className="-ml-3">
                <Checkbox
                  name="updates"
                  defaultChecked
                  label="Email me order updates"
                  description="Shipping status and delivery window changes."
                />
                <Checkbox
                  name="remember"
                  label="Save my details for faster checkout"
                  description="Stored on this device only."
                />
                <Checkbox
                  name="terms"
                  label="Accept the returns policy"
                  error="Required to place your first order."
                />
                <Checkbox name="gift" disabled label="Gift wrapping (unavailable)" />
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-label font-medium text-ink">
                Shipping method
              </legend>
              <div className="-ml-3">
                <Radio
                  name="shipping"
                  value="standard"
                  defaultChecked
                  label="Standard — 5–7 days"
                  description="Free on orders over $180"
                />
                <Radio
                  name="shipping"
                  value="express"
                  label="Express — 2 days"
                  description="$12.00"
                />
                <Radio
                  name="shipping"
                  value="overnight"
                  label="Overnight — next day"
                  description="$28.00"
                />
              </div>
            </fieldset>
          </div>
        </div>
      </GallerySection>

      {/* Tabs */}
      <GallerySection
        muted
        title="Tabs"
        description="44 px height, green fill when active (§8.3 — square corners per project rule). Horizontal scroll on mobile."
      >
        <Tabs
          tabs={HOME_TABS}
          value={activeTab}
          onChange={setActiveTab}
          ariaLabel="Home product modules"
        />
        <p
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
          className="mt-5 max-w-[65ch] text-body text-body-copy"
        >
          {TAB_COPY[activeTab]}
        </p>
      </GallerySection>

      {/* Cards */}
      <GallerySection
        title="Card family"
        description="0 px, no borders, no shadows — separation comes from surface color only (§7.1). White cards sit on gray bands; gray plates sit on white."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-surface-light p-6">
            <Card
              title="Order #SHP-2026-0412"
              description="Placed 12 March 2026 · 2 items"
              actions={
                <>
                  <Badge tone="success">Paid</Badge>
                  <Badge tone="primary" uppercase>
                    Shipped
                  </Badge>
                </>
              }
              footer={
                <div className="flex flex-wrap justify-end gap-3">
                  <Button variant="secondary" size="s">
                    View invoice
                  </Button>
                  <Button size="s">Track order</Button>
                </div>
              }
            >
              <ul className="divide-y divide-line">
                <li className="flex items-center justify-between gap-4 py-3 text-body">
                  <span className="text-ink">Wool Overcoat — Charcoal ×1</span>
                  <span className="font-semibold tabular-nums text-ink">
                    $189.00
                  </span>
                </li>
                <li className="flex items-center justify-between gap-4 py-3 text-body">
                  <span className="text-ink">Oxford Shirt — White ×2</span>
                  <span className="font-semibold tabular-nums text-ink">
                    $156.00
                  </span>
                </li>
              </ul>
            </Card>
          </div>

          <div className="bg-surface-light p-6">
            <CategoryCard category={SAMPLE_CATEGORY} />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-display text-label font-semibold uppercase tracking-[0.08em] text-muted">
            ProductCard — default, discounted, sold out
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_PRODUCTS.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </GallerySection>

      {/* Feedback: modal, toast, skeleton */}
      <GallerySection
        muted
        title="Feedback & loading"
        description="Modal and toast carry the only two shadows the spec allows; skeletons shimmer at 1.4 s while layouts load."
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="danger" onClick={() => setModalOpen(true)}>
            Remove from cart
          </Button>
          <span className="text-body-sm text-muted">
            Opens the confirm dialog — danger actions always confirm first.
          </span>
        </div>

        <div className="mt-8">
          <h3 className="font-display text-label font-semibold uppercase tracking-[0.08em] text-muted">
            Toasts — bottom-right desktop, top-center mobile
          </h3>
          <div className="mt-4 flex flex-col items-end gap-3 md:max-w-[400px]">
            <Toast message="Added to cart — Wool Overcoat, size M." />
            <Toast variant="error" message="Payment was declined. Try another card." />
            <Toast variant="info" message="SPRING10 will apply at checkout." />
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-display text-label font-semibold uppercase tracking-[0.08em] text-muted">
            Skeleton — product grid while data loads
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="bg-white p-4">
                <Skeleton variant="image" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </GallerySection>

      {/* Confirm dialog */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Remove item?"
        actions={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Keep item
            </Button>
            <Button variant="danger" onClick={() => setModalOpen(false)}>
              Remove
            </Button>
          </>
        }
      >
        Wool Overcoat — Charcoal will be removed from your cart. You can add
        it back anytime before checkout.
      </Modal>
    </>
  )
}
