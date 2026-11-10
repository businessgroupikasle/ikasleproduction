import { useRef, useState, type FormEvent } from 'react'
import { motion, useInView } from 'motion/react'
import { ArrowRight, Check, Clock, Film, Mail, MapPin, Plus, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { process, projects, services } from '../../data/site'
import { revealDelay, useReveal } from '../../hooks/useReveal'
import { trackPointer } from '../../utils/pointerGlow'
import { Marquee } from '../fx/Marquee'
import { SplitTitle } from '../fx/SplitTitle'
import { ButtonLink } from '../ui/ButtonLink'
import DomeGallery, { type DomeGalleryImage } from '../ui/DomeGallery'
import FlipCard from '../ui/FlipCard'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'
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
  return (
    <section id="showreel" className="section showreel">
      <SectionHead index="02" eyebrow="Showreel" title="STORIES, SET IN MOTION." />
      <div className="reel-frame glass dome-showreel-frame" data-reveal>
        <div className="dome-gallery-container">
          <DomeGallery
            images={SHOWREEL_IMAGES}
            fit={0.82}
            fitBasis="min"
            minRadius={260}
            maxRadius={640}
            overlayBlurColor="#08080d"
            grayscale={false}
            imageBorderRadius="18px"
            openedImageBorderRadius="24px"
            openedImageWidth="min(460px, 86vw)"
            openedImageHeight="min(460px, 86vw)"
          />
        </div>
      </div>
    </section>
  )
}

export function AboutSection() {
  return (
    <section className="section about-section">
      <Marquee className="fx-ghost" items={GHOST_WORDS} outline duration={80} reverse />
      <SectionHead index="03" eyebrow="About" title="WE TURN IDEAS INTO VISUAL EXPERIENCES." />
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
      <SectionHead index="04" eyebrow="Capabilities" title="BUILT TO MAKE IDEAS VISIBLE." />
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
      <SectionHead index="05" eyebrow="Selected work" title="OUR WORK SPEAKS IN FRAMES." />
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
                  <img src={image} alt="" className="gallery-tile-img" loading="lazy" draggable={false} />
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
      <SectionHead index="06" eyebrow="Process" title="FROM THE FIRST IDEA TO THE FINAL FRAME." />
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

type FormStatus = 'idle' | 'invalid' | 'unconfigured'

export function ContactSection() {
  const [status, setStatus] = useState<FormStatus>('idle')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      setStatus('invalid')
      form.reportValidity()
      return
    }
    setStatus('unconfigured')
  }

  return (
    <section className="section contact-section">
      <div className="fx-ripples fx-ripples-end" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <SectionHead index="08" eyebrow="Contact" title="LET'S CREATE SOMETHING UNFORGETTABLE." />
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
                <strong className="contact-direct-value">Coimbatore, Tamil Nadu</strong>
                <span className="contact-direct-sub">Soundstages & on-location units deployable across South India & worldwide</span>
              </div>
            </div>

            <a
              href="https://wa.me/917845132962"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-direct-card contact-direct-link glass"
            >
              <div className="contact-direct-icon whatsapp-accent" aria-hidden="true">
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

          <div className="contact-commitments">
            <div className="contact-commitment-badge">
              <Clock size={13} aria-hidden="true" />
              <span>24–48h Scoping Response</span>
            </div>
            <div className="contact-commitment-badge">
              <Film size={13} aria-hidden="true" />
              <span>Cinema Camera Kits & Soundstage</span>
            </div>
            <div className="contact-commitment-badge">
              <Sparkles size={13} aria-hidden="true" />
              <span>Master-Grade Color & Sound Delivery</span>
            </div>
          </div>
        </div>
        <form className="contact-form glass" onSubmit={submit} noValidate data-reveal style={revealDelay(2)}>
          <label>
            Name
            <input name="name" required autoComplete="name" />
          </label>
          <label>
            Email
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            Phone <span>(optional)</span>
            <input name="phone" type="tel" autoComplete="tel" />
          </label>
          <label>
            Service
            <select name="service" required defaultValue="">
              <option value="" disabled>
                Select a service
              </option>
              {services.map((service) => (
                <option key={service.slug}>{service.title}</option>
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
            />
          </label>
          <button className="button full" type="submit">
            Send project brief <ArrowRight size={17} />
          </button>
          {status === 'invalid' && (
            <p className="form-message error">Please complete the required fields with valid information.</p>
          )}
          {status === 'unconfigured' && (
            <p className="form-message">
              <Check size={16} /> Your details are valid, but delivery is not configured yet. Please connect a contact service
              before launch.
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
      <ContactSection />
    </div>
  )
}

