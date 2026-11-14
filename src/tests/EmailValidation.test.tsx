import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { EMAIL_REGEX, validateEmail } from '../utils/emailValidation'
import { ContactSection } from '../components/home/HomeSections'

describe('Email Validation Utility', () => {
  it('rejects invalid email formats including digits in domain extension', () => {
    // Specifically testing the bug reported by the user:
    expect(validateEmail('ramya@gmail.com477788').isValid).toBe(false)
    expect(EMAIL_REGEX.test('ramya@gmail.com477788')).toBe(false)

    // Other invalid emails
    expect(validateEmail('ramya').isValid).toBe(false)
    expect(validateEmail('ramya@').isValid).toBe(false)
    expect(validateEmail('ramya@gmail').isValid).toBe(false)
    expect(validateEmail('ramya@gmail.').isValid).toBe(false)
    expect(validateEmail('ramya@.com').isValid).toBe(false)
    expect(validateEmail('ramya@gmail..com').isValid).toBe(false)
    expect(validateEmail('').isValid).toBe(false)
  })

  it('accepts valid email addresses', () => {
    expect(validateEmail('ramya@gmail.com').isValid).toBe(true)
    expect(validateEmail('director@ikasle.in').isValid).toBe(true)
    expect(validateEmail('hello.world@sub.domain.co.uk').isValid).toBe(true)
    expect(validateEmail('user+tag@domain.org').isValid).toBe(true)
  })
})

describe('Home ContactSection Email Validation UI', () => {
  it('displays a validation error when invalid email ramya@gmail.com477788 is entered and blurred', () => {
    render(
      <MemoryRouter>
        <ContactSection />
      </MemoryRouter>
    )

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    fireEvent.change(emailInput, { target: { value: 'ramya@gmail.com477788' } })
    fireEvent.blur(emailInput)

    expect(screen.getAllByText(/Please enter a valid email address/i).length).toBeGreaterThanOrEqual(1)
    expect(emailInput).toHaveClass('has-error')
  })

  it('clears error when user corrects the email address', () => {
    render(
      <MemoryRouter>
        <ContactSection />
      </MemoryRouter>
    )

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    fireEvent.change(emailInput, { target: { value: 'ramya@gmail.com477788' } })
    fireEvent.blur(emailInput)

    expect(screen.getAllByText(/Please enter a valid email address/i).length).toBeGreaterThanOrEqual(1)

    // Correcting the email
    fireEvent.change(emailInput, { target: { value: 'ramya@gmail.com' } })
    expect(screen.queryByText(/Please enter a valid email address/i)).not.toBeInTheDocument()
    expect(emailInput).not.toHaveClass('has-error')
  })

  it('blocks submission and shows error if submitting with invalid email', () => {
    render(
      <MemoryRouter>
        <ContactSection />
      </MemoryRouter>
    )

    const nameInput = screen.getByRole('textbox', { name: /^name$/i })
    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const submitBtn = screen.getByRole('button', { name: /Send project brief/i })

    fireEvent.change(nameInput, { target: { value: 'ramya' } })
    fireEvent.change(emailInput, { target: { value: 'ramya@gmail.com477788' } })
    fireEvent.click(submitBtn)

    expect(screen.getAllByText(/Please enter a valid email address/i).length).toBeGreaterThanOrEqual(1)
  })

  it('submits form to /api/contact, displays success message, and automatically clears form fields', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: 'Your project brief has been submitted successfully!' }),
    } as Response)

    render(
      <MemoryRouter>
        <ContactSection />
      </MemoryRouter>
    )

    const nameInput = screen.getByRole('textbox', { name: /^name$/i }) as HTMLInputElement
    const emailInput = screen.getByRole('textbox', { name: /email/i }) as HTMLInputElement
    const phoneInput = screen.getByRole('textbox', { name: /phone number/i }) as HTMLInputElement
    const serviceSelect = screen.getByRole('combobox', { name: /service/i }) as HTMLSelectElement
    const messageInput = screen.getByRole('textbox', { name: /project description/i }) as HTMLTextAreaElement
    const submitBtn = screen.getByRole('button', { name: /Send project brief/i })

    fireEvent.change(nameInput, { target: { value: 'Ramya' } })
    fireEvent.change(emailInput, { target: { value: 'ramya@gmail.com' } })
    fireEvent.change(phoneInput, { target: { value: '8825972129' } })
    fireEvent.change(serviceSelect, { target: { value: 'Photography' } })
    fireEvent.change(messageInput, { target: { value: 'Commercial photography production brief with over twenty characters.' } })

    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/Your project brief has been submitted successfully!/i)).toBeInTheDocument()
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({
        method: 'POST',
      })
    )

    // Verify fields cleared automatically without page refresh
    expect(nameInput.value).toBe('')
    expect(emailInput.value).toBe('')
    expect(phoneInput.value).toBe('')
    expect(serviceSelect.value).toBe('')
    expect(messageInput.value).toBe('')

    fetchSpy.mockRestore()
  })

  it('retains entered form fields and displays error message if submission fails', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ success: false, message: 'Transmission failed. Server error.' }),
    } as Response)

    render(
      <MemoryRouter>
        <ContactSection />
      </MemoryRouter>
    )

    const nameInput = screen.getByRole('textbox', { name: /^name$/i }) as HTMLInputElement
    const emailInput = screen.getByRole('textbox', { name: /email/i }) as HTMLInputElement
    const phoneInput = screen.getByRole('textbox', { name: /phone number/i }) as HTMLInputElement
    const serviceSelect = screen.getByRole('combobox', { name: /service/i }) as HTMLSelectElement
    const messageInput = screen.getByRole('textbox', { name: /project description/i }) as HTMLTextAreaElement
    const submitBtn = screen.getByRole('button', { name: /Send project brief/i })

    fireEvent.change(nameInput, { target: { value: 'Ramya' } })
    fireEvent.change(emailInput, { target: { value: 'ramya@gmail.com' } })
    fireEvent.change(phoneInput, { target: { value: '8825972129' } })
    fireEvent.change(serviceSelect, { target: { value: 'Photography' } })
    fireEvent.change(messageInput, { target: { value: 'Commercial photography production brief with over twenty characters.' } })

    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/Transmission failed. Server error./i)).toBeInTheDocument()
    })

    // Verify fields are retained for retrying
    expect(nameInput.value).toBe('Ramya')
    expect(emailInput.value).toBe('ramya@gmail.com')
    expect(phoneInput.value).toBe('8825972129')
    expect(serviceSelect.value).toBe('Photography')
    expect(messageInput.value).toBe('Commercial photography production brief with over twenty characters.')

    fetchSpy.mockRestore()
  })
})
