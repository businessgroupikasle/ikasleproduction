import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import App from '../app/App'
import { serviceDetails, type ServiceDetailConfig } from '../data/serviceDetails'
import { services } from '../data/site'

const configs = Object.values(serviceDetails)

// Every image under public/assets, keyed like "../../public/assets/photography/product.jpg".
// Globbing (instead of node:fs) keeps this test inside the app's browser-only type environment.
const publicImages = new Set(Object.keys(import.meta.glob('../../public/assets/**/*.{jpg,jpeg,png,webp}')))

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

// Pages are lazy-loaded, so the first lookup can be slow on a cold module cache or a busy machine.
const findHero = (title: string) => screen.findByRole('heading', { level: 1, name: title }, { timeout: 8000 })

describe('Service detail data', () => {
  it('has a detail config for every service on the Services page', () => {
    for (const service of services) {
      expect(serviceDetails[service.slug], `missing detail config for "${service.slug}"`).toBeDefined()
    }
  })

  it.each(configs)('$slug: disciplines are well-formed and every image exists on disk', (config) => {
    const { items } = config.disciplines
    expect(items.length).toBeGreaterThanOrEqual(3)
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length)

    items.forEach((item, i) => {
      expect(item.index).toBe(String(i + 1).padStart(2, '0'))
      expect(item.deliverables.length).toBeGreaterThan(0)
      expect(item.alt.length).toBeGreaterThan(0)
      expect(item.image.startsWith('/assets/')).toBe(true)
      expect(publicImages.has(`../../public${item.image}`), `${item.image} is missing`).toBe(true)
    })
  })
})

describe.each(configs)('Service detail page: /services/$slug', (config: ServiceDetailConfig) => {
  const path = `/services/${config.slug}`
  const { items } = config.disciplines

  it('renders the hero heading, description and possible deliverables', async () => {
    renderAt(path)

    expect(await findHero(config.title)).toBeInTheDocument()
    expect(screen.getByText(config.description)).toBeInTheDocument()
    expect(screen.getByText(/POSSIBLE DELIVERABLES/i)).toBeInTheDocument()
    expect(config.deliverables).toHaveLength(3)
    for (const deliverable of config.deliverables) {
      expect(screen.getAllByText(deliverable.title).length).toBeGreaterThan(0)
    }
  })

  it('lists every discipline and updates the preview when one is selected', async () => {
    renderAt(path)
    await findHero(config.title)

    expect(screen.getAllByRole('tab')).toHaveLength(items.length)
    expect(screen.getByText(`${items.length} CAPABILITIES`)).toBeInTheDocument()

    // First discipline is active by default.
    expect(screen.getByRole('heading', { level: 4, name: items[0].title })).toBeInTheDocument()

    const last = items[items.length - 1]
    fireEvent.mouseEnter(screen.getByRole('tab', { name: new RegExp(last.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }))

    expect(screen.getByRole('heading', { level: 4, name: last.title })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: `Enquire about ${last.title}` })).toHaveAttribute(
      'href',
      `/contact?service=${config.slug}&discipline=${last.id}`,
    )
  })

  it('fires its signature effect from the hero button', async () => {
    renderAt(path)
    await findHero(config.title)

    // The effect layer is portalled to <body>, so look there rather than in the render container.
    expect(document.body.querySelector('.svc-fx')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: config.signature.ariaLabel }))
    expect(document.body.querySelector(`.svc-fx-${config.signature.effect}`)).not.toBeNull()
  })

  it('renders the closing call to action', async () => {
    renderAt(path)
    await findHero(config.title)

    expect(screen.getByRole('heading', { name: /LET'S SHAPE THE RIGHT PRODUCTION FOR YOUR IDEA\./i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Discuss Your Project/i })).toHaveAttribute('href', '/contact')
  })
})

describe('Service-specific preview treatments', () => {
  it('video production shows the cinema HUD (REC timecode + letterbox bars)', async () => {
    const { container } = renderAt('/services/video-production')
    await findHero('VIDEO PRODUCTION')

    expect(container.querySelector('.preview-glass-frame.is-cinema')).not.toBeNull()
    expect(container.querySelector('.hud-timecode')).toHaveTextContent(/^\d\d:\d\d:\d\d:\d\d$/)
    expect(container.querySelector('.cinema-bars')).not.toBeNull()
  })

  it('content creation lets the viewer switch the preview format, resetting per discipline', async () => {
    const { container } = renderAt('/services/content-creation')
    await findHero('CONTENT CREATION')

    const tag = () => container.querySelector('.preview-format-tag')

    // "Reels & Short-Form" defaults to vertical.
    expect(screen.getByRole('button', { name: /9:16/ })).toHaveAttribute('aria-pressed', 'true')
    expect(tag()).toHaveTextContent('9:16 · Reels')

    fireEvent.click(screen.getByRole('button', { name: /16:9/ }))
    expect(screen.getByRole('button', { name: /16:9/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /9:16/ })).toHaveAttribute('aria-pressed', 'false')
    expect(tag()).toHaveTextContent('16:9 · Wide')

    // Moving to another discipline applies that discipline's own default format.
    fireEvent.mouseEnter(screen.getByRole('tab', { name: /Social Campaigns/ }))
    expect(tag()).toHaveTextContent('4:5 · Feed')
    expect(screen.getByRole('button', { name: /4:5/ })).toHaveAttribute('aria-pressed', 'true')
  })

  it('creative solutions shows the studio composition grid', async () => {
    const { container } = renderAt('/services/creative-solutions')
    await findHero('CREATIVE SOLUTIONS')

    expect(container.querySelector('.preview-glass-frame.is-studio')).not.toBeNull()
    expect(container.querySelectorAll('.studio-line')).toHaveLength(4)
  })

  it('redirects an unknown service to the not-found page', async () => {
    renderAt('/services/not-a-service')
    expect(await screen.findByRole('heading', { name: /final cut/i }, { timeout: 8000 })).toBeInTheDocument()
  })
})
