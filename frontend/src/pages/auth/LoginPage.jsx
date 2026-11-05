import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../../components/ui/Input'
import { Checkbox } from '../../components/ui/Checkbox'
import { Button } from '../../components/ui/Button'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { GoogleLoginButton } from '../../components/auth/GoogleLoginButton'
import { useAuth } from '../../context/AuthContext'

/*
 * LoginPage — Customer login.
 * Email, password, remember me, forgot password link.
 * Google login button UI. No real auth — demo only.
 */
export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    setTouched({ email: true, password: true })
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    setTimeout(() => {
      const result = login(email, password)
      console.log('Login:', { email, password: '***', rememberMe, result })
      setLoading(false)
      if (result.success) {
        navigate('/')
      }
    }, 500)
  }

  const showError = (field) => touched[field] && errors[field]

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your Shoply account">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
          placeholder="••••••••"
        />
        <div className="flex items-center justify-between">
          <Checkbox
            name="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            label="Remember me"
          />
          <Link
            to="/forgot-password"
            className="text-body-sm text-primary-700 underline decoration-2 underline-offset-4 hover:text-primary-800"
          >
            Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          variant="primary"
          size="l"
          className="w-full"
          loading={loading}
        >
          Sign in
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
        <GoogleLoginButton onClick={() => console.log('Google login clicked (demo)')} />
      </div>

      <p className="mt-6 text-center text-body-sm text-muted">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-primary-700 font-medium underline decoration-2 underline-offset-4 hover:text-primary-800"
        >
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}
