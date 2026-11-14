import { useRef, useState, type FormEvent } from 'react'
import { motion, useInView } from 'motion/react'
import { ArrowRight, Check, Film, Mail, MapPin, Plus } from 'lucide-react'
import { Link } from 'react-router'
import { process, projects, services } from '../../data/site'
import { revealDelay, useReveal } from '../../hooks/useReveal'
import { trackPointer } from '../../utils/pointerGlow'
import { playCapabilitySound, playFocusLockSound } from '../../utils/serviceSounds'
import { Marquee } from '../fx/Marquee'
import { SplitTitle } from '../fx/SplitTitle'
import { ButtonLink } from '../ui/ButtonLink'
import DomeGallery, { type DomeGalleryImage } from '../ui/DomeGallery'
import FlipCard from '../ui/FlipCard'
import PhoneInput from '../ui/PhoneInput'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'
import { validateEmail } from '../../utils/emailValidation'
import { validatePhoneNumber } from '../../utils/phoneValidation'
import '../../styles/home-gallery.css'

const CRAFT_TICKER = ['Photography', 'Video Production', 'Content Creation', 'Creative Solutions', 'Idea to final frame']
const GHOST_WORDS = ['Concept', 'Craft', 'Story', 'Impact']

const SHOWREEL_IMAGES: DomeGalleryImage[] = [
  { src: '/assets/gallery/editorial-just-do-it.jpg', alt: 'Editorial Fashion — What If It Works' },
  { src: '/assets/gallery/photographer-mirror.jpg', alt: 'Hasselblad Photography' },
  { src: '/assets/gallery/portrait-monochrome.jpg', alt: 'Editorial Portrait — Monochrome' },
  { src: '/assets/gallery/canon-cinema-rig.jpg', alt: 'Cinema Camera Rig' },
  { src: '/assets/gallery/creative-studio-session.jpg', alt: 'Creative Direction Mood Board' },
  { src: '/assets/projects/kinetic-brand-film.jpg', alt: 'Commercial Film Production' },
  { src: '/assets/projects/human-light.jpg', alt: 'Human / Light Photography' },
  { src: '/assets/projects/objects-in-motion.jpg', alt: 'Brand Campaigns — Cadence' },
  { src: '/assets/projects/vertical-culture.jpg', alt: 'Vertical Culture — Content Creation' },
  { src: '/assets/projects/after-dark.jpg', alt: 'Creative Productions — Collaboration' },
]

function SectionHead({ index, eyebrow, title }: { index: string; eyebrow: string; title: string }) {
  return (
    <div className="section-head">
      <p className="eyebrow section-eyebrow" data-reveal>
        {index} / {eyebrow}
      </p>
      <SplitTitle lines={[{ text: title }]} />
    </div>
  )
}

export function Showreel() {
  const sectionRef = useRef<HTMLElement>(null)
  const isNear = useInView(sectionRef, { once: true, margin: '240px' })
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

  return (
    <section id="showreel" ref={sectionRef} className="section showreel">
      <SectionHead index="01" eyebrow="Showreel" title="STORIES, SET IN MOTION." />
      <div className="reel-frame glass dome-showreel-frame" data-reveal>
        <div className="dome-gallery-container">
          {isNear ? (
            <DomeGallery
              images={SHOWREEL_IMAGES}
              fit={0.82}
              fitBasis="min"
              minRadius={isMobile ? 180 : 260}
              maxRadius={isMobile ? 420 : 640}
              segments={isMobile ? 16 : 35}
              overlayBlurColor="#08080d"
              grayscale={false}
              imageBorderRadius="18px"
              openedImageBorderRadius="24px"
              openedImageWidth="min(460px, 86vw)"
              openedImageHeight="min(460px, 86vw)"
            />
          ) : (
            <div className="dome-gallery-placeholder" style={{ minHeight: '380px' }} />
          )}
        </div>
      </div>
    </section>
  )
}

export function AboutSection() {
  return (
    <section className="section about-section">
      <Marquee className="fx-ghost" items={GHOST_WORDS} outline duration={80} reverse />
      <SectionHead index="02" eyebrow="About" title="WE TURN IDEAS INTO VISUAL EXPERIENCES." />
      <div className="about-grid">
        <p className="about-lede" data-reveal>
          Based in Coimbatore, IKASLÉ is a leading creative production studio for commercial photography, cinematic brand films, modular digital content, and visionary art direction.
        </p>
        <div className="about-panel glass" data-reveal style={revealDelay(2)} onPointerMove={trackPointer}>
          <span className="fx-spot" aria-hidden="true" />
          <span>COIMBATORE HUB & REGIONAL PRODUCTION</span>
          <p>
            From our dedicated production base in Coimbatore to on-location crews across Tamil Nadu and South India, we unite concept, cinema cameras, and master-grade finishing into one disciplined workflow.
          </p>
          <ButtonLink to="/about" secondary>
            Meet the studio
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

export function ServicesSection() {
  return (
    <section className="section capabilities-section">
      <SectionHead index="03" eyebrow="Capabilities" title="BUILT TO MAKE IDEAS VISIBLE." />
      <div className="service-grid">
        {services.map((service, serviceIndex) => {
          const Icon = service.icon
          return (
            <div key={service.slug} className="service-grid-cell" data-reveal style={revealDelay(serviceIndex)}>
              <FlipCard
                width="100%"
                height={410}
                radius={24}
                tiltMax={10}
                glareOpacity={0.22}
                shadowColor="#8b5cf6"
                shadowOpacity={0.16}
                focusPoint
                onHoverStart={playFocusLockSound}
                onFlipChange={() => playCapabilitySound(service.slug)}
                front={
                  <div className="service-flip-face">
                    <div className="service-flip-top">
                      <span className="card-index">{service.index}</span>
                      <span className="service-flip-cue">Click to flip</span>
                    </div>
                    <div className="service-flip-body">
                      <Icon size={32} aria-hidden="true" />
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                    </div>
                    <div className="service-flip-bottom">
                      <span>Explore details</span>
                      <ArrowRight size={15} />
                    </div>
                  </div>
                }
                back={
                  <div className="service-flip-back">
                    <div className="service-flip-top">
                      <span className="card-index">{service.index} / Overview</span>
                      <span className="service-flip-cue">Flip back</span>
                    </div>
                    <div>
                      <h4 className="accent">{service.title}</h4>
                      <p className="service-card-detail">{service.detail}</p>
                    </div>
                    <Link
                      to={`/services/${service.slug}`}
                      className="service-flip-link"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Explore ${service.title}`}
                    >
                      Explore service <ArrowRight size={15} />
                    </Link>
                  </div>
                }
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function WorkSection() {
  return (
    <section className="section work-section">
      <SectionHead index="04" eyebrow="Selected work" title="OUR WORK SPEAKS IN FRAMES." />
      <p className="sample-label">CONCEPTUAL SAMPLE PROJECTS — REPLACE WITH APPROVED WORK</p>
      <div className="gallery-wrap">
        <div className="gallery-grid">
          {projects.map((project, index) => {
            const image = 'image' in project ? (project.image as string) : undefined
            return (
              <Link
                className={`gallery-tile project-${project.tone} ${image ? 'project-has-media' : ''}`}
                key={project.slug}
                to={`/work/${project.slug}`}
                data-reveal
                style={revealDelay(index)}
                onPointerMove={trackPointer}
              >
                {image ? (
                  <img src={image} alt="" className="gallery-tile-img" loading="lazy" decoding="async" draggable={false} />
                ) : (
                  <>
                    <span className="project-grain" />
                    <span className="project-symbol">
                      <Film />
                    </span>
                  </>
                )}
                <span className="gallery-tile-shade" aria-hidden="true" />
                <span className="fx-spot" aria-hidden="true" />
                <span className="gallery-tile-plus" aria-hidden="true">
                  <Plus size={24} strokeWidth={2.2} />
                </span>
                <div className="gallery-tile-caption">
                  <div className="gallery-tile-meta">
                    <small>{project.category}</small>
                    <span className="gallery-tile-year">{project.year}</span>
                  </div>
                  <h3>{project.title}</h3>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <ButtonLink to="/portfolio" secondary>
        Explore full portfolio
      </ButtonLink>
    </section>
  )
}

export function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, margin: '-20%' })
  return (
    <section className="section process-section">
      <SectionHead index="05" eyebrow="Process" title="FROM THE FIRST IDEA TO THE FINAL FRAME." />
      <div className="process-list" ref={ref}>
        <span className={`process-line ${visible ? 'is-visible' : ''}`} />
        {process.map(([index, title, text]) => (
          <motion.article
            key={index}
            initial={{ opacity: 0, x: -18 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: Number(index) * 0.08 }}
          >
            <span>{index}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export function Statement() {
  return (
    <section className="statement" aria-label="Creative statement">
      <div className="statement-glow" />
      <div className="fx-ripples" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="statement-grid">
        <div className="statement-copy">
          <p data-reveal>EVERY FRAME.</p>
          <p data-reveal style={revealDelay(2)}>
            EVERY DETAIL.
          </p>
          <p data-reveal style={revealDelay(4)}>
            EVERY STORY.
          </p>
          <p className="accent" data-reveal style={revealDelay(6)}>
            MATTERS.
          </p>
        </div>

        <div className="statement-visual" data-reveal style={revealDelay(3)}>
          <div className="statement-frame glass">
            <img
              src="/assets/services/video-production/cine-smoke.jpg"
              alt="Cinematic camera on set at Coimbatore soundstage"
              className="statement-img"
              loading="lazy"
            />
            <div className="statement-frame-overlay" aria-hidden="true" />
            <div className="statement-frame-hud" aria-hidden="true">
              <div className="statement-hud-top">
                <span className="statement-hud-rec">
                  <span className="statement-rec-dot" />
                  <span>REC · 24 FPS</span>
                </span>
                <span className="statement-hud-tag">4K ANAMORPHIC</span>
              </div>
              <div className="statement-hud-bottom">
                <span className="statement-hud-title">COIMBATORE SOUNDSTAGE</span>
                <span className="statement-hud-tc">TC 00:04:18:22</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const CLIENT_COMPANIES = [
  {
    name: 'Aero Dynamics',
    sector: 'Automotive & Velocity',
    logo: (
      <svg viewBox="0 0 48 48" fill="none" className="client-svg" aria-hidden="true">
        <path d="M8 36L24 10L40 36L24 28L8 36Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M24 10V28" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    name: 'Cadence',
    sector: 'High-Performance Athletics',
    logo: (
      <svg viewBox="0 0 48 48" fill="none" className="client-svg" aria-hidden="true">
        <circle cx="16" cy="24" r="10" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="32" cy="24" r="10" stroke="currentColor" strokeWidth="2.4" />
        <path d="M16 14C20 18 28 18 32 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M16 34C20 30 28 30 32 34" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Lumina Luxury',
    sector: 'Haute Horlogerie & Fashion',
    logo: (
      <svg viewBox="0 0 48 48" fill="none" className="client-svg" aria-hidden="true">
        <path d="M24 6L28.5 19.5L42 24L28.5 28.5L24 42L19.5 28.5L6 24L19.5 19.5L24 6Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="3.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Vanguard',
    sector: 'Industrial Design & Hardware',
    logo: (
      <svg viewBox="0 0 48 48" fill="none" className="client-svg" aria-hidden="true">
        <path d="M10 12L24 38L38 12" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 12L24 28L32 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Pulse Media',
    sector: 'Streaming & Digital Platforms',
    logo: (
      <svg viewBox="0 0 48 48" fill="none" className="client-svg" aria-hidden="true">
        <rect x="8" y="20" width="4" height="8" rx="2" fill="currentColor" />
        <rect x="16" y="14" width="4" height="20" rx="2" fill="currentColor" />
        <rect x="24" y="8" width="4" height="32" rx="2" fill="currentColor" />
        <rect x="32" y="16" width="4" height="16" rx="2" fill="currentColor" />
        <rect x="40" y="22" width="4" height="4" rx="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Aether Cinema',
    sector: 'Feature Films & Narrative',
    logo: (
      <svg viewBox="0 0 48 48" fill="none" className="client-svg" aria-hidden="true">
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.4" />
        <path d="M14 18L30 14L34 30L18 34L14 18Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="3.5" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: 'Kinetix Studios',
    sector: 'Broadcast VFX & Technology',
    logo: (
      <svg viewBox="0 0 48 48" fill="none" className="client-svg" aria-hidden="true">
        <path d="M24 8L38 16V32L24 40L10 32V16L24 8Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M24 8V40" stroke="currentColor" strokeWidth="2" />
        <path d="M10 16L38 32" stroke="currentColor" strokeWidth="2" />
        <path d="M38 16L10 32" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: 'Solaria',
    sector: 'Clean Tech & Innovation',
    logo: (
      <svg viewBox="0 0 48 48" fill="none" className="client-svg" aria-hidden="true">
        <circle cx="24" cy="24" r="9" stroke="currentColor" strokeWidth="2.4" />
        <path d="M24 6V11M24 37V42M6 24H11M37 24H42M11.3 11.3L14.8 14.8M33.2 33.2L36.7 36.7M11.3 36.7L14.8 33.2M33.2 14.8L36.7 11.3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    ),
  },
]

export function ClientsSection() {
  return (
    <section id="clients" className="section clients-section">
      <SectionHead index="06" eyebrow="Our Clients" title="TRUSTED BY VISIONARY BRANDS." />
      <p className="clients-lede" data-reveal>
        From commercial brand campaigns to cinematic documentaries, we partner with industry-leading brands, creative agencies, and forward-thinking enterprises across India and worldwide.
      </p>
      <div className="clients-grid" data-reveal style={revealDelay(1)}>
        {CLIENT_COMPANIES.map((client) => (
          <div
            key={client.name}
            className="client-card glass"
            onPointerMove={trackPointer}
          >
            <div className="client-card-inner">
              <div className="client-logo-wrap" aria-label={`${client.name} logo`}>
                {client.logo}
              </div>
              <div className="client-info">
                <span className="client-name">{client.name}</span>
                <span className="client-sector">{client.sector}</span>
              </div>
              <div className="client-verified-tag">
                <Check size={11} aria-hidden="true" />
                <span>Verified Client</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

type FormStatus = 'idle' | 'submitting' | 'invalid' | 'success' | 'error'

export function ContactSection() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')
  const [phoneCountry, setPhoneCountry] = useState<string>('IN')
  const [phone, setPhone] = useState<string>('')
  const [phoneError, setPhoneError] = useState<string>('')
  const [service, setService] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget

    setEmailError('')
    setPhoneError('')
    setErrorMessage('')
    setSuccessMessage('')

    const emailValidation = validateEmail(email)
    const phoneValidation = validatePhoneNumber(phone, phoneCountry, false)

    if (!form.checkValidity() || !emailValidation.isValid || !phoneValidation.isValid) {
      setStatus('invalid')
      if (!emailValidation.isValid) {
        setEmailError(emailValidation.message || 'Please enter a valid email address.')
      }
      if (!phoneValidation.isValid) {
        setPhoneError(phoneValidation.message || 'Please enter a valid phone number.')
      }
      setErrorMessage(
        (!emailValidation.isValid && emailValidation.message) ||
        (!phoneValidation.isValid && phoneValidation.message) ||
        'Please complete the required fields with valid information.'
      )
      return
    }

    setStatus('submitting')

    const formattedPhone = phoneValidation.formatted || phone.trim()
    const refId = `IKL-2026-${Math.floor(1000 + Math.random() * 9000)}`

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: formattedPhone,
          discipline: service || 'Production Inquiry',
          message: message.trim(),
          referenceId: refId,
        }),
      })

      const data = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null

      if (!response.ok || data?.success !== true) {
        throw new Error(
          data?.message ||
            'Unable to submit brief right now. Please try again or email ikasleproduction@gmail.com directly.'
        )
      }

      setStatus('success')
      setSuccessMessage(
        data?.message ||
          'Your project brief has been submitted successfully! We will get back to you shortly.'
      )

      // Automatically clear form fields on confirmed submission
      setName('')
      setEmail('')
      setPhone('')
      setService('')
      setMessage('')
      setEmailError('')
      setPhoneError('')
    } catch (err) {
      setStatus('error')
      const msg =
        err instanceof Error && err.message
          ? err.message
          : 'Unable to submit brief right now. Please try again or email ikasleproduction@gmail.com directly.'
      setErrorMessage(msg)
      // Entered details (name, email, phone, service, message) are retained for retrying
    }
  }

  return (
    <section className="section contact-section">
      <div className="fx-ripples fx-ripples-end" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <SectionHead index="07" eyebrow="Contact" title="LET'S CREATE SOMETHING UNFORGETTABLE." />
      <div className="contact-layout">
        <div className="contact-info-col" data-reveal>
          <p className="contact-lede">Tell us what you want to make, who it needs to move, and where it needs to live.</p>
          <p className="muted">
            Visit our studio base in Coimbatore, Tamil Nadu, or collaborate with our production crew deployable across South India and worldwide.
          </p>

          <div className="contact-direct-cards">
            <div className="contact-direct-card glass">
              <div className="contact-direct-icon" aria-hidden="true">
                <MapPin size={18} />
              </div>
              <div className="contact-direct-body">
                <span className="contact-direct-label">STUDIO BASE</span>
                <strong className="contact-direct-value">1639/ A, 2nd Floor, Hopes, Coimbatore, India- 641004</strong>
                <span className="contact-direct-sub">Soundstages & on-location units deployable across South India & worldwide</span>
              </div>
            </div>

            <a
              href="https://wa.me/917845132962"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-direct-card contact-direct-link glass"
            >
              <div className="contact-direct-icon" aria-hidden="true">
                <WhatsAppIcon size={18} />
              </div>
              <div className="contact-direct-body">
                <span className="contact-direct-label">PRODUCER DESK & WHATSAPP</span>
                <strong className="contact-direct-value">+91 78451 32962</strong>
                <span className="contact-direct-sub">Mon – Sat, 09:00 – 19:00 IST · Instant Treatment Scoping</span>
              </div>
            </a>

            <a
              href="mailto:ikasleproduction@gmail.com"
              className="contact-direct-card contact-direct-link glass"
            >
              <div className="contact-direct-icon" aria-hidden="true">
                <Mail size={18} />
              </div>
              <div className="contact-direct-body">
                <span className="contact-direct-label">DIRECT BRIEFS & RFPS</span>
                <strong className="contact-direct-value">ikasleproduction@gmail.com</strong>
                <span className="contact-direct-sub">Send treatments, decks & commercial campaign briefs</span>
              </div>
            </a>
          </div>
        </div>
        <form className="contact-form glass" onSubmit={submit} noValidate data-reveal style={revealDelay(2)}>
          <label>
            Name
            <input
              name="name"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (status === 'invalid' || status === 'error') setStatus('idle')
              }}
            />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
              title="Please enter a valid email address (e.g. name@domain.com)"
              value={email}
              className={emailError ? 'has-error' : ''}
              onChange={(e) => {
                const val = e.target.value
                setEmail(val)
                const atIdx = val.indexOf('@')
                const dotIdx = val.lastIndexOf('.')
                if (atIdx > 0 && dotIdx > atIdx + 1 && dotIdx < val.length - 1) {
                  const res = validateEmail(val)
                  setEmailError(res.isValid ? '' : res.message || 'Please enter a valid email address.')
                } else if (emailError) {
                  const res = validateEmail(val)
                  if (res.isValid) setEmailError('')
                }
                if (status === 'invalid' || status === 'error') setStatus('idle')
              }}
              onBlur={() => {
                if (email.trim()) {
                  const res = validateEmail(email)
                  setEmailError(res.isValid ? '' : res.message || 'Please enter a valid email address.')
                }
              }}
            />
            {emailError && <span className="field-error">{emailError}</span>}
          </label>
          <label>
            Phone
            <PhoneInput
              id="home-phone"
              name="phone"
              required
              value={phone}
              countryCode={phoneCountry}
              onCountryChange={(code) => {
                setPhoneCountry(code)
                if (phone.trim()) {
                  const res = validatePhoneNumber(phone, code, false)
                  setPhoneError(res.isValid ? '' : res.message || 'Please enter a valid phone number.')
                }
              }}
              onChange={(val) => {
                setPhone(val)
                const cleanDigits = val.replace(/\D/g, '')
                if (cleanDigits.length === 0) {
                  if (phoneError) setPhoneError('')
                  return
                }

                if (phoneCountry === 'IN') {
                  if (!/^[6-9]/.test(cleanDigits)) {
                    setPhoneError('Indian mobile numbers must start with 6, 7, 8, or 9.')
                    return
                  }
                  if (cleanDigits.length === 10) {
                    const res = validatePhoneNumber(val, 'IN', false)
                    setPhoneError(res.isValid ? '' : res.message || 'Please enter a valid phone number.')
                    return
                  }
                } else if (phoneCountry === 'AE') {
                  if (!/^0?5/.test(cleanDigits)) {
                    setPhoneError('UAE mobile numbers must start with 5 (e.g. 50 123 4567).')
                    return
                  }
                  const normalized = cleanDigits.startsWith('0') ? cleanDigits.slice(1) : cleanDigits
                  if (normalized.length === 9) {
                    const res = validatePhoneNumber(val, 'AE', false)
                    setPhoneError(res.isValid ? '' : res.message || 'Please enter a valid phone number.')
                    return
                  }
                } else if (phoneCountry === 'SA') {
                  if (!/^0?5/.test(cleanDigits)) {
                    setPhoneError('Saudi mobile numbers must start with 5.')
                    return
                  }
                  const normalized = cleanDigits.startsWith('0') ? cleanDigits.slice(1) : cleanDigits
                  if (normalized.length === 9) {
                    const res = validatePhoneNumber(val, 'SA', false)
                    setPhoneError(res.isValid ? '' : res.message || 'Please enter a valid phone number.')
                    return
                  }
                } else if (phoneCountry === 'SG') {
                  if (!/^[689]/.test(cleanDigits)) {
                    setPhoneError('Singapore phone numbers must start with 6, 8, or 9.')
                    return
                  }
                  if (cleanDigits.length === 8) {
                    const res = validatePhoneNumber(val, 'SG', false)
                    setPhoneError(res.isValid ? '' : res.message || 'Please enter a valid phone number.')
                    return
                  }
                }

                if (phoneError) {
                  setPhoneError('')
                }
                if (status === 'invalid' || status === 'error') setStatus('idle')
              }}
              onBlur={() => {
                const res = validatePhoneNumber(phone, phoneCountry, false)
                setPhoneError(res.isValid ? '' : res.message || 'Please enter a valid phone number.')
              }}
              error={phoneError}
            />
          </label>
          <label>
            Service
            <select
              name="service"
              required
              value={service}
              onChange={(e) => {
                setService(e.target.value)
                if (status === 'invalid' || status === 'error') setStatus('idle')
              }}
            >
              <option value="" disabled>
                Select a service
              </option>
              {services.map((s) => (
                <option key={s.slug} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </label>
          <label className="full">
            Project description
            <textarea
              name="message"
              rows={5}
              required
              minLength={20}
              placeholder="A little about your idea, audience, timing and deliverables…"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                if (status === 'invalid' || status === 'error') setStatus('idle')
              }}
            />
          </label>
          <button className="button full" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Submitting brief…' : <>Send project brief <ArrowRight size={17} /></>}
          </button>
          {(status === 'invalid' || status === 'error') && (
            <p className="form-message error">{errorMessage || 'Please complete the required fields with valid information.'}</p>
          )}
          {status === 'success' && (
            <p className="form-message success">
              <Check size={16} /> {successMessage || 'Your project brief has been submitted successfully! We will get back to you shortly.'}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export function HomeContent() {
  const flowRef = useRef<HTMLDivElement>(null)
  useReveal(flowRef)

  return (
    <div ref={flowRef} className="home-flow">
      <Marquee className="fx-band" items={CRAFT_TICKER} duration={52} />
      <Showreel />
      <AboutSection />
      <ServicesSection />
      <WorkSection />
      <ProcessSection />
      <Statement />
      <ClientsSection />
      <ContactSection />
    </div>
  )
}

