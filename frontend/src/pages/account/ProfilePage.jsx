import { useState } from 'react'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'

/*
 * ProfilePage — Profile + change password (UI spec §14.8).
 * Form max 480: name (email read-only per DEC-20) · change-password group
 * (current/new/confirm) → primary Save.
 */
export function ProfilePage() {
  const { user } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [email] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [saved, setSaved] = useState(false)

  const validate = () => {
    const errs = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (newPassword && newPassword.length < 8) errs.newPassword = 'Password must be at least 8 characters'
    if (newPassword && newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (newPassword && !currentPassword) errs.currentPassword = 'Current password is required'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    setTouched({ name: true, currentPassword: true, newPassword: true, confirmPassword: true })
    if (Object.keys(errs).length > 0) return

    console.log('Profile update:', { name, email, passwordChanged: !!newPassword })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const showError = (field) => touched[field] && errors[field]

  return (
    <div>
      <h2 className="font-display text-h2 font-bold text-ink mb-6">Profile</h2>

      <div className="max-w-[480px]">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Profile info */}
          <div>
            <h3 className="font-display text-h4 font-semibold text-ink mb-4">
              Personal information
            </h3>
            <div className="space-y-4">
              <Input
                label="Full name"
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                error={showError('name') ? errors.name : undefined}
              />
              <Input
                label="Email address"
                name="email"
                type="email"
                value={email}
                disabled
                helper="Email cannot be changed (DEC-20)"
              />
            </div>
          </div>

          {/* Change password */}
          <div>
            <h3 className="font-display text-h4 font-semibold text-ink mb-4">
              Change password
            </h3>
            <div className="space-y-4">
              <Input
                label="Current password"
                name="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, currentPassword: true }))}
                error={showError('currentPassword') ? errors.currentPassword : undefined}
              />
              <Input
                label="New password"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, newPassword: true }))}
                error={showError('newPassword') ? errors.newPassword : undefined}
                helper="Minimum 8 characters"
              />
              <Input
                label="Confirm new password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                error={showError('confirmPassword') ? errors.confirmPassword : undefined}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" variant="primary" size="m">
              Save changes
            </Button>
            {saved && (
              <span className="text-body-sm text-primary-700 font-medium">
                ✓ Saved
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}



