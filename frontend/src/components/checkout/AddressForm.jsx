import { useState } from 'react'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'

/*
 * AddressForm — Step 1: Contact + shipping address (UI spec §14.6).
 * Guest form: full name, email, phone, address line 1, line 2, city,
 * state select, ZIP, country select (US only).
 * Validation: required fields, email format, phone format, ZIP format.
 */
const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'CA', label: 'California' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
  { value: 'FL', label: 'Florida' },
  { value: 'WA', label: 'Washington' },
  { value: 'IL', label: 'Illinois' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'OH', label: 'Ohio' },
  { value: 'GA', label: 'Georgia' },
]

const INITIAL_VALUES = {
  fullName: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
}

function validate(values) {
  const errors = {}

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required'
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address'
  }

  if (values.phone && !/^\+?[\d\s\-()]{7,}$/.test(values.phone)) {
    errors.phone = 'Enter a valid phone number'
  }

  if (!values.address1.trim()) {
    errors.address1 = 'Street address is required'
  }

  if (!values.city.trim()) {
    errors.city = 'City is required'
  }

  if (!values.state) {
    errors.state = 'State is required'
  }

  if (!values.zip.trim()) {
    errors.zip = 'ZIP code is required'
  } else if (!/^\d{5}(-\d{4})?$/.test(values.zip)) {
    errors.zip = 'Enter a valid 5-digit ZIP code'
  }

  return errors
}

export function AddressForm({ onSubmit }) {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    if (touched[field]) {
      const newErrors = validate({ ...values, [field]: e.target.value })
      setErrors(newErrors)
    }
  }

  const handleBlur = (field) => () => {
    setTouched((t) => ({ ...t, [field]: true }))
    const newErrors = validate(values)
    setErrors(newErrors)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate(values)
    setErrors(newErrors)
    setTouched(Object.keys(INITIAL_VALUES).reduce((acc, k) => ({ ...acc, [k]: true }), {}))
    if (Object.keys(newErrors).length === 0) {
      onSubmit(values)
    }
  }

  const showError = (field) => touched[field] && errors[field]

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Contact */}
      <div>
        <h3 className="font-display text-h4 font-semibold text-ink mb-4">
          Contact information
        </h3>
        <div className="space-y-4">
          <Input
            label="Full name"
            name="fullName"
            required
            value={values.fullName}
            onChange={handleChange('fullName')}
            onBlur={handleBlur('fullName')}
            error={showError('fullName') ? errors.fullName : undefined}
            placeholder="Jane Doe"
          />
          <Input
            label="Email address"
            name="email"
            type="email"
            required
            value={values.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            error={showError('email') ? errors.email : undefined}
            placeholder="you@example.com"
          />
          <Input
            label="Phone number"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange('phone')}
            onBlur={handleBlur('phone')}
            error={showError('phone') ? errors.phone : undefined}
            placeholder="+1 (555) 000-0000"
            helper="Optional — for delivery updates"
          />
        </div>
      </div>

      {/* Shipping address */}
      <div>
        <h3 className="font-display text-h4 font-semibold text-ink mb-4">
          Shipping address
        </h3>
        <div className="space-y-4">
          <Input
            label="Address line 1"
            name="address1"
            required
            value={values.address1}
            onChange={handleChange('address1')}
            onBlur={handleBlur('address1')}
            error={showError('address1') ? errors.address1 : undefined}
            placeholder="123 Main Street"
          />
          <Input
            label="Address line 2"
            name="address2"
            value={values.address2}
            onChange={handleChange('address2')}
            placeholder="Apartment, suite, etc."
            helper="Optional"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              required
              value={values.city}
              onChange={handleChange('city')}
              onBlur={handleBlur('city')}
              error={showError('city') ? errors.city : undefined}
              placeholder="San Francisco"
            />
            <Select
              label="State"
              name="state"
              required
              value={values.state}
              onChange={handleChange('state')}
              onBlur={handleBlur('state')}
              error={showError('state') ? errors.state : undefined}
              placeholder="Select state"
              options={US_STATES}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="ZIP code"
              name="zip"
              required
              value={values.zip}
              onChange={handleChange('zip')}
              onBlur={handleBlur('zip')}
              error={showError('zip') ? errors.zip : undefined}
              placeholder="94102"
            />
            <Select
              label="Country"
              name="country"
              value={values.country}
              onChange={handleChange('country')}
              options={[{ value: 'US', label: 'United States' }]}
            />
          </div>
        </div>
      </div>

      <Button type="submit" variant="primary" size="l" className="w-full sm:w-auto">
        Continue to shipping
      </Button>
    </form>
  )
}
