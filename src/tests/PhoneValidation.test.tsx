import { describe, expect, it } from 'vitest'
import {
  COUNTRIES,
  getCountryConfig,
  parsePhoneInput,
  validatePhoneNumber,
} from '../utils/phoneValidation'

describe('Phone Validation Utility', () => {
  it('contains supported countries with valid dial codes and flags', () => {
    expect(COUNTRIES.length).toBeGreaterThanOrEqual(10)
    const india = getCountryConfig('IN')
    expect(india.dialCode).toBe('+91')
    expect(india.flag).toBe('🇮🇳')

    const us = getCountryConfig('US')
    expect(us.dialCode).toBe('+1')
    expect(us.flag).toBe('🇺🇸')
  })

  it('validates Indian phone numbers correctly', () => {
    // Valid 10-digit Indian numbers starting with 6, 7, 8, or 9
    expect(validatePhoneNumber('8825972129', 'IN').isValid).toBe(true)
    expect(validatePhoneNumber('9876543210', 'IN').isValid).toBe(true)
    expect(validatePhoneNumber('7012345678', 'IN').isValid).toBe(true)
    expect(validatePhoneNumber('6381234567', 'IN').isValid).toBe(true)

    // Formatted output includes country dial code
    const res = validatePhoneNumber('8825972129', 'IN')
    expect(res.formatted).toBe('+91 8825972129')

    // Invalid numbers: wrong length
    const shortRes = validatePhoneNumber('882597212', 'IN')
    expect(shortRes.isValid).toBe(false)
    expect(shortRes.message).toContain('10-digit')

    const longRes = validatePhoneNumber('88259721290', 'IN')
    expect(longRes.isValid).toBe(false)
    expect(longRes.message).toContain('10-digit')

    // Invalid start digit (e.g. 1-5 or 0)
    const invalidStartRes = validatePhoneNumber('1825972129', 'IN')
    expect(invalidStartRes.isValid).toBe(false)
    expect(invalidStartRes.message).toContain('must start with 6, 7, 8, or 9')

    const zeroStartRes = validatePhoneNumber('0825972129', 'IN')
    expect(zeroStartRes.isValid).toBe(false)
  })

  it('validates US phone numbers correctly', () => {
    // Valid 10-digit US number (area code 202, exchange 555)
    expect(validatePhoneNumber('2025550123', 'US').isValid).toBe(true)
    expect(validatePhoneNumber('(202) 555-0123', 'US').isValid).toBe(true)

    // Invalid: area code starting with 0 or 1
    expect(validatePhoneNumber('1025550123', 'US').isValid).toBe(false)
    expect(validatePhoneNumber('0025550123', 'US').isValid).toBe(false)

    // Invalid length
    expect(validatePhoneNumber('20255501', 'US').isValid).toBe(false)
  })

  it('validates UK phone numbers correctly', () => {
    // Valid 10-digit UK mobile
    expect(validatePhoneNumber('7911123456', 'GB').isValid).toBe(true)
    // Strips leading 0 if entered
    expect(validatePhoneNumber('07911123456', 'GB').isValid).toBe(true)
    // Invalid length
    expect(validatePhoneNumber('7911', 'GB').isValid).toBe(false)
  })

  it('validates UAE phone numbers correctly', () => {
    // Valid 9-digit UAE mobile starting with 5
    expect(validatePhoneNumber('501234567', 'AE').isValid).toBe(true)
    expect(validatePhoneNumber('0501234567', 'AE').isValid).toBe(true)

    // Invalid start digit
    expect(validatePhoneNumber('201234567', 'AE').isValid).toBe(false)
  })

  it('validates Singapore phone numbers correctly', () => {
    // Valid 8-digit SG number starting with 8 or 9
    expect(validatePhoneNumber('81234567', 'SG').isValid).toBe(true)
    expect(validatePhoneNumber('91234567', 'SG').isValid).toBe(true)

    // Invalid length (e.g. 10 digits entered for SG)
    expect(validatePhoneNumber('8825972129', 'SG').isValid).toBe(false)
  })

  it('handles optional fields correctly', () => {
    expect(validatePhoneNumber('', 'IN', true).isValid).toBe(true)
    expect(validatePhoneNumber('   ', 'IN', true).isValid).toBe(true)
    expect(validatePhoneNumber('', 'IN', false).isValid).toBe(false)
  })

  it('parses input with international prefix automatically', () => {
    const parsed = parsePhoneInput('+91 8825972129')
    expect(parsed.countryCode).toBe('IN')
    expect(parsed.localNumber).toBe('8825972129')

    const parsedUS = parsePhoneInput('+1 2025550123')
    expect(parsedUS.countryCode).toBe('US')
    expect(parsedUS.localNumber).toBe('2025550123')
  })

  it('rejects non-numeric alphabetic input', () => {
    const res = validatePhoneNumber('ramyaphone', 'IN')
    expect(res.isValid).toBe(false)
    expect(res.message).toContain('only contain digits')
  })
})

