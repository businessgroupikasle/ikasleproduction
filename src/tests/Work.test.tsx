import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import Work from '../pages/Work'

describe('Work Page Creative Revamp', () => {
  it('renders the cinematic hero, REC badge, and studio technical metrics', () => {
    render(
      <MemoryRouter>
        <Work />
      </MemoryRouter>
    )

    expect(screen.getByText(/LIVE REC/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /frames that move/i })).toBeInTheDocument()

    const metrics = screen.getByLabelText('Studio technical highlights')
    expect(metrics).toHaveTextContent(/4K \/ 6K RAW/i)
    expect(metrics).toHaveTextContent(/ANAMORPHIC/i)
    expect(metrics).toHaveTextContent(/WIDE GAMUT/i)
    expect(metrics).toHaveTextContent(/SPATIAL AUDIO/i)
  })

  it('filters projects by category tab', () => {
    render(
      <MemoryRouter>
        <Work />
      </MemoryRouter>
    )

    // Initially "All Works" is active
    expect(screen.getByRole('heading', { level: 2, name: 'Kinetic Brand Film' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Human / Light' })).toBeInTheDocument()

    // Filter by "Photography"
    const photoTab = screen.getByRole('button', { name: /Photography/i })
    fireEvent.click(photoTab)

    expect(screen.getByRole('heading', { level: 2, name: 'Human / Light' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: 'Kinetic Brand Film' })).not.toBeInTheDocument()
  })

  it('switches between Cinema Tiles, Spotlight, and 35mm Roll view modes', () => {
    render(
      <MemoryRouter>
        <Work />
      </MemoryRouter>
    )

    // Switch to Spotlight
    const spotlightBtn = screen.getByTitle(/Director's Spotlight Split View/i)
    fireEvent.click(spotlightBtn)

    expect(screen.getByLabelText(/Director's Spotlight Console/i)).toBeInTheDocument()

    // Switch to 35mm Roll
    const stripBtn = screen.getByTitle(/35mm Film Roll View/i)
    fireEvent.click(stripBtn)

    expect(screen.getByLabelText(/35mm Motion Picture Roll/i)).toBeInTheDocument()
  })

  it('keeps the spotlight on a project that matches the active filter', () => {
    render(
      <MemoryRouter>
        <Work />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByTitle(/Director's Spotlight Split View/i))
    expect(screen.getByRole('heading', { level: 2, name: 'Kinetic Brand Film' })).toBeInTheDocument()

    // The monitor must not keep showing a project the filter has removed from the playlist.
    fireEvent.click(screen.getByRole('button', { name: /Photography/i }))
    expect(screen.getByRole('heading', { level: 2, name: 'Human / Light' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: 'Kinetic Brand Film' })).not.toBeInTheDocument()
  })

  it('closes with a call to action that links to contact and services', () => {
    render(
      <MemoryRouter>
        <Work />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 2, name: /HAVE A VISION\s*TO BRING INTO FOCUS/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Discuss your project/i })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: /Explore Services/i })).toHaveAttribute('href', '/services')
  })

  it('opens and closes the Frame Inspector HUD modal', () => {
    render(
      <MemoryRouter>
        <Work />
      </MemoryRouter>
    )

    const inspectBtns = screen.getAllByRole('button', { name: /Inspect.*camera frame/i })
    fireEvent.click(inspectBtns[0])

    // Modal dialog should be opened
    expect(screen.getByRole('dialog', { name: /Viewfinder Inspection/i })).toBeInTheDocument()
    expect(screen.getByText(/Close Viewfinder/i)).toBeInTheDocument()

    // Press Escape to close
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
