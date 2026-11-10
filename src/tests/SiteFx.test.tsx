import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { Marquee } from '../components/fx/Marquee'
import { SiteFx } from '../components/fx/SiteFx'
import { SplitTitle } from '../components/fx/SplitTitle'
import { sceneFor } from '../utils/pageScenes'

describe('sceneFor', () => {
  it('maps every route to a scene', () => {
    expect(sceneFor('/').scene).toBe('home')
    expect(sceneFor('/about').scene).toBe('about')
    expect(sceneFor('/services').scene).toBe('services')
    expect(sceneFor('/services/photography').scene).toBe('service')
    expect(sceneFor('/work').scene).toBe('work')
    expect(sceneFor('/work/kinetic-brand-film').scene).toBe('work')
    expect(sceneFor('/portfolio').scene).toBe('work')
    expect(sceneFor('/portfolio/kinetic-brand-film').scene).toBe('work')
    expect(sceneFor('/contact').scene).toBe('contact')
    expect(sceneFor('/privacy-policy').scene).toBe('legal')
    expect(sceneFor('/terms-and-conditions').scene).toBe('legal')
  })

  it('ignores a trailing slash', () => {
    expect(sceneFor('/about/').scene).toBe('about')
  })

  it('gives unknown routes and unknown service slugs the lost scene', () => {
    expect(sceneFor('/nowhere').scene).toBe('lost')
    expect(sceneFor('/services/not-a-service').scene).toBe('lost')
  })

  it('tints each service differently but keeps the lost scene distinct', () => {
    const hues = ['photography', 'video-production', 'content-creation', 'creative-solutions'].map(
      (slug) => sceneFor(`/services/${slug}`).hue,
    )
    expect(new Set(hues).size).toBe(4)
    expect(sceneFor('/nowhere').hue).not.toBe(sceneFor('/').hue)
  })
})

describe('SiteFx', () => {
  it('renders a decorative backdrop for the current route and hides it from assistive tech', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/contact']}>
        <SiteFx />
      </MemoryRouter>,
    )
    const root = container.querySelector('.site-fx')
    expect(root).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.site-backdrop')).toHaveAttribute('data-scene', 'contact')
    expect(container.querySelector('.site-progress')).toBeInTheDocument()
    expect(container.querySelector('.site-rail-time')).toHaveTextContent('00:00:00:00')
  })
})

describe('SplitTitle', () => {
  it('exposes the whole heading as one accessible name and keeps every word', () => {
    render(<SplitTitle as="h1" lines={[{ text: "THIS SHOT DIDN'T" }, { text: 'MAKE THE FINAL CUT.', accent: true }]} />)

    const heading = screen.getByRole('heading', { level: 1, name: "THIS SHOT DIDN'T MAKE THE FINAL CUT." })
    expect(heading.querySelectorAll('.split-word')).toHaveLength(7)
    expect(heading.querySelectorAll('.split-line')).toHaveLength(2)
    expect(heading.querySelector('.split-line.accent')).toHaveTextContent('MAKE THE FINAL CUT.')
  })

  it('numbers words across lines so the stagger continues down the heading', () => {
    const { container } = render(<SplitTitle lines={[{ text: 'ONE STUDIO.' }, { text: 'MANY FORMS.' }]} />)
    const indexes = Array.from(container.querySelectorAll<HTMLElement>('.split-word > span')).map((el) => el.style.getPropertyValue('--i'))
    expect(indexes).toEqual(['0', '1', '2', '3'])
  })
})

describe('Marquee', () => {
  it('repeats its items twice for a seamless loop and is hidden from assistive tech', () => {
    const { container } = render(<Marquee items={['One', 'Two', 'Three']} outline reverse />)
    const marquee = container.querySelector('.fx-marquee')
    expect(marquee).toHaveAttribute('aria-hidden', 'true')
    expect(marquee).toHaveClass('is-outline', 'is-reverse')
    expect(container.querySelectorAll('.fx-marquee-group')).toHaveLength(2)
    expect(container.querySelectorAll('.fx-marquee-item')).toHaveLength(6)
  })
})
