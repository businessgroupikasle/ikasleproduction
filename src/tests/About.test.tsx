import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../app/App'
import { ABOUT_FRAMES, ABOUT_PRINCIPLES } from '../data/about'
import { process as steps } from '../data/site'

function renderAbout() {
  return render(
    <MemoryRouter initialEntries={['/about']}>
      <App />
    </MemoryRouter>,
  )
}

// Pages are lazy-loaded, so the first lookup can be slow on a cold module cache or a busy machine.
const findHero = () => screen.findByRole('heading', { level: 1, name: 'IDEAS, MADE TANGIBLE.' }, { timeout: 8000 })

describe('About page', () => {
  it('renders the hero heading, description and studio disciplines', async () => {
    renderAbout()

    expect(await findHero()).toBeInTheDocument()
    expect(screen.getByText('ABOUT / THE STUDIO')).toBeInTheDocument()
    expect(
      screen.getByText(/brings photography, filmmaking, content, and creative thinking together under one production-minded approach/i),
    ).toBeInTheDocument()
    for (const tag of ['Photography', 'Filmmaking', 'Content', 'Creative Thinking']) {
      expect(screen.getAllByText(tag).length).toBeGreaterThan(0)
    }
  })

  it('renders the manifesto statement, both paragraphs and the three principles', async () => {
    renderAbout()
    await findHero()

    expect(
      screen.getByRole('heading', { level: 2, name: 'Creative thinking belongs close to the camera.' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/We shape work from the first conversation through delivery/i)).toBeInTheDocument()
    expect(screen.getByText(/Our role can begin with a defined brief or a blank page/i)).toBeInTheDocument()

    const principles = within(screen.getByRole('list', { name: 'How we think' })).getAllByRole('listitem')
    expect(principles).toHaveLength(ABOUT_PRINCIPLES.length)
    for (const principle of ABOUT_PRINCIPLES) {
      expect(screen.getByRole('heading', { level: 3, name: principle.title })).toBeInTheDocument()
    }
  })

  it('shows all six process stages as film frames', async () => {
    renderAbout()
    await findHero()

    const strip = screen.getByRole('region', { name: /project process/i })
    const frames = within(strip).getAllByRole('listitem')
    expect(frames).toHaveLength(steps.length)
    for (const [index, title] of steps) {
      expect(within(strip).getByRole('heading', { level: 3, name: title })).toBeInTheDocument()
      expect(within(strip).getByText(index)).toBeInTheDocument()
    }
  })

  it('ends with the call to action', async () => {
    renderAbout()
    await findHero()

    expect(
      screen.getByRole('heading', { level: 2, name: "BRING US THE SPARK. WE'LL BUILD THE FRAME." }),
    ).toBeInTheDocument()
    const main = within(screen.getByRole('main'))
    expect(main.getByRole('link', { name: /Start a project/i })).toHaveAttribute('href', '/contact')
    expect(main.getByRole('link', { name: /See What We Make/i })).toHaveAttribute('href', '/services')
  })

  it('leaves nothing hidden when the viewer prefers reduced motion', async () => {
    const { container } = renderAbout()
    await findHero()

    expect(container.querySelectorAll('[data-reveal-state="hidden"]')).toHaveLength(0)
  })
})

describe('About hero viewfinder', () => {
  const label = () => screen.getByText(/^FRAME \d\d \/ \d\d$/).textContent
  const activeImages = () => document.querySelectorAll('.about-vf-img.is-active')

  it('starts on the first frame and pulls focus to the next one on click', async () => {
    renderAbout()
    await findHero()

    expect(label()).toBe(`FRAME 01 / ${String(ABOUT_FRAMES.length).padStart(2, '0')}`)
    expect(activeImages()).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: /Pull Focus/i }))
    expect(label()).toMatch(/^FRAME 02/)
    expect(screen.getByText(ABOUT_FRAMES[1].caption)).toBeInTheDocument()

    // Wraps back to the first frame after the last.
    fireEvent.click(screen.getByRole('button', { name: /Pull Focus/i }))
    fireEvent.click(screen.getByRole('button', { name: /Pull Focus/i }))
    expect(label()).toMatch(/^FRAME 01/)
  })

  it('exposes only the active frame to assistive tech and lets viewers pick a frame', async () => {
    renderAbout()
    await findHero()

    fireEvent.click(screen.getByRole('button', { name: `Frame 3: ${ABOUT_FRAMES[2].label}` }))

    expect(label()).toMatch(/^FRAME 03/)
    expect(screen.getByRole('button', { name: `Frame 3: ${ABOUT_FRAMES[2].label}` })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: `Frame 1: ${ABOUT_FRAMES[0].label}` })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByAltText(ABOUT_FRAMES[2].alt)).toBeInTheDocument()
    expect(screen.queryByAltText(ABOUT_FRAMES[0].alt)).toBeNull()
  })

  describe('autoplay (motion allowed)', () => {
    const originalMatchMedia = window.matchMedia

    afterEach(() => {
      vi.useRealTimers()
      Object.defineProperty(window, 'matchMedia', { writable: true, value: originalMatchMedia })
    })

    it('pulls focus by itself, and pauses while the viewer is hovering', async () => {
      // The shared test setup reports reduced motion; this test needs motion allowed.
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => undefined,
          removeListener: () => undefined,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
          dispatchEvent: () => false,
        }),
      })

      renderAbout()
      await findHero()
      vi.useFakeTimers()

      // The page's own interval was created with real timers. Hovering and leaving re-creates it
      // (the effect depends on the paused state), this time under the fake clock.
      const viewfinder = document.querySelector('.about-viewfinder') as HTMLElement
      fireEvent.mouseEnter(viewfinder)
      fireEvent.mouseLeave(viewfinder)

      expect(label()).toMatch(/^FRAME 01/)
      act(() => {
        vi.advanceTimersByTime(5600)
      })
      expect(label()).toMatch(/^FRAME 02/)

      // Hovering the viewfinder holds the current frame.
      fireEvent.mouseEnter(viewfinder)
      act(() => {
        vi.advanceTimersByTime(12000)
      })
      expect(label()).toMatch(/^FRAME 02/)

      // Leaving resumes it.
      fireEvent.mouseLeave(viewfinder)
      act(() => {
        vi.advanceTimersByTime(5600)
      })
      expect(label()).toMatch(/^FRAME 03/)
    })
  })

  it('does not advance on its own for reduced-motion viewers', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] })
    try {
      renderAbout()
      await act(async () => {
        await vi.dynamicImportSettled()
      })
      await findHero()
      act(() => {
        vi.advanceTimersByTime(20000)
      })
      expect(label()).toMatch(/^FRAME 01/)
    } finally {
      vi.useRealTimers()
    }
  })
})
