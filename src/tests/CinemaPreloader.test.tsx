import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CinemaPreloader } from '../components/ui/CinemaPreloader'

describe('CinemaPreloader Component', () => {
  it('renders the brand logo and camera lens image without text clutter', () => {
    const handleComplete = vi.fn()
    const { container } = render(<CinemaPreloader duration={3000} onComplete={handleComplete} />)

    // Check preloader role
    expect(screen.getByRole('progressbar', { name: /Loading animation/i })).toBeInTheDocument()

    // Check IKASLÉ brand logo is rendered
    const logo = screen.getByAltText('IKASLÉ')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/assets/brand/ikasle-mark.svg')

    // Check Camera Lens image is rendered
    const lensImg = screen.getByAltText('Camera Lens')
    expect(lensImg).toBeInTheDocument()
    expect(lensImg).toHaveAttribute('src', '/assets/services/camera-lens.jpg')

    // Verify absolutely NO text content in the preloader
    expect(container.textContent?.trim()).toBe('')
  })

  it('allows user to dismiss on click', () => {
    const handleComplete = vi.fn()
    render(<CinemaPreloader duration={3000} onComplete={handleComplete} />)

    const overlay = screen.getByRole('progressbar', { name: /Loading animation/i })
    fireEvent.click(overlay)
    expect(handleComplete).toHaveBeenCalledTimes(1)
  })
})
