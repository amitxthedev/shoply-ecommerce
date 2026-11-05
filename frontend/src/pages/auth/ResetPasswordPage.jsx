import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { useAuth } from '../../context/AuthContext'

/*
 * ResetPasswordPage — Reset password.
 * Token from URL params + new password + confirm password.
 * Demo only — no real password update.
 */
export function ResetPasswordPage() {
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const { token } = useParams()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const errs = {}
    if (!password) errs.password = 'Password is required'
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (confirmPassword !== password) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    setTouched({ password: true, confirmPassword: true })
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    setTimeout(() => {
      const result = resetPassword(token || 'demo-token', password)
      console.log('Reset password:', { token, password: '***', result })
      setLoading(false)
      if (result.success) setSuccess(true)
    }, 500)
  }

  const showError = (field) => touched[field] && errors[field]

  if (success) {
    return (
      <AuthLayout title="Password updated" subtitle="Your password has been reset successfully">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 mx-auto bg-primary-100 rounded-none flex items-center justify-center">
            <span className="text-2xl text-primary-700">✓</span>
          </div>
          <p className="text-body text-body-copy">
            You can now sign in with your new password.
          </p>
          <Button
            variant="primary"
            size="l"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            Sign in
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Set new password" subtitle="Enter your new password below">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="New password"
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
          label="Confirm new password"
          name="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
          error={showError('confirmPassword') ? errors.confirmPassword : undefined}
          placeholder="Re-enter your password"
        />
        <Button
          type="submit"
          variant="primary"
          size="l"
          className="w-full"
          loading={loading}
        >
          Reset password
        </Button>
        <p className="text-center text-body-sm text-muted">
          <Link
            to="/login"
            className="text-primary-700 font-medium underline decoration-2 underline-offset-4 hover:text-primary-800"
          >
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
