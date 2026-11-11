import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Contact from '../pages/Contact'

describe('Contact Page Revamp', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('renders hero, studio status, and direct contact cards', () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    )

    expect(screen.getByText(/STUDIO STATUS: ACCEPTING SELECT 2026 COMMISSIONS/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /let's put your idea/i })).toBeInTheDocument()
    expect(screen.getByText('ikasleproduction@gmail.com')).toBeInTheDocument()
    expect(screen.getByText('+91 78451 32962')).toBeInTheDocument()
    expect(screen.getByText('Coimbatore')).toBeInTheDocument()
  })

  it('pre-selects discipline and fills template message when URL params are present', () => {
    render(
      <MemoryRouter initialEntries={['/contact?service=photography&discipline=product']}>
        <Contact />
      </MemoryRouter>
    )

    const photoChip = screen.getByRole('radio', { name: /Photography/i })
    expect(photoChip).toHaveAttribute('aria-checked', 'true')

    const messageInput = screen.getByLabelText(/Project Narrative & Creative Brief/i) as HTMLTextAreaElement
    expect(messageInput.value).toContain('product')
  })

  it('validates required fields on submission', () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    )

    const submitBtn = screen.getByRole('button', { name: /Transmit Production Brief/i })
    fireEvent.click(submitBtn)

    expect(screen.getByText(/Please provide your full name/i)).toBeInTheDocument()
    expect(screen.getByText(/Please provide a valid email/i)).toBeInTheDocument()
    expect(screen.getByText(/Please provide a valid contact number/i)).toBeInTheDocument()
    expect(screen.getByText(/Please provide a brief description/i)).toBeInTheDocument()
  })

  it('submits valid brief to /api/contact and shows cinematic confirmation slate', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: 'Brief transmitted successfully.' }),
    } as Response)

    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Your Name \*/i), { target: { value: 'Arjun Das' } })
    fireEvent.change(screen.getByLabelText(/Email Address \*/i), { target: { value: 'arjun@filmstudio.com' } })
    fireEvent.change(screen.getByLabelText(/Phone \/ WhatsApp \*/i), { target: { value: '+91 98765 43210' } })
    fireEvent.change(screen.getByLabelText(/Project Narrative & Creative Brief \*/i), {
      target: { value: 'We need a high-energy commercial film for our upcoming sports beverage launch.' },
    })

    const submitBtn = screen.getByRole('button', { name: /Transmit Production Brief/i })
    fireEvent.click(submitBtn)

    // Wait for cinematic confirmation slate
    await waitFor(() => {
      expect(screen.getByText(/TRANSMISSION CONFIRMED/i)).toBeInTheDocument()
    }, { timeout: 3000 })

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
    )
    const requestInit = fetchSpy.mock.calls[0][1]
    const payload = JSON.parse(String(requestInit?.body))
    expect(payload).toMatchObject({
      name: 'Arjun Das',
      email: 'arjun@filmstudio.com',
      phone: '+91 98765 43210',
      discipline: 'Video Production',
      message: 'We need a high-energy commercial film for our upcoming sports beverage launch.',
    })
    expect(payload.referenceId).toMatch(/^IKL-2026-\d{4}$/)

    expect(screen.getByText(/REF IKL-2026-/i)).toBeInTheDocument()
    expect(screen.getByText(/Thank you/i)).toBeInTheDocument()
    expect(screen.getByText('Arjun Das')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Copy Slate Reference/i })).toBeInTheDocument()

    // Confirmation slate auto-closes after 3 seconds and resets the form
    await waitFor(() => {
      expect(screen.queryByText(/TRANSMISSION CONFIRMED/i)).not.toBeInTheDocument()
    }, { timeout: 4500 })

    expect(screen.getByRole('button', { name: /Transmit Production Brief/i })).toBeInTheDocument()
    expect((screen.getByLabelText(/Your Name \*/i) as HTMLInputElement).value).toBe('')
  })

  it('shows an error alert with fallback mailto link if brief transmission fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))

    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Your Name \*/i), { target: { value: 'Arjun Das' } })
    fireEvent.change(screen.getByLabelText(/Email Address \*/i), { target: { value: 'arjun@filmstudio.com' } })
    fireEvent.change(screen.getByLabelText(/Phone \/ WhatsApp \*/i), { target: { value: '+91 98765 43210' } })
    fireEvent.change(screen.getByLabelText(/Project Narrative & Creative Brief \*/i), {
      target: { value: 'We need a high-energy commercial film for our upcoming sports beverage launch.' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Transmit Production Brief/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Network error/i)
    })
    expect(screen.getByRole('link', { name: /Send via Email App \(businessgroupikasle@gmail\.com\)/i })).toBeInTheDocument()
    expect(screen.queryByText(/TRANSMISSION CONFIRMED/i)).not.toBeInTheDocument()
  })

  it('toggles FAQ accordion items', () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    )

    // First FAQ item is open by default
    expect(screen.getByText(/For commercial films, multi-day campaigns/i)).toBeInTheDocument()

    // Click the second FAQ item
    const secondFaqTrigger = screen.getByText(/Do you provide complete end-to-end production crews/i)
    fireEvent.click(secondFaqTrigger)

    expect(screen.getByText(/Yes\. IKASLÉ Productions operates a full-service infrastructure/i)).toBeInTheDocument()
  })
})
