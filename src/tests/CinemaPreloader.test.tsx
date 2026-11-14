import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CinemaPreloader } from '../components/ui/CinemaPreloader'

describe('CinemaPreloader Component', () => {
  it('renders the creative camera, lens barrel, and telemetry HUD', () => {
    const handleComplete = vi.fn()
    render(<CinemaPreloader duration={3000} onComplete={handleComplete} />)

    // Check preloader role
    expect(screen.getByRole('progressbar', { name: /Camera and lens calibration/i })).toBeInTheDocument()

    // Check camera HUD & Lens branding
    expect(screen.getByText(/IKASLÉ CINE-CAM/i)).toBeInTheDocument()
    expect(screen.getByText(/IKASLÉ CINE-PRIME 35mm/i)).toBeInTheDocument()
    expect(screen.getByText(/T1.5 • ANAMORPHIC 2.39:1/i)).toBeInTheDocument()
    expect(screen.getByText(/INITIALIZING HIGH-RES SENSORS/i)).toBeInTheDocument()
    expect(screen.getByText(/00:00:00:00/i)).toBeInTheDocument()
    expect(screen.getByText(/IRIS STOP/i)).toBeInTheDocument()
    expect(screen.getByText(/FOCUS DIST/i)).toBeInTheDocument()
  })

  it('allows user to toggle sound effects', () => {
    render(<CinemaPreloader duration={3000} />)
    const soundBtn = screen.getByRole('button', { name: /Toggle camera sound effects/i })
    expect(soundBtn).toHaveTextContent(/SOUND: ON/i)

    fireEvent.click(soundBtn)
    expect(soundBtn).toHaveTextContent(/SOUND: MUTED/i)
  })

  it('allows user to skip the 3-second loader immediately', () => {
    const handleComplete = vi.fn()
    render(<CinemaPreloader duration={3000} onComplete={handleComplete} />)

    const skipBtn = screen.getByRole('button', { name: /Skip camera loading animation/i })
    expect(skipBtn).toBeInTheDocument()

    fireEvent.click(skipBtn)
    expect(handleComplete).toHaveBeenCalledTimes(1)
  })
})
