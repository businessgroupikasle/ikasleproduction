import type { ReactNode } from 'react'
import { ArrowUpRight, Camera, Film, Lightbulb, Mail, MapPin, Share2 } from 'lucide-react'
import { Link } from 'react-router'
import { ButtonLink } from '../ui/ButtonLink'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'

interface PageCTAProps {
  description: string
  eyebrow?: string
  /** Defaults to the shared "Let's shape the right production" headline used on service pages. */
  heading?: ReactNode
  primaryLabel?: string
  secondary?: { to: string; label: string }
}

const DEFAULT_HEADING = (
  <>
    LET'S SHAPE THE RIGHT <br />
    <span className="accent">PRODUCTION FOR YOUR IDEA.</span>
  </>
)

const STUDIO_SPECS = [
  {
    icon: Film,
    title: 'Commercial Films',
    desc: 'Cinematic treatments, multi-camera sets & final grade',
  },
  {
    icon: Camera,
    title: 'Campaign Photography',
    desc: 'Editorial lighting, product styling & high-res delivery',
  },
  {
    icon: Share2,
    title: 'Content Systems',
    desc: 'Platform-aware 9:16 cuts & modular brand series',
  },
  {
    icon: Lightbulb,
    title: 'Creative Direction',
    desc: 'Concept development, visual identity & production design',
  },
]

/** Closing call to action shared by the service detail pages and the About page. */
export function PageCTA({
  description,
  eyebrow = 'READY TO COLLABORATE',
  heading = DEFAULT_HEADING,
  primaryLabel = 'Discuss Your Project',
  secondary = { to: '/work', label: 'Explore Selected Work' },
}: PageCTAProps) {
  return (
    <section className="svc-bottom-cta-section" aria-labelledby="svc-cta-heading">
      <div className="svc-cta-ambient" aria-hidden="true" />

      <div className="svc-cta-layout" data-reveal>
        <div className="svc-cta-content">
          <p className="eyebrow svc-cta-eyebrow">{eyebrow}</p>

          <h2 id="svc-cta-heading" className="svc-cta-title">
            {heading}
          </h2>

          <p className="svc-cta-desc">{description}</p>

          <div className="svc-cta-actions">
            <ButtonLink to="/contact" className="svc-cta-btn">
              {primaryLabel}
            </ButtonLink>
            <Link to={secondary.to} className="svc-cta-secondary-link">
              {secondary.label} <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <aside className="svc-cta-side-card glass" aria-label="Studio production scope and direct desk">
          <div className="svc-cta-card-header">
            <div className="svc-cta-card-status">
              <span className="svc-cta-card-dot" aria-hidden="true" />
              <span>Production Scope & Desk</span>
            </div>
            <span className="svc-cta-card-badge">2026 Intake</span>
          </div>

          <ul className="svc-cta-specs-list" aria-label="Core production crafts">
            {STUDIO_SPECS.map((spec) => {
              const IconComponent = spec.icon
              return (
                <li key={spec.title} className="svc-cta-spec-item">
                  <div className="svc-cta-spec-icon-wrap" aria-hidden="true">
                    <IconComponent size={18} />
                  </div>
                  <div className="svc-cta-spec-body">
                    <span className="svc-cta-spec-title">{spec.title}</span>
                    <span className="svc-cta-spec-desc">{spec.desc}</span>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="svc-cta-card-channels">
            <a
              href="https://wa.me/917845132962"
              target="_blank"
              rel="noopener noreferrer"
              className="svc-cta-channel-pill"
              aria-label="Direct WhatsApp message to producer desk"
            >
              <WhatsAppIcon size={14} aria-hidden="true" />
              <span>WhatsApp: +91 78451 32962</span>
              <ArrowUpRight size={13} className="svc-cta-channel-arrow" aria-hidden="true" />
            </a>

            <a
              href="mailto:ikasleproduction@gmail.com"
              className="svc-cta-channel-pill"
              aria-label="Email studio at ikasleproduction@gmail.com"
            >
              <Mail size={14} aria-hidden="true" />
              <span>ikasleproduction@gmail.com</span>
              <ArrowUpRight size={13} className="svc-cta-channel-arrow" aria-hidden="true" />
            </a>

            <div className="svc-cta-channel-pill svc-cta-channel-static">
              <MapPin size={14} aria-hidden="true" />
              <span>Coimbatore, Tamil Nadu</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
