/*
 * GoogleLoginButton — Google login button UI (no real OAuth).
 * Shows "Continue with Google" with Google icon.
 * Square corners, no border radius.
 */
export function GoogleLoginButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 h-11 rounded-none border border-line-strong bg-white text-ink transition-colors duration-150 hover:bg-surface-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8M12 8v8" />
      </svg>
      <span className="text-label font-medium">Continue with Google</span>
    </button>
  )
}
