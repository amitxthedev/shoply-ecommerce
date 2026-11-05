import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { useAuth } from '../../context/AuthContext'

/*
 * ForgotPasswordPage — Forgot password.
 * Email input → sends reset link (demo). Success message shown.
 */
export function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const validate = () => {
    if (!email.trim()) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email'
    return ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate()
    setError(err)
    setTouched(true)
    if (err) return

    setLoading(true)
    setTimeout(() => {
      const result = forgotPassword(email)
      console.log('Forgot password:', { email, result })
      setLoading(false)
      if (result.success) setSent(true)
    }, 500)
  }

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email and we'll send you a reset link">
      {sent ? (
        <div className="text-center space-y-4">
          <div className="h-12 w-12 mx-auto bg-primary-100 rounded-none flex items-center justify-center">
            <span className="text-2xl text-primary-700">✓</span>
          </div>
          <h2 className="font-display text-h4 font-semibold text-ink">
            Check your email
          </h2>
          <p className="text-body text-body-copy">
            We've sent a password reset link to <span className="font-medium text-ink">{email}</span>.
          </p>
          <p className="text-body-sm text-muted">
            Didn't receive it? Check your spam folder or{' '}
            <button
              type="button"
              onClick={() => setSent(false)}
              className="text-primary-700 underline decoration-2 underline-offset-4 hover:text-primary-800"
            >
              try again
            </button>
            .
          </p>
          <Link
            to="/login"
            className="inline-block text-body-sm text-primary-700 font-medium underline decoration-2 underline-offset-4 hover:text-primary-800 mt-4"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Email address"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            error={touched && error ? error : undefined}
            placeholder="you@example.com"
          />
          <Button
            type="submit"
            variant="primary"
            size="l"
            className="w-full"
            loading={loading}
          >
            Send reset link
          </Button>
          <p className="text-center text-body-sm text-muted">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-primary-700 font-medium underline decoration-2 underline-offset-4 hover:text-primary-800"
            >
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  )
}
