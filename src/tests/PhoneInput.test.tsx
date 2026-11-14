import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import PhoneInput from '../components/ui/PhoneInput'

describe('PhoneInput Component', () => {
  it('renders country selector clearly displaying country code and flag', () => {
    const handleCountryChange = vi.fn()
    const handleChange = vi.fn()

    render(
      <PhoneInput
        id="test-phone"
        value=""
        countryCode="IN"
        onCountryChange={handleCountryChange}
        onChange={handleChange}
      />
    )

    const select = screen.getByRole('combobox', { name: /Country Code/i }) as HTMLSelectElement
    expect(select).toBeInTheDocument()
    expect(select.value).toBe('IN')
    expect(screen.getByText(/🇮🇳 \+91 \(India\)/i)).toBeInTheDocument()
  })

  it('allows switching country code and updates placeholder', () => {
    const handleCountryChange = vi.fn()
    const handleChange = vi.fn()

    const { rerender } = render(
      <PhoneInput
        id="test-phone"
        value=""
        countryCode="IN"
        onCountryChange={handleCountryChange}
        onChange={handleChange}
      />
    )

    const input = screen.getByRole('textbox', { name: /Phone number/i })
    expect(input).toHaveAttribute('placeholder', '98765 43210')

    const select = screen.getByRole('combobox', { name: /Country Code/i })
    fireEvent.change(select, { target: { value: 'US' } })
    expect(handleCountryChange).toHaveBeenCalledWith('US')

    rerender(
      <PhoneInput
        id="test-phone"
        value=""
        countryCode="US"
        onCountryChange={handleCountryChange}
        onChange={handleChange}
      />
    )

    expect(screen.getByRole('textbox', { name: /Phone number/i })).toHaveAttribute(
      'placeholder',
      '202 555 0123'
    )
  })

  it('displays validation error message when error prop is provided', () => {
    render(
      <PhoneInput
        id="test-phone"
        value="12345"
        countryCode="IN"
        onCountryChange={vi.fn()}
        onChange={vi.fn()}
        error="Please enter a valid 10-digit Indian phone number (entered 5 digits)."
      />
    )

    expect(
      screen.getByText(/Please enter a valid 10-digit Indian phone number/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(/10-digit/i)
  })
})

