import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Layers, Volume2 } from 'lucide-react'
import gsap from 'gsap'
import type { ServiceDetailConfig, SignatureEffect } from '../../data/serviceDetails'
import { useFitText } from '../../hooks/useFitText'
import { FX_DURATION, FX_SOUND } from '../../utils/serviceFx'
import { ServiceFx } from './ServiceFx'

export function ServiceHero({ config }: { config: ServiceDetailConfig }) {
  const containerRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const fxTimer = useRef<number | undefined>(undefined)
  const [fx, setFx] = useState<{ effect: SignatureEffect; run: number } | null>(null)

  const { signature } = config
  const BadgeIcon = config.badgeIcon
  const SignatureIcon = signature.icon

  useFitText(headingRef)

  const handleSignature = () => {
    FX_SOUND[signature.effect]()
    window.clearTimeout(fxTimer.current)
    // A new `run` re-mounts the overlay so rapid repeat clicks replay the animation.
    setFx((prev) => ({ effect: signature.effect, run: (prev?.run ?? 0) + 1 }))
    fxTimer.current = window.setTimeout(() => setFx(null), FX_DURATION[signature.effect])
  }

  useEffect(() => () => window.clearTimeout(fxTimer.current), [])

  useEffect(() => {
    if (!containerRef.current) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.svc-pill-badge', { opacity: 0, y: 18, duration: 0.5 })
        .from('.svc-main-heading', { opacity: 0, y: 35, duration: 0.7 }, '-=0.3')
        .from('.svc-main-desc', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
        .from('.svc-meta-tag', { opacity: 0, y: 14, stagger: 0.08, duration: 0.45 }, '-=0.3')
        .from('.svc-signature-action', { opacity: 0, y: 16, duration: 0.5 }, '-=0.3')
        // clearProps hands transforms back to CSS afterwards so the :hover lift/slide still works.
        .from('.deliverables-glass-card', { opacity: 0, scale: 0.96, y: 25, duration: 0.75, clearProps: 'transform' }, '-=0.9')
        .from('.deliverable-item', { opacity: 0, x: 18, stagger: 0.12, duration: 0.55, clearProps: 'transform' }, '-=0.45')
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="svc-hero-section" aria-labelledby="svc-hero-heading">
      {/* Portalled to <body>: the hero is its own stacking context, which would otherwise
          keep the header (and later sections) painting above the full-screen effect. */}
      {fx && createPortal(<ServiceFx key={fx.run} effect={fx.effect} />, document.body)}

      <div className="svc-hero-grid">
        {/* Left Column: Heading & Content */}
        <div className="svc-hero-content">
          <div className="svc-pill-badge">
            <BadgeIcon size={14} className="svc-badge-icon" aria-hidden="true" />
            <span>{config.badge}</span>
          </div>

          <h1 ref={headingRef} id="svc-hero-heading" className="svc-main-heading">
            {config.title}
          </h1>

          <p className="svc-main-desc">{config.description}</p>

          <div className="svc-meta-tags">
            {config.metaTags.map((tag) => (
              <span key={tag} className="svc-meta-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="svc-signature-action">
            <button
              type="button"
              className="svc-signature-btn"
              onClick={handleSignature}
              aria-label={signature.ariaLabel}
              title={signature.hint}
            >
              <SignatureIcon size={15} aria-hidden="true" />
              <span>{signature.label}</span>
              <span className="svc-signature-badge">
                <Volume2 size={10} style={{ display: 'inline', marginRight: 2 }} aria-hidden="true" />
                Audio
              </span>
            </button>
            <span className="svc-signature-note">{signature.note}</span>
          </div>
        </div>

        {/* Right Column: Possible Deliverables Card */}
        <div className="svc-deliverables-wrap">
          <div className="deliverables-glass-card">
            <div className="deliverables-card-ambient" aria-hidden="true" />

            <div className="deliverables-card-top">
              <div className="deliverables-title-group">
                <div className="deliverables-icon-badge" aria-hidden="true">
                  <Layers size={18} />
                </div>
                <p className="eyebrow">POSSIBLE DELIVERABLES</p>
              </div>
              <span className="deliverables-status-pill">FULL SCOPE</span>
            </div>

            <ul className="deliverables-items-list" aria-label="Possible deliverables">
              {config.deliverables.map((item) => (
                <li key={item.title} className="deliverable-item">
                  <div className="deliverable-check-wrap" aria-hidden="true">
                    <Check size={15} />
                  </div>
                  <div className="deliverable-text-content">
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="deliverables-card-footer">
              <div className="deliverables-footnote">
                <span className="deliverables-dot-pulse" aria-hidden="true" />
                <span>{config.deliverablesFootnote}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
