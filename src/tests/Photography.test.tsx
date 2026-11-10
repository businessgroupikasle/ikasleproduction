import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import App from '../app/App'

describe('Photography Detail Page (/services/photography)', () => {
  const findHeading = () => screen.findByRole('heading', { name: /^PHOTOGRAPHY$/i }, { timeout: 8000 })

  it('renders the Photography Detail Page with main heading and exact description', async () => {
    render(
      <MemoryRouter initialEntries={['/services/photography']}>
        <App />
      </MemoryRouter>
    )

    // Verify main heading
    const heading = await findHeading()
    expect(heading).toBeInTheDocument()

    // Verify exact description
    expect(
      screen.getByText(
        /Purposeful image-making for brands, products, portraits, and editorial stories — from visual planning through the final grade\./i
      )
    ).toBeInTheDocument()
  }, 25000)

  it('renders the Possible Deliverables card with all 3 specified deliverables', async () => {
    render(
      <MemoryRouter initialEntries={['/services/photography']}>
        <App />
      </MemoryRouter>
    )

    await findHeading()

    // Possible Deliverables eyebrow/heading
    expect(screen.getByText(/POSSIBLE DELIVERABLES/i)).toBeInTheDocument()

    // All 3 deliverables
    expect(screen.getByText(/Campaign and Editorial Photography/i)).toBeInTheDocument()
    expect(screen.getByText(/Product and People Photography/i)).toBeInTheDocument()
    expect(screen.getByText(/Retouching and Colour Finishing/i)).toBeInTheDocument()
  })

  it('renders the 10 photography services and allows selecting each discipline', async () => {
    render(
      <MemoryRouter initialEntries={['/services/photography']}>
        <App />
      </MemoryRouter>
    )

    await findHeading()

    const expectedServices = [
      'Product Photography',
      'Wedding Photography',
      'Event Photography',
      'Fashion Photography',
      'Corporate Photography',
      'Commercial Photography',
      'Portrait Photography',
      'Food Photography',
      'Architectural Photography',
      'Industrial Photography',
    ]

    for (const serviceName of expectedServices) {
      const items = screen.getAllByText(serviceName)
      expect(items.length).toBeGreaterThan(0)
    }

    // Default preview shows Product Photography
    expect(screen.getByRole('heading', { name: /Product Photography/i, level: 4 })).toBeInTheDocument()

    // Hover or click Wedding Photography tab
    const weddingTab = screen.getByRole('tab', { name: /Wedding Photography/i })
    fireEvent.mouseEnter(weddingTab)

    // Preview should update to Wedding Photography
    expect(screen.getByRole('heading', { name: /Wedding Photography/i, level: 4 })).toBeInTheDocument()
  })

  it('renders the bottom CTA section with required heading and purple Discuss Your Project button', async () => {
    render(
      <MemoryRouter initialEntries={['/services/photography']}>
        <App />
      </MemoryRouter>
    )

    await findHeading()

    // Verify CTA heading
    expect(
      screen.getByRole('heading', { name: /LET'S SHAPE THE RIGHT PRODUCTION FOR YOUR IDEA\./i })
    ).toBeInTheDocument()

    // Verify Discuss Your Project button linking to /contact
    const ctaBtn = screen.getByRole('link', { name: /Discuss Your Project/i })
    expect(ctaBtn).toBeInTheDocument()
    expect(ctaBtn).toHaveAttribute('href', '/contact')
  })
})

