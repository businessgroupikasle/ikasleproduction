import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import Contact from '../pages/Contact'

describe('Contact Page Revamp', () => {
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

  it('submits valid brief and shows cinematic confirmation slate', async () => {
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

    // Wait for cinematic encoding
    await waitFor(() => {
      expect(screen.getByText(/TRANSMISSION CONFIRMED/i)).toBeInTheDocument()
    }, { timeout: 3000 })

    expect(screen.getByText(/REF IKL-2026-/i)).toBeInTheDocument()
    expect(screen.getByText(/Thank you/i)).toBeInTheDocument()
    expect(screen.getByText('Arjun Das')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Copy Slate Reference/i })).toBeInTheDocument()
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
