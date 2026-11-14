import { useState, useEffect, useRef, type MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, ArrowUpRight, Clapperboard, Volume2, VolumeX, X } from 'lucide-react'
import { services } from '../data/site'
import { LensArt } from '../components/fx/LensArt'
import { Marquee } from '../components/fx/Marquee'
import { SplitTitle } from '../components/fx/SplitTitle'
import { PageCTA } from '../components/page/PageCTA'
import { SectionDivider } from '../components/page/PageChrome'
import { revealDelay, useReveal } from '../hooks/useReveal'
import { usePageSEO } from '../hooks/usePageMeta'
import { PAGE_SEO } from '../data/seo'
import { trackPointer } from '../utils/pointerGlow'
import {
  playCameraShutterSound,
  playClapperActionSound,
  playContentCreationSound,
  playCreativeSolutionsSound,
  startCinemaAmbientSound,
  stopCinemaAmbientSound,
} from '../utils/cameraShutter'
import { formatTimecode } from '../utils/timecode'

const SERVICES_TICKER = ['Campaign & editorial', 'Commercial films', 'Brand content', 'Visual direction', 'Production design', 'Final grade']

export default function Services() {
  usePageSEO(PAGE_SEO.services)
  const navigate = useNavigate()
  const [flashing, setFlashing] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [videoTime, setVideoTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  useReveal(pageRef)

  // Handle card click interactions
  const handleCardClick = (e: MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (slug === 'photography') {
      playCameraShutterSound()
      setFlashing(true)
      setTimeout(() => setFlashing(false), 300)
    } else if (slug === 'video-production') {
      e.preventDefault()
      playClapperActionSound()
      startCinemaAmbientSound()
      setShowVideoModal(true)
    } else if (slug === 'content-creation') {
      playContentCreationSound()
    } else if (slug === 'creative-solutions') {
      playCreativeSolutionsSound()
    }
  }

  // Close modal and cleanup ambient audio
  const handleCloseModal = () => {
    setShowVideoModal(false)
    stopCinemaAmbientSound()
  }

  // Toggle ambient audio in modal
  const handleToggleSound = () => {
    if (isMuted) {
      startCinemaAmbientSound()
      setIsMuted(false)
    } else {
      stopCinemaAmbientSound()
      setIsMuted(true)
    }
  }

  // Listen for Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showVideoModal) {
        handleCloseModal()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      stopCinemaAmbientSound()
    }
  }, [showVideoModal])

  // Track video time for running timecode
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setVideoTime(videoRef.current.currentTime)
    }
  }

  return (
    <div ref={pageRef} className="page services-page">
      <header className="page-hero">
        <LensArt image="/assets/services/camera-lens.jpg" />
        <p className="eyebrow section-eyebrow" data-reveal>
          SERVICES / WHAT WE MAKE
        </p>
        <SplitTitle as="h1" lines={[{ text: 'ONE STUDIO.' }, { text: 'MANY FORMS.', accent: true }]} />
        <p data-reveal style={revealDelay(4)}>
          Produced at our Coimbatore studio facilities and on-location across South India. From a single defining image to an evolving commercial universe, every discipline is shaped with cinematic precision.
        </p>
      </header>

      <section className="services-page-section" aria-label="Services cards">
        <div className="services-cards-grid">
          {services.map((service, serviceIndex) => {
            const Icon = service.icon
            const isPhoto = service.slug === 'photography'
            const isVideo = service.slug === 'video-production'
            return (
              <Link
                to={`/services/${service.slug}`}
                key={service.slug}
                className={`service-theme-card glass ${isPhoto && flashing ? 'service-card-flash' : ''}`}
                onClick={(e) => handleCardClick(e, service.slug)}
                onPointerMove={trackPointer}
                data-reveal
                style={revealDelay(serviceIndex)}
              >
                <span className="fx-spot" aria-hidden="true" />
                <div className="service-theme-card-ambient" aria-hidden="true" />
                {isPhoto && <div className={`camera-flash-overlay ${flashing ? 'is-active' : ''}`} aria-hidden="true" />}

                <div className="service-theme-card-top">
                  <div className="service-theme-card-badge">
                    <span className="card-index">{service.index}</span>
                    <span className="service-theme-divider">/</span>
                    <span className="service-theme-type">{isVideo ? 'Cinema Reel' : 'Capability'}</span>
                  </div>
                  <div className="service-theme-arrow" aria-hidden="true">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                <div className="service-theme-icon-wrap" aria-hidden="true">
                  <Icon size={26} />
                </div>

                <div className="service-theme-body">
                  <h2 className="service-theme-title">{service.title}</h2>
                  <p className="service-theme-desc">{service.description}</p>
                  <p className="service-theme-detail">{service.detail}</p>
                </div>

                {'tags' in service && service.tags && (
                  <div className="service-theme-tags">
                    {service.tags.map((tag) => (
                      <span key={tag} className="service-theme-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="service-theme-footer">
                  <span className="service-theme-cta-label">
                    {isVideo ? 'Play Video Frame' : 'Explore capability'}
                  </span>
                  <span className="service-theme-cta-arrow">
                    <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Cinema Video Frame Modal */}
      {showVideoModal && (
        <div
          className="cinema-modal-backdrop"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-label="Cinema Video Frame Preview"
        >
          <div className="cinema-modal-frame glass" onClick={(e) => e.stopPropagation()}>
            {/* Viewfinder Top Bar */}
            <div className="cinema-viewfinder-top">
              <div className="cinema-rec-badge">
                <span className="cinema-rec-dot" aria-hidden="true" />
                <span className="cinema-rec-text">REC</span>
                <span className="cinema-timecode" aria-label="Running timecode">
                  {formatTimecode(videoTime)}
                </span>
              </div>

              <div className="cinema-specs-badge">
                <span>4K DCI</span>
                <span className="cinema-specs-dot">·</span>
                <span>24.00 FPS</span>
                <span className="cinema-specs-dot">·</span>
                <span>LOG-C</span>
              </div>

              <div className="cinema-controls-group">
                <button
                  type="button"
                  className="cinema-tool-btn"
                  onClick={handleToggleSound}
                  aria-label={isMuted ? 'Unmute cinema audio' : 'Mute cinema audio'}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                </button>
                <button
                  type="button"
                  className="cinema-tool-btn cinema-close-btn"
                  onClick={handleCloseModal}
                  aria-label="Close cinema frame"
                  title="Close frame (Esc)"
                >
                  <X size={19} />
                </button>
              </div>
            </div>

            {/* Cinematic Video Container with HUD */}
            <div className="cinema-video-viewport">
              <video
                ref={videoRef}
                src="/assets/videos/vdx.mp4"
                autoPlay
                loop
                playsInline
                onTimeUpdate={handleTimeUpdate}
                className="cinema-video-player"
              />

              {/* Viewfinder HUD Overlay */}
              <div className="cinema-hud-overlay" aria-hidden="true">
                <div className="cinema-hud-crosshair" />
                <div className="cinema-hud-corner top-left" />
                <div className="cinema-hud-corner top-right" />
                <div className="cinema-hud-corner bottom-left" />
                <div className="cinema-hud-corner bottom-right" />
                <div className="cinema-hud-aspect-lines" />
              </div>
            </div>

            {/* Viewfinder Bottom Bar */}
            <div className="cinema-viewfinder-bottom">
              <div className="cinema-slate-info">
                <div className="cinema-slate-icon-wrap">
                  <Clapperboard size={18} />
                </div>
                <div>
                  <h3 className="cinema-slate-title">IKASLÉ PRODUCTION REEL</h3>
                  <p className="cinema-slate-sub">SCENE 02 / TAKE 01 · CINEMATIC DIRECTION & COLOUR</p>
                </div>
              </div>

              <div className="cinema-footer-actions">
                <button
                  type="button"
                  className="cinema-action-link button"
                  onClick={() => {
                    handleCloseModal()
                    navigate('/services/video-production')
                  }}
                >
                  Explore Video Production <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Marquee className="fx-band" items={SERVICES_TICKER} duration={48} reverse />

      <SectionDivider label="02 / PRODUCTION RIG" />
      <section className="services-camera-section" aria-label="Studio cinema camera rig" data-reveal>
        <div className="services-camera-card glass">
          <div className="services-camera-media" aria-hidden="true">
            <img
              src="/assets/camera/cinema-camera-placeholder.png"
              alt=""
              className="services-camera-img"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <div className="services-camera-fade" />
          </div>
          <div className="services-camera-copy">
            <p className="eyebrow">CINEMA GRADE WORKFLOW · COIMBATORE</p>
            <h2>
              BUILT FOR SET <span className="accent">&amp; STUDIO.</span>
            </h2>
            <p>
              Every production runs on cinema-grade bodies, prime optics, controlled lighting, and calibrated monitoring—engineered to move cleanly from studio stages to on-location shoots across South India.
            </p>
            <div className="services-camera-specs">
              <span>4K DCI / RAW</span>
              <span>50MM CINE PRIME</span>
              <span>ON-SET COLOUR MONITOR</span>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider label="03 / START A PRODUCTION" />
      <PageCTA
        eyebrow="READY WHEN YOU ARE"
        description="Connect with our Coimbatore production desk. Tell us what you want to make and who it needs to move. We will shape the right production around it."
        primaryLabel="Discuss your project"
      />
    </div>
  )
}
