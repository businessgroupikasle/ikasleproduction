import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play } from 'lucide-react'
import { ButtonLink } from '../ui/ButtonLink'

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const ambient = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current || !ambient.current) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return

    const context = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
      intro
        .from('.hero-kicker', { opacity: 0, y: 16, duration: 0.5 })
        .from('.hero-title span', { opacity: 0, y: 46, stagger: 0.11, duration: 0.72 }, '-=.16')
        .from('.hero-copy, .hero-actions', { opacity: 0, y: 18, stagger: 0.11, duration: 0.55 }, '-=.62')

      gsap.to(ambient.current, {
        scale: 1.08,
        opacity: 0.88,
        xPercent: -3,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      })
    }, root)

    return () => context.revert()
  }, [])

  useEffect(() => {
    const el = video.current
    if (!el) return
    el.muted = true
    const startPlay = () => {
      const p = el.play()
      if (p && typeof p.catch === 'function') {
        p.catch(() => {})
      }
    }
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(startPlay, { timeout: 1200 })
      } else {
        setTimeout(startPlay, 600)
      }
    } else {
      startPlay()
    }
  }, [])

  useEffect(() => {
    const el = video.current
    if (!el) return
    const reveal = () => gsap.to(el, { opacity: 1, duration: 1.4, ease: 'power2.out' })
    if (el.readyState >= 2) reveal()
    else el.addEventListener('canplay', reveal, { once: true })
    return () => el.removeEventListener('canplay', reveal)
  }, [])

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

  return (
    <section className="hero" ref={root} aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true">
        <video
          ref={video}
          className="hero-video"
          src="/assets/videos/vdx.mp4"
          poster="/assets/gallery/canon-cinema-rig.jpg"
          preload={isMobile ? 'none' : 'metadata'}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="hero-video-overlay" aria-hidden="true" />
      </div>
      <div className="hero-atmosphere" ref={ambient} aria-hidden="true">
        <span className="hero-glow hero-glow-large" />
        <span className="hero-glow hero-glow-backlight" />
        <span className="hero-vignette" />
      </div>

      <div className="hero-content">
        <p className="eyebrow hero-kicker">IKASLÉ PRODUCTIONS / CREATIVE STUDIO · COIMBATORE</p>
        <h1 className="hero-title" id="hero-title">
          <span>WE DON'T JUST</span>
          <span>CAPTURE.</span>
          <span className="accent">WE CREATE IMPACT.</span>
        </h1>
        <p className="hero-copy">
          Based in Coimbatore, Tamil Nadu — from powerful brand films to striking commercial photography, we transform ideas into cinematic experiences across South India.
        </p>
        <div className="hero-actions">
          <ButtonLink to="/portfolio">Explore portfolio</ButtonLink>
          <ButtonLink to="#showreel" secondary>
            <Play size={15} fill="currentColor" /> Watch showreel
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

