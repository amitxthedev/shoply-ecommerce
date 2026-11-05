import { useState } from 'react'

/*
 * ProductSpecs — PDP accordion sections (UI spec §14.4).
 * Description & materials / Shipping & returns accordions.
 * 0px, hairline top/bottom, +/− icon.
 */
export function ProductSpecs({ specs = [], description, materials }) {
  const [openSection, setOpenSection] = useState(null)

  const sections = [
    {
      id: 'description',
      title: 'Description & materials',
      content: (
        <div className="space-y-4">
          <p className="text-body text-body-copy leading-relaxed">
            {description}
          </p>
          {materials && (
            <p className="text-body-sm text-muted">
              <span className="font-medium text-ink">Materials:</span> {materials}
            </p>
          )}
          {specs.length > 0 && (
            <div className="mt-4 border-t border-line pt-4">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex justify-between gap-4 py-2 border-b border-line last:border-b-0"
                >
                  <span className="text-body-sm text-muted">{spec.label}</span>
                  <span className="text-body-sm text-ink text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'shipping',
      title: 'Shipping & returns',
      content: (
        <div className="space-y-3 text-body text-body-copy">
          <p>
            Free shipping on orders over $180. Standard delivery takes 3–5
            business days. Express delivery available at checkout.
          </p>
          <p>
            Free returns within 30 days of delivery. Items must be unworn,
            unwashed, and in original packaging. Refunds processed within 5–7
            business days.
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className="border-t border-line">
      {sections.map((section) => (
        <div key={section.id} className="border-b border-line">
          <button
            type="button"
            onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
            className="flex w-full items-center justify-between py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
            aria-expanded={openSection === section.id}
          >
            <span className="font-display text-h4 font-semibold text-ink">
              {section.title}
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
              {openSection === section.id ? (
                <polyline points="18 15 12 9 6 15" />
              ) : (
                <polyline points="6 9 12 15 18 9" />
              )}
            </svg>
          </button>
          {openSection === section.id && (
            <div className="pb-4">
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
