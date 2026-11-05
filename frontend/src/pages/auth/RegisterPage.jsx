import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../../components/ui/Input'
import { Checkbox } from '../../components/ui/Checkbox'
import { Button } from '../../components/ui/Button'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { GoogleLoginButton } from '../../components/auth/GoogleLoginButton'
import { useAuth } from '../../context/AuthContext'

/*
 * RegisterPage — Customer registration.
 * Full name, email, password, confirm password, terms checkbox.
 * Google login button UI. No real auth — demo only.
 */
export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!fullName.trim()) errs.fullName = 'Full name is required'
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (confirmPassword !== password) errs.confirmPassword = 'Passwords do not match'
    if (!agreeTerms) errs.agreeTerms = 'You must agree to the terms'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true, agreeTerms: true })
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    setTimeout(() => {
      const result = register(fullName, email, password)
      console.log('Register:', { fullName, email, password: '***', result })
      setLoading(false)
      if (result.success) {
        navigate('/')
      }
    }, 500)
  }

  const showError = (field) => touched[field] && errors[field]

  return (
    <AuthLayout title="Create your account" subtitle="Join Shoply for premium everyday essentials">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Full name"
          name="fullName"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
          error={showError('fullName') ? errors.fullName : undefined}
          placeholder="Jane Doe"
        />
        <Input
          label="Email address"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          error={showError('email') ? errors.email : undefined}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={showError('password') ? errors.password : undefined}
          placeholder="At least 8 characters"
          helper="Minimum 8 characters"
        />
        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
          error={showError('confirmPassword') ? errors.confirmPassword : undefined}
          placeholder="Re-enter your password"
        />
        <div>
          <Checkbox
            name="agreeTerms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            label="I agree to the Terms of Service and Privacy Policy"
          />
          {showError('agreeTerms') && (
            <p className="mt-1 text-body-sm text-error-700">{errors.agreeTerms}</p>
          )}
        </div>
        <Button
          type="submit"
          variant="primary"
          size="l"
          className="w-full"
          loading={loading}
        >
          Create account
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-line" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-body-sm text-muted">or</span>
          </div>
        </div>
        <GoogleLoginButton onClick={() => console.log('Google register clicked (demo)')} />
      </div>

      <p className="mt-6 text-center text-body-sm text-muted">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-primary-700 font-medium underline decoration-2 underline-offset-4 hover:text-primary-800"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
