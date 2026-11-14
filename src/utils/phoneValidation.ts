export interface CountryConfig {
  code: string
  name: string
  dialCode: string
  flag: string
  placeholder: string
  maxDigits: number
  pattern?: string
  validate: (digits: string) => { isValid: boolean; message?: string }
}

export const COUNTRIES: CountryConfig[] = [
  {
    code: 'IN',
    name: 'India',
    dialCode: '+91',
    flag: '🇮🇳',
    placeholder: '98765 43210',
    maxDigits: 10,
    pattern: '[6-9][0-9]{9}',
    validate: (digits: string) => {
      if (!digits) {
        return { isValid: false, message: 'Please enter a phone number.' }
      }
      if (digits.length !== 10) {
        return {
          isValid: false,
          message: `Please enter a valid 10-digit Indian phone number (entered ${digits.length} digits).`,
        }
      }
      if (!/^[6-9]/.test(digits)) {
        return {
          isValid: false,
          message: 'Indian mobile numbers must start with 6, 7, 8, or 9.',
        }
      }
      return { isValid: true }
    },
  },
  {
    code: 'US',
    name: 'United States',
    dialCode: '+1',
    flag: '🇺🇸',
    placeholder: '202 555 0123',
    maxDigits: 10,
    pattern: '[2-9][0-9]{2}[2-9][0-9]{6}',
    validate: (digits: string) => {
      if (!digits) return { isValid: false, message: 'Please enter a phone number.' }
      if (digits.length !== 10) {
        return {
          isValid: false,
          message: `Please enter a valid 10-digit US phone number (entered ${digits.length} digits).`,
        }
      }
      if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(digits)) {
        return {
          isValid: false,
          message: 'Please enter a valid US area code and number.',
        }
      }
      return { isValid: true }
    },
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    dialCode: '+44',
    flag: '🇬🇧',
    placeholder: '7911 123456',
    maxDigits: 11,
    validate: (digits: string) => {
      if (!digits) return { isValid: false, message: 'Please enter a phone number.' }
      const normalized = digits.startsWith('0') ? digits.slice(1) : digits
      if (normalized.length !== 10 && normalized.length !== 11) {
        return {
          isValid: false,
          message: `Please enter a valid 10 or 11-digit UK phone number (entered ${normalized.length} digits).`,
        }
      }
      if (!/^[1-9]\d{9,10}$/.test(normalized)) {
        return {
          isValid: false,
          message: 'Please enter a valid UK phone number.',
        }
      }
      return { isValid: true }
    },
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    dialCode: '+971',
    flag: '🇦🇪',
    placeholder: '50 123 4567',
    maxDigits: 10,
    pattern: '0?5[0-9]{8}',
    validate: (digits: string) => {
      if (!digits) return { isValid: false, message: 'Please enter a phone number.' }
      const normalized = digits.startsWith('0') ? digits.slice(1) : digits
      if (normalized.length !== 9) {
        return {
          isValid: false,
          message: `Please enter a valid 9-digit UAE phone number (entered ${normalized.length} digits).`,
        }
      }
      if (!/^5\d{8}$/.test(normalized)) {
        return {
          isValid: false,
          message: 'UAE mobile numbers must start with 5 (e.g. 50 123 4567).',
        }
      }
      return { isValid: true }
    },
  },
  {
    code: 'SG',
    name: 'Singapore',
    dialCode: '+65',
    flag: '🇸🇬',
    placeholder: '8123 4567',
    maxDigits: 8,
    pattern: '[689][0-9]{7}',
    validate: (digits: string) => {
      if (!digits) return { isValid: false, message: 'Please enter a phone number.' }
      if (digits.length !== 8) {
        return {
          isValid: false,
          message: `Please enter a valid 8-digit Singapore phone number (entered ${digits.length} digits).`,
        }
      }
      if (!/^[689]\d{7}$/.test(digits)) {
        return {
          isValid: false,
          message: 'Singapore phone numbers must start with 6, 8, or 9.',
        }
      }
      return { isValid: true }
    },
  },
  {
    code: 'AU',
    name: 'Australia',
    dialCode: '+61',
    flag: '🇦🇺',
    placeholder: '412 345 678',
    maxDigits: 10,
    validate: (digits: string) => {
      if (!digits) return { isValid: false, message: 'Please enter a phone number.' }
      const normalized = digits.startsWith('0') ? digits.slice(1) : digits
      if (normalized.length !== 9) {
        return {
          isValid: false,
          message: `Please enter a valid 9-digit Australian phone number (entered ${normalized.length} digits).`,
        }
      }
      if (!/^[2-478]\d{8}$/.test(normalized)) {
        return {
          isValid: false,
          message: 'Please enter a valid Australian phone number.',
        }
      }
      return { isValid: true }
    },
  },
  {
    code: 'CA',
    name: 'Canada',
    dialCode: '+1',
    flag: '🇨🇦',
    placeholder: '416 555 0123',
    maxDigits: 10,
    pattern: '[2-9][0-9]{2}[2-9][0-9]{6}',
    validate: (digits: string) => {
      if (!digits) return { isValid: false, message: 'Please enter a phone number.' }
      if (digits.length !== 10) {
        return {
          isValid: false,
          message: `Please enter a valid 10-digit Canadian phone number (entered ${digits.length} digits).`,
        }
      }
      if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(digits)) {
        return {
          isValid: false,
          message: 'Please enter a valid Canadian area code and number.',
        }
      }
      return { isValid: true }
    },
  },
  {
    code: 'DE',
    name: 'Germany',
    dialCode: '+49',
    flag: '🇩🇪',
    placeholder: '151 12345678',
    maxDigits: 12,
    validate: (digits: string) => {
      if (!digits) return { isValid: false, message: 'Please enter a phone number.' }
      const normalized = digits.startsWith('0') ? digits.slice(1) : digits
      if (normalized.length < 10 || normalized.length > 11) {
        return {
          isValid: false,
          message: `Please enter a valid 10 or 11-digit German phone number (entered ${normalized.length} digits).`,
        }
      }
      return { isValid: true }
    },
  },
  {
    code: 'FR',
    name: 'France',
    dialCode: '+33',
    flag: '🇫🇷',
    placeholder: '6 12 34 56 78',
    maxDigits: 10,
    validate: (digits: string) => {
      if (!digits) return { isValid: false, message: 'Please enter a phone number.' }
      const normalized = digits.startsWith('0') ? digits.slice(1) : digits
      if (normalized.length !== 9) {
        return {
          isValid: false,
          message: `Please enter a valid 9-digit French phone number (entered ${normalized.length} digits).`,
        }
      }
      return { isValid: true }
    },
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    dialCode: '+966',
    flag: '🇸🇦',
    placeholder: '50 123 4567',
    maxDigits: 10,
    pattern: '0?5[0-9]{8}',
    validate: (digits: string) => {
      if (!digits) return { isValid: false, message: 'Please enter a phone number.' }
      const normalized = digits.startsWith('0') ? digits.slice(1) : digits
      if (normalized.length !== 9) {
        return {
          isValid: false,
          message: `Please enter a valid 9-digit Saudi phone number (entered ${normalized.length} digits).`,
        }
      }
      if (!/^5\d{8}$/.test(normalized)) {
        return {
          isValid: false,
          message: 'Saudi mobile numbers must start with 5.',
        }
      }
      return { isValid: true }
    },
  },
  {
    code: 'QA',
    name: 'Qatar',
    dialCode: '+974',
    flag: '🇶🇦',
    placeholder: '3312 3456',
    maxDigits: 8,
    pattern: '[3567][0-9]{7}',
    validate: (digits: string) => {
      if (!digits) return { isValid: false, message: 'Please enter a phone number.' }
      if (digits.length !== 8) {
        return {
          isValid: false,
          message: `Please enter a valid 8-digit Qatar phone number (entered ${digits.length} digits).`,
        }
      }
      if (!/^[3567]\d{7}$/.test(digits)) {
        return {
          isValid: false,
          message: 'Qatar phone numbers must start with 3, 5, 6, or 7.',
        }
      }
      return { isValid: true }
    },
  },
  {
    code: 'MY',
    name: 'Malaysia',
    dialCode: '+60',
    flag: '🇲🇾',
    placeholder: '12 345 6789',
    maxDigits: 11,
    validate: (digits: string) => {
      if (!digits) return { isValid: false, message: 'Please enter a phone number.' }
      const normalized = digits.startsWith('0') ? digits.slice(1) : digits
      if (normalized.length < 9 || normalized.length > 10) {
        return {
          isValid: false,
          message: `Please enter a valid 9 or 10-digit Malaysian phone number (entered ${normalized.length} digits).`,
        }
      }
      return { isValid: true }
    },
  },
  {
    code: 'OTHER',
    name: 'Other (International)',
    dialCode: '+',
    flag: '🌐',
    placeholder: 'Phone number',
    maxDigits: 15,
    validate: (digits: string) => {
      if (!digits) return { isValid: false, message: 'Please enter a phone number.' }
      if (digits.length < 7 || digits.length > 15) {
        return {
          isValid: false,
          message: `Please enter a valid international phone number (7–15 digits, entered ${digits.length}).`,
        }
      }
      return { isValid: true }
    },
  },
]

export function getCountryConfig(code: string): CountryConfig {
  return COUNTRIES.find((c) => c.code === code) || COUNTRIES[0]
}

export function getCountryMaxDigits(code: string): number {
  const config = getCountryConfig(code)
  return config.maxDigits || 15
}

export function parsePhoneInput(rawInput: string): { countryCode?: string; localNumber: string } {
  const trimmed = rawInput.trim()
  if (trimmed.startsWith('+')) {
    // Try matching longest dialCode first
    const sorted = [...COUNTRIES].filter((c) => c.dialCode !== '+').sort((a, b) => b.dialCode.length - a.dialCode.length)
    for (const c of sorted) {
      if (trimmed.startsWith(c.dialCode)) {
        const local = trimmed.slice(c.dialCode.length).trim()
        return { countryCode: c.code, localNumber: local }
      }
    }
  }
  return { localNumber: rawInput }
}

export function extractDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function validatePhoneNumber(
  rawInput: string,
  countryCode: string,
  optional = false
): { isValid: boolean; message?: string; formatted?: string } {
  const trimmed = rawInput.trim()
  if (!trimmed) {
    if (optional) {
      return { isValid: true, formatted: '' }
    }
    return { isValid: false, message: 'Please provide a valid contact number.' }
  }

  // Disallow letters or symbols other than digits, spaces, hyphens, and parentheses
  if (/[^\d\s\-()+]/.test(trimmed)) {
    return {
      isValid: false,
      message: 'Phone number can only contain digits, spaces, and hyphens.',
    }
  }

  const parsed = parsePhoneInput(trimmed)
  const activeCountry = getCountryConfig(parsed.countryCode || countryCode)
  const digits = extractDigits(parsed.localNumber)

  const result = activeCountry.validate(digits)
  if (!result.isValid) {
    return result
  }

  const formatted =
    activeCountry.dialCode !== '+'
      ? `${activeCountry.dialCode} ${parsed.localNumber.trim()}`
      : `+${digits}`

  return { isValid: true, formatted }
}

