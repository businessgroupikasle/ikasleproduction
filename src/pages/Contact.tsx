import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router'
import {
  Camera,
  Check,
  ChevronDown,
  Clapperboard,
  Copy,
  Film,
  Lightbulb,
  Mail,
  MapPin,
  Send,
  Share2,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { usePageSEO } from '../hooks/usePageMeta'
import { PAGE_SEO } from '../data/seo'
import { ButtonLink } from '../components/ui/ButtonLink'
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon'
import {
  playCameraShutterSound,
  playClapperActionSound,
} from '../utils/cameraShutter'

const SERVICES_OPTIONS = [
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'video-production', label: 'Video Production', icon: Clapperboard },
  { id: 'content-creation', label: 'Content Creation', icon: Share2 },
  { id: 'creative-solutions', label: 'Creative Solutions', icon: Lightbulb },
  { id: 'full-package', label: 'Full Campaign', icon: Film },
] as const

const TIMELINE_OPTIONS = [
  'Flexible / In Planning',
  'Immediate (< 2 Weeks)',
  'Next Month (3–4 Weeks)',
  '2–3 Months Out',
] as const

const BUDGET_OPTIONS = [
  'Growth / Brand (₹1.5L – ₹5L)',
  'Emerging (< ₹1.5L)',
  'Cinema Commercial (₹5L – ₹15L)',
  'Flagship / Multi-City (₹15L+)',
  'Let\'s Discuss Scope',
] as const

const FAQ_ITEMS = [
  {
    q: 'How early should we book our production dates?',
    a: 'For commercial films, multi-day campaigns, and complex studio setups, we recommend reaching out 3 to 6 weeks in advance to allow adequate pre-production time. We also maintain rapid-response teams for urgent brand needs.',
  },
  {
    q: 'Do you provide complete end-to-end production crews and equipment?',
    a: 'Yes. IKASLÉ Productions operates a full-service infrastructure: directors, DPs, gaffers, sound engineers, studio soundstages, ARRI/RED cinema camera packages, anamorphic glass, and in-house DaVinci Resolve color grading suites.',
  },
  {
    q: 'Can we commission photography and video production together?',
    a: 'Absolutely. A large portion of our work consists of synchronized dual-discipline shoots—capturing the master commercial film while shooting high-res editorial stills on the same set with unified art direction.',
  },
  {
    q: 'How does the post-production review and delivery process work?',
    a: 'We deliver offline rough cuts via private frame-accurate review links with timestamped commentary. Once approved, our suite executes color grading, Dolby Atmos/stereo sound mix, and exports to all platform aspect ratios.',
  },
  {
    q: 'Do you travel on location outside your base cities?',
    a: 'Yes. While our primary production hub and soundstages are located in Coimbatore, our directors and crews travel worldwide for on-location filming and commercial brand shoots.',
  },
]

interface SubmittedSlate {
  refId: string
  name: string
  email: string
  phone: string
  service: string
  timeline: string
  budget: string
  date: string
}

export default function Contact() {
  usePageSEO(PAGE_SEO.contact)

  const [searchParams] = useSearchParams()
  const initialService = searchParams.get('service') ?? 'video-production'
  const initialDiscipline = searchParams.get('discipline') ?? ''

  // Form states
  const [selectedService, setSelectedService] = useState<string>(initialService)
  const [selectedTimeline, setSelectedTimeline] = useState<string>(TIMELINE_OPTIONS[0])
  const [selectedBudget, setSelectedBudget] = useState<string>(BUDGET_OPTIONS[0])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [brand, setBrand] = useState('')
  const [link, setLink] = useState('')
  const [showLinkField, setShowLinkField] = useState(false)
  const [message, setMessage] = useState(() =>
    initialDiscipline
      ? `Hi IKASLÉ team, we would like to enquire about commissioned production for your ${initialDiscipline} discipline.`
      : ''
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedSlate, setSubmittedSlate] = useState<SubmittedSlate | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [faqOpen, setFaqOpen] = useState<number | null>(0)

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(label)
      setTimeout(() => setCopiedText(null), 2500)
    })
  }

  // Validate form
  const validateForm = () => {
    const errs: Record<string, string> = {}
    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Please provide your full name.'
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please provide a valid email.'
    }
    if (!phone.trim() || phone.trim().length < 7) {
      errs.phone = 'Please provide a valid contact number.'
    }
    if (!message.trim() || message.trim().length < 10) {
      errs.message = 'Please provide a brief description (min 10 characters).'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Submit handler
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    playCameraShutterSound()

    // Simulate clean cinematic transmission
    setTimeout(() => {
      setIsSubmitting(false)
      playClapperActionSound()

      const refId = `IKL-2026-${Math.floor(1000 + Math.random() * 9000)}`
      const activeServiceName =
        SERVICES_OPTIONS.find((s) => s.id === selectedService)?.label ?? selectedService

      setSubmittedSlate({
        refId,
        name,
        email,
        phone,
        service: activeServiceName,
        timeline: selectedTimeline,
        budget: selectedBudget,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      })

      window.scrollTo({ top: 320, behavior: 'smooth' })
    }, 600)
  }

  return (
    <div className="page contact-page">
      {/* Ambient Lighting Atmosphere */}
      <div className="contact-atmosphere" aria-hidden="true">
        <div className="contact-glow contact-glow-1" />
        <div className="contact-glow contact-glow-2" />
      </div>

      {/* Hero Header */}
      <header className="contact-hero">
        <div className="contact-hero-badge-row">
          <div className="contact-status-badge">
            <span className="contact-status-dot-green" aria-hidden="true" />
            <span>STUDIO STATUS: ACCEPTING SELECT 2026 COMMISSIONS</span>
          </div>
          <p className="eyebrow">COMMISSION A PRODUCTION // CONNECT</p>
        </div>

        <h1 className="contact-hero-title">
          LET'S PUT YOUR IDEA<br />
          <span className="accent">INTO FRAME.</span>
        </h1>

        <p className="contact-hero-desc">
          High-impact commercial films, editorial photography, and modular brand campaigns.
          Tell us your vision below—our directing desk responds within 24 hours.
        </p>

        {/* Direct Channels Compact Strip */}
        <div className="contact-channels-grid" aria-label="Direct studio contact options">
          {/* Email Card */}
          <div className="contact-channel-card">
            <div className="contact-channel-top">
              <span className="contact-channel-label">Direct Briefs & RFPs</span>
              <div className="contact-card-actions">
                <a
                  href="mailto:ikasleproduction@gmail.com"
                  className="contact-copy-btn"
                  title="Send email directly"
                >
                  <Mail size={12} />
                  <span>Mail</span>
                </a>
                <button
                  type="button"
                  className="contact-copy-btn"
                  onClick={() => handleCopy('ikasleproduction@gmail.com', 'email')}
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {copiedText === 'email' ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            </div>
            <div className="contact-channel-val">
              <a href="mailto:ikasleproduction@gmail.com" className="contact-val-link">
                ikasleproduction@gmail.com
              </a>
            </div>
            <p className="contact-channel-desc">
              Send treatments, decks, or direct RFP invitations.
            </p>
          </div>

          {/* Producer Desk */}
          <div className="contact-channel-card">
            <div className="contact-channel-top">
              <span className="contact-channel-label">Producer Desk & WhatsApp</span>
              <a
                href="https://wa.me/917845132962"
                target="_blank"
                rel="noreferrer"
                className="contact-copy-btn"
                title="Chat directly on WhatsApp"
              >
                <WhatsAppIcon size={12} />
                <span>WhatsApp</span>
              </a>
            </div>
            <div className="contact-channel-val">
              <a href="https://wa.me/917845132962" target="_blank" rel="noreferrer" className="contact-val-link">
                +91 78451 32962
              </a>
            </div>
            <p className="contact-channel-desc">
              Fast production scoping: Mon – Sat, 09:00 – 19:00 IST.
            </p>
          </div>

          {/* Studio Soundstage Base */}
          <div className="contact-channel-card">
            <div className="contact-channel-top">
              <span className="contact-channel-label">Production Hubs</span>
              <a
                href="https://maps.google.com/?q=Coimbatore,+Tamil+Nadu"
                target="_blank"
                rel="noreferrer"
                className="contact-copy-btn"
                title="View Coimbatore location on map"
              >
                <MapPin size={12} />
                <span>Location</span>
              </a>
            </div>
            <div className="contact-channel-val">
              <span>Coimbatore</span>
            </div>
            <p className="contact-channel-desc">
              Soundstages, cycloramas, and units deployable worldwide.
            </p>
          </div>
        </div>
      </header>

      {/* Main Form Section */}
      <section className="contact-form-section" aria-label="Interactive Production Brief">
        <div className="contact-form-layout">
          {/* Left Column: Compact Sidebar Guarantees */}
          <div className="contact-form-sidebar">
            <div>
              <p className="eyebrow" style={{ color: '#c4a2ff' }}>COMMISSIONING PROTOCOL</p>
              <h2>HOW WE DIRECT YOUR BRIEF</h2>
              <p>
                A transparent, rapid production cadence built to deliver visual power without unnecessary friction.
              </p>
            </div>

            <div className="contact-sidebar-guarantees">
              <div className="contact-guarantee-row">
                <div className="contact-guarantee-icon"><Zap size={15} /></div>
                <div className="contact-guarantee-text">
                  <h4>24-Hour Discovery Response</h4>
                  <p>Initial scoping call to align on visual tone, schedules, and deliverables.</p>
                </div>
              </div>

              <div className="contact-guarantee-row">
                <div className="contact-guarantee-icon"><Film size={15} /></div>
                <div className="contact-guarantee-text">
                  <h4>Art-Directed Visual Treatment</h4>
                  <p>Director's deck with mood boards, lighting notes, and exact cost breakdowns.</p>
                </div>
              </div>

              <div className="contact-guarantee-row">
                <div className="contact-guarantee-icon"><ShieldCheck size={15} /></div>
                <div className="contact-guarantee-text">
                  <h4>Protected Under Mutual NDA</h4>
                  <p>All scripts, concept pitches, and brand IP remain strictly confidential.</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/917845132962"
              target="_blank"
              rel="noreferrer"
              className="button button-secondary"
              style={{ minHeight: '44px', fontSize: '0.82rem', width: '100%' }}
            >
              <WhatsAppIcon size={15} /> Fast Scoping via WhatsApp
            </a>
          </div>

          {/* Right Column: Compact Form Card */}
          <div className="contact-brief-card">
            {submittedSlate ? (
              /* Success Slate (Clapperboard Confirmation) */
              <div className="contact-slate-success">
                <div className="contact-slate-clapper-stripes" aria-hidden="true" />

                <div className="contact-slate-header">
                  <div>
                    <span className="eyebrow" style={{ color: '#34d399' }}>✓ BRIEF TRANSMITTED</span>
                    <h3 style={{ margin: '0.15rem 0 0', font: '700 1.3rem var(--font-display)', color: '#ffffff' }}>
                      TRANSMISSION CONFIRMED
                    </h3>
                  </div>

                  <span className="contact-slate-ref">
                    REF {submittedSlate.refId}
                  </span>
                </div>

                <div className="contact-slate-body">
                  <p style={{ color: '#c5c1d1', margin: 0, fontSize: '0.88rem', lineHeight: 1.55 }}>
                    Thank you, <strong>{submittedSlate.name}</strong>. Your production inquiry has been routed
                    directly to our executive producer. We will review your brief and send creative treatment
                    notes to <strong>{submittedSlate.email}</strong> within 24 hours.
                  </p>

                  <div className="contact-slate-summary-box">
                    <div className="contact-slate-item">
                      <span>Service Requested</span>
                      <strong>{submittedSlate.service}</strong>
                    </div>
                    <div className="contact-slate-item">
                      <span>Timeline</span>
                      <strong>{submittedSlate.timeline}</strong>
                    </div>
                    <div className="contact-slate-item">
                      <span>Budget Tier</span>
                      <strong>{submittedSlate.budget}</strong>
                    </div>
                    <div className="contact-slate-item">
                      <span>Phone Contact</span>
                      <strong>{submittedSlate.phone}</strong>
                    </div>
                    <div className="contact-slate-item">
                      <span>Date Logged</span>
                      <strong>{submittedSlate.date}</strong>
                    </div>
                  </div>

                  <div className="contact-slate-actions">
                    <button
                      type="button"
                      className="button"
                      onClick={() => handleCopy(`IKASLÉ Brief Ref: ${submittedSlate.refId} - ${submittedSlate.name}`, 'ref')}
                    >
                      {copiedText === 'ref' ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedText === 'ref' ? 'Reference Copied!' : 'Copy Slate Reference'}</span>
                    </button>

                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => {
                        setSubmittedSlate(null)
                        setMessage('')
                      }}
                    >
                      Send Another Brief
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Compact Form */
              <form className="contact-brief-form" onSubmit={handleSubmit} noValidate>
                {/* 1. Primary Service Selection Chips */}
                <div>
                  <label className="contact-group-title">
                    <Camera size={14} className="accent" /> Primary Discipline
                  </label>
                  <div className="contact-chip-group" role="radiogroup" aria-label="Primary Discipline">
                    {SERVICES_OPTIONS.map((opt) => {
                      const Icon = opt.icon
                      const isSelected = selectedService === opt.id
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          className={`contact-chip ${isSelected ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedService(opt.id)
                            playCameraShutterSound()
                          }}
                        >
                          <Icon size={13} /> {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 2. Timeline & Budget Compact Dropdowns in One Row */}
                <div className="contact-input-grid">
                  <div className="contact-field-wrap">
                    <label className="contact-field-label" htmlFor="contact-timeline">
                      Target Timeline
                    </label>
                    <select
                      id="contact-timeline"
                      value={selectedTimeline}
                      onChange={(e) => setSelectedTimeline(e.target.value)}
                      className="contact-field-select"
                    >
                      {TIMELINE_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="contact-field-wrap">
                    <label className="contact-field-label" htmlFor="contact-budget">
                      Estimated Budget Range
                    </label>
                    <select
                      id="contact-budget"
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="contact-field-select"
                    >
                      {BUDGET_OPTIONS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Client Details */}
                <div className="contact-input-grid">
                  <div className="contact-field-wrap">
                    <label className="contact-field-label" htmlFor="contact-name">
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Maya Shankar"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`contact-field-input ${errors.name ? 'has-error' : ''}`}
                    />
                    {errors.name && <span className="contact-field-error">{errors.name}</span>}
                  </div>

                  <div className="contact-field-wrap">
                    <label className="contact-field-label" htmlFor="contact-email">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="maya@brand.com"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`contact-field-input ${errors.email ? 'has-error' : ''}`}
                    />
                    {errors.email && <span className="contact-field-error">{errors.email}</span>}
                  </div>

                  <div className="contact-field-wrap">
                    <label className="contact-field-label" htmlFor="contact-phone">
                      Phone / WhatsApp *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`contact-field-input ${errors.phone ? 'has-error' : ''}`}
                    />
                    {errors.phone && <span className="contact-field-error">{errors.phone}</span>}
                  </div>

                  <div className="contact-field-wrap">
                    <label className="contact-field-label" htmlFor="contact-brand">
                      Brand / Studio <span>(optional)</span>
                    </label>
                    <input
                      id="contact-brand"
                      type="text"
                      placeholder="e.g. Cadence Athletics"
                      autoComplete="organization"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="contact-field-input"
                    />
                  </div>

                  {/* 4. Project Brief */}
                  <div className="contact-field-wrap full-width">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="contact-field-label" htmlFor="contact-message" style={{ margin: 0 }}>
                        Project Narrative & Creative Brief *
                      </label>
                      {!showLinkField && (
                        <button
                          type="button"
                          onClick={() => setShowLinkField(true)}
                          style={{
                            background: 'transparent',
                            border: 0,
                            color: '#c4a2ff',
                            fontSize: '0.68rem',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          + Add Reference Link
                        </button>
                      )}
                    </div>
                    <textarea
                      id="contact-message"
                      required
                      rows={3}
                      placeholder="A short note on your idea, audience, references or deliverables..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`contact-field-textarea ${errors.message ? 'has-error' : ''}`}
                    />
                    {errors.message && <span className="contact-field-error">{errors.message}</span>}
                  </div>

                  {/* Optional Moodboard Link if clicked */}
                  {showLinkField && (
                    <div className="contact-field-wrap full-width">
                      <label className="contact-field-label" htmlFor="contact-link">
                        Reference / Moodboard URL
                      </label>
                      <input
                        id="contact-link"
                        type="url"
                        placeholder="https://pinterest.com/... or Vimeo / YouTube link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="contact-field-input"
                      />
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button contact-submit-btn"
                >
                  {isSubmitting ? (
                    <span>Encoding Brief Transmission...</span>
                  ) : (
                    <>
                      <span>Transmit Production Brief</span>
                      <Send size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Production FAQ Section */}
      <section className="contact-faq-section" aria-label="Frequently Asked Questions">
        <div className="contact-faq-head">
          <p className="eyebrow" style={{ color: '#c4a2ff' }}>COMMISSIONING INTELLIGENCE</p>
          <h2>PRODUCTION FAQ</h2>
          <p>
            Quick answers regarding our booking schedules, camera rigs, and post-production delivery.
          </p>
        </div>

        <div className="contact-faq-list">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = faqOpen === index
            return (
              <div
                key={index}
                className={`contact-faq-item ${isOpen ? 'is-open' : ''}`}
              >
                <button
                  type="button"
                  className="contact-faq-trigger"
                  onClick={() => setFaqOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s',
                    }}
                  />
                </button>
                {isOpen && (
                  <div className="contact-faq-content">
                    <p style={{ margin: 0 }}>{item.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Direct Scheduling Box */}
      <section className="page-cta" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <h2>
          PREFER AN IMMEDIATE<br />
          <span className="accent">DIRECTOR DISCOVERY CALL?</span>
        </h2>
        <p style={{ maxWidth: '34rem', margin: '0 auto 1.5rem', color: '#b2aec0', fontSize: '0.92rem' }}>
          Connect directly with our studio head on WhatsApp to discuss your creative brief instantly.
        </p>
        <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://wa.me/917845132962"
            target="_blank"
            rel="noreferrer"
            className="button"
            style={{ minHeight: '44px' }}
          >
            <WhatsAppIcon size={16} /> Direct WhatsApp Desk
          </a>
          <ButtonLink to="/services" secondary>
            Explore Services Matrix
          </ButtonLink>
        </div>
      </section>
    </div>
  )
}
