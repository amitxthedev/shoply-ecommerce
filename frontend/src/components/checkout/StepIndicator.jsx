/*
 * StepIndicator — checkout step progress (UI spec §14.6).
 */

/*
 * StepIndicator — checkout step progress (UI spec §14.6).
 * Horizontal: 1. Address → 2. Shipping → 3. Payment
 * Active = primary-700, completed = check, upcoming = muted.
 * Square corners, no border radius.
 */
export function StepIndicator({ currentStep }) {
  const steps = [
    { id: 1, label: 'Address' },
    { id: 2, label: 'Shipping' },
    { id: 3, label: 'Payment' },
  ]

  return (
    <nav aria-label="Checkout steps" className="mb-8 lg:mb-12">
      <ol className="flex items-center gap-2 sm:gap-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id
          return (
            <li key={step.id} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-none text-micro font-semibold ${
                    isCompleted
                      ? 'bg-primary-700 text-white'
                      : isActive
                        ? 'bg-primary-700 text-white'
                        : 'bg-surface-light text-muted'
                  }`}
                >
                  {isCompleted ? '✓' : step.id}
                </span>
                <span
                  className={`text-body-sm font-medium ${
                    isActive || isCompleted ? 'text-ink' : 'text-muted'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
