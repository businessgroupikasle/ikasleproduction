import { useEffect, useRef, useState } from 'react'
import { Aperture, Focus } from 'lucide-react'
import gsap from 'gsap'
import { ABOUT_FRAMES, aboutHero } from '../../data/about'
import { useFitText } from '../../hooks/useFitText'
import { Timecode } from '../page/Timecode'

/** How long each frame holds before the focus is pulled to the next one. */
const AUTO_ADVANCE_MS = 5500

const pad = (n: number) => String(n).padStart(2, '0')

export function AboutHero() {
  const containerRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = ABOUT_FRAMES.length
  const frame = ABOUT_FRAMES[active]

  useFitText(headingRef)

  // Pull focus to the next frame by itself, unless the viewer is interacting or prefers reduced motion.
  // Depending on `active` restarts the timer after a manual pull so frames never change right after a click.
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setActive((i) => (i + 1) % total), AUTO_ADVANCE_MS)
    return () => window.clearInterval(id)
  }, [paused, active, total])

  // Warm the cache so each rack-focus starts on an already-decoded image.
  useEffect(() => {
    ABOUT_FRAMES.forEach((item) => {
      const img = new Image()
      img.src = item.image
    })
  }, [])

  useEffect(() => {
    if (!containerRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.svc-pill-badge', { opacity: 0, y: 18, duration: 0.5 })
        .from('.svc-main-heading', { opacity: 0, y: 35, duration: 0.7 }, '-=0.3')
        .from('.svc-main-desc', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
        .from('.svc-meta-tag', { opacity: 0, y: 14, stagger: 0.08, duration: 0.45 }, '-=0.3')
        .from('.svc-signature-action', { opacity: 0, y: 16, duration: 0.5 }, '-=0.3')
        .from('.about-viewfinder', { opacity: 0, scale: 0.95, y: 28, duration: 0.85, clearProps: 'transform' }, '-=1.1')
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="svc-hero-section" aria-labelledby="svc-hero-heading">
      <div className="svc-hero-grid">
        <div className="svc-hero-content">
          <div className="svc-pill-badge">
            <Aperture size={14} className="svc-badge-icon" aria-hidden="true" />
            <span>{aboutHero.badge}</span>
          </div>

          <h1 ref={headingRef} id="svc-hero-heading" className="svc-main-heading">
            IDEAS, MADE <span className="about-accent">TANGIBLE.</span>
          </h1>

          <p className="svc-main-desc">{aboutHero.description}</p>

          <div className="svc-meta-tags">
            {aboutHero.metaTags.map((tag) => (
              <span key={tag} className="svc-meta-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="svc-signature-action">
            <button
              type="button"
              className="svc-signature-btn"
              onClick={() => setActive((i) => (i + 1) % total)}
              title="Pull focus to the next frame"
            >
              <Focus size={15} aria-hidden="true" />
              <span>Pull Focus</span>
            </button>
            <span className="svc-signature-note">{aboutHero.focusNote}</span>
          </div>
        </div>

        {/* Right column: viewfinder */}
        <div
          className="about-viewfinder"
          data-paused={paused}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="about-vf-top">
            <span className="about-vf-frame">
              <Focus size={13} className="accent" aria-hidden="true" />
              FRAME {pad(active + 1)} / {pad(total)}
            </span>
            <span className="hud-badge-rec">
              <span className="hud-rec-dot" aria-hidden="true" />
              <span>
                REC <Timecode />
              </span>
            </span>
          </div>

          <div className="about-vf-viewport">
            {ABOUT_FRAMES.map((item, i) => (
              <img
                key={item.id}
                src={item.image}
                alt={i === active ? item.alt : ''}
                aria-hidden={i !== active}
                className={`about-vf-img ${i === active ? 'is-active' : ''}`}
                style={item.focus ? { objectPosition: item.focus } : undefined}
                loading="eager"
              />
            ))}
            <div className="about-vf-shade" aria-hidden="true" />

            <div className="about-vf-hud" aria-hidden="true">
              <div className="preview-hud-corner top-left" />
              <div className="preview-hud-corner top-right" />
              <div className="preview-hud-corner bottom-left" />
              <div className="preview-hud-corner bottom-right" />
              {/* Re-mounted on every pull so the bracket re-acquires focus. */}
              <div key={active} className="about-focus-bracket">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>

            <div key={frame.id} className="about-vf-caption" aria-live="polite">
              <span className="about-vf-label">{frame.label}</span>
              <span className="about-vf-text">{frame.caption}</span>
            </div>
          </div>

          <div className="about-vf-bottom" role="group" aria-label="Choose a frame">
            {ABOUT_FRAMES.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className={`about-vf-tick ${i === active ? 'is-active' : ''}`}
                aria-pressed={i === active}
                aria-label={`Frame ${i + 1}: ${item.label}`}
                onClick={() => setActive(i)}
              >
                {/* Countdown to the next pull. The key restarts it together with the timer after a pause. */}
                <span className="about-vf-tick-bar" aria-hidden="true">
                  <i key={paused ? 'paused' : 'running'} />
                </span>
                <span className="about-vf-tick-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
