import React from 'react'
import { ChevronDown } from 'lucide-react'
import {
  COUNTRIES,
  getCountryConfig,
  parsePhoneInput,
} from '../../utils/phoneValidation'

export interface PhoneInputProps {
  id?: string
  name?: string
  value: string
  countryCode: string
  onCountryChange: (countryCode: string) => void
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
  inputClassName?: string
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  id,
  name,
  value,
  countryCode,
  onCountryChange,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  placeholder,
  className = '',
  inputClassName = '',
}) => {
  const currentCountry = getCountryConfig(countryCode)

  const handleCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value
    onCountryChange(newCode)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawVal = e.target.value
    if (rawVal.trim().startsWith('+')) {
      const parsed = parsePhoneInput(rawVal)
      if (parsed.countryCode && parsed.countryCode !== countryCode) {
        onCountryChange(parsed.countryCode)
      }
      let local = parsed.localNumber
      if ((parsed.countryCode || countryCode) === 'IN') {
        local = local.replace(/\D/g, '').slice(0, 10)
      }
      onChange(local)
      return
    }

    if (countryCode === 'IN') {
      const digitsOnly = rawVal.replace(/\D/g, '')
      // Indian mobile numbers accept strictly at most 10 digits
      rawVal = digitsOnly.slice(0, 10)
    }

    onChange(rawVal)
  }

  // If value prop already includes +, display just the local part in the text input
  const parsedValue = parsePhoneInput(value)
  const displayValue = parsedValue.countryCode ? parsedValue.localNumber : value

  // Calculate full international formatted phone for hidden form field
  const fullPhone = value.trim()
    ? value.trim().startsWith('+')
      ? value.trim()
      : currentCountry.dialCode !== '+'
        ? `${currentCountry.dialCode} ${value.trim()}`
        : `+${value.trim().replace(/\D/g, '')}`
    : ''

  return (
    <div className={`phone-input-root ${className}`}>
      {name && <input type="hidden" name={name} value={fullPhone} />}
      <div className={`phone-input-group ${error ? 'has-error' : ''}`}>
        <div className="phone-country-picker">
          <select
            id={id ? `${id}-country` : undefined}
            className="phone-country-select"
            value={countryCode}
            onChange={handleCountrySelect}
            disabled={disabled}
            aria-label="Country Code"
            title="Select country code"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.dialCode} ({c.name})
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="phone-country-chevron" aria-hidden="true" />
        </div>

        <input
          id={id}
          type="tel"
          className={`phone-text-input ${inputClassName}`}
          value={displayValue}
          onChange={handleInputChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          maxLength={countryCode === 'IN' ? 10 : 16}
          pattern={countryCode === 'IN' ? '[6-9][0-9]{9}' : undefined}
          title={countryCode === 'IN' ? 'Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9' : undefined}
          placeholder={placeholder || currentCountry.placeholder}
          autoComplete="tel-national"
          aria-label="Phone number"
          aria-invalid={Boolean(error)}
        />
      </div>
      {error && (
        <span className="phone-input-error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

export default PhoneInput
