import { useEffect, useRef, type CSSProperties } from 'react'
import { useLocation } from 'react-router'
import { sceneFor } from '../../utils/pageScenes'
import { formatTimecode } from '../../utils/timecode'

/** Seconds of "runtime" the scroll rail maps the whole page onto (read as a film timecode). */
const RUNTIME_SECONDS = 150

interface Dust {
  x: number
  y: number
  /** Depth 0.2–1: nearer motes are bigger, brighter, faster and shift more with scroll and pointer. */
  z: number
  vx: number
  vy: number
  phase: number
  speed: number
}

/**
 * The site-wide living background, mounted once in the layout:
 *  - drifting aurora light, a perspective stage floor, a sweeping light beam, film sprockets,
 *    transmit ripples and a signal-lost scan (CSS; each scene switches its own layers on),
 *  - twinkling light dust on a canvas that drifts upward and parallaxes with scroll and pointer,
 *  - a pointer spotlight, a top scroll-progress line and a side "timecode" rail.
 * Everything is decorative (`aria-hidden`) and non-interactive. Styles: site-fx.css.
 */
export function SiteFx() {
  const { pathname } = useLocation()
  const { scene, hue } = sceneFor(pathname)

  const backdropRef = useRef<HTMLDivElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barRef = useRef<HTMLElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const backdrop = backdropRef.current
    const canvas = canvasRef.current
    if (!backdrop || !canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    // Not available in some test environments: the rest of the backdrop still works without dust.
    const ctx = canvas.getContext('2d')

    let w = window.innerWidth
    let h = window.innerHeight
    let particles: Dust[] = []
    let hueNow = 268
    let scrollY = window.scrollY
    let renderedScroll = Number.NaN
    let mx = 0.5
    let my = 0.4
    let spotX = 0.5
    let spotY = 0.4
    let raf = 0
    let last = 0
    let frameNo = 0

    const spawn = (): Dust => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: 0.2 + Math.random() * 0.8,
      vx: (Math.random() - 0.5) * 5,
      vy: 5 + Math.random() * 12,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.3,
    })

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Fewer motes on phones keeps the layer light and battery-friendly.
      const count = w < 768 ? 8 : Math.round(Math.min(46, Math.max(14, (w * h) / 36000)))
      particles = Array.from({ length: count }, spawn)
    }

    const draw = (now: number, dt: number) => {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)
      const t = now / 1000
      const span = h + 24
      for (const p of particles) {
        p.y -= p.vy * p.z * dt
        p.x += p.vx * p.z * dt
        if (p.y < -12) {
          p.y = h + 12
          p.x = Math.random() * w
        }
        if (p.x < -12) p.x = w + 12
        else if (p.x > w + 12) p.x = -12

        const screenY = ((((p.y - scrollY * p.z * 0.16) % span) + span) % span) - 12
        const screenX = p.x + (mx - 0.5) * p.z * 36
        const twinkle = 0.5 + 0.5 * Math.sin(p.phase + t * p.speed)
        const alpha = (0.12 + 0.5 * p.z) * (0.35 + 0.65 * twinkle)
        const radius = 0.5 + p.z * 1.5

        ctx.fillStyle = `hsla(${hueNow}, 95%, 80%, ${alpha * 0.2})`
        ctx.beginPath()
        ctx.arc(screenX, screenY, radius * 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = `hsla(${hueNow}, 100%, 92%, ${alpha})`
        ctx.beginPath()
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    /** Scroll-linked pieces: parallax on the aurora, the progress line and the timecode rail. */
    const applyScroll = () => {
      if (scrollY === renderedScroll) return
      renderedScroll = scrollY
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const progress = Math.min(1, Math.max(0, scrollY / max))
      if (parallaxRef.current && !reduced) {
        parallaxRef.current.style.transform = `translate3d(0, ${(-scrollY * 0.05).toFixed(1)}px, 0)`
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress.toFixed(4)})`
      railRef.current?.style.setProperty('--p', progress.toFixed(4))
      if (timeRef.current) timeRef.current.textContent = formatTimecode(progress * RUNTIME_SECONDS)
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      frameNo += 1

      // The hue transitions between scenes in CSS; follow it so the dust changes colour with the page.
      if (frameNo % 20 === 0) {
        const value = parseFloat(getComputedStyle(backdrop).getPropertyValue('--bd-hue'))
        if (!Number.isNaN(value)) hueNow = value
      }

      scrollY = window.scrollY
      applyScroll()

      if (finePointer && spotRef.current) {
        spotX += (mx - spotX) * 0.07
        spotY += (my - spotY) * 0.07
        spotRef.current.style.setProperty('--px', `${(spotX * w).toFixed(1)}px`)
        spotRef.current.style.setProperty('--py', `${(spotY * h).toFixed(1)}px`)
      }
      draw(now, dt)
    }

    const start = () => {
      if (raf || reduced) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const onScroll = () => {
      scrollY = window.scrollY
      if (reduced) applyScroll()
    }
    const onPointer = (event: PointerEvent) => {
      mx = event.clientX / w
      my = event.clientY / h
    }
    const onResize = () => {
      resize()
      renderedScroll = Number.NaN
      scrollY = window.scrollY
      applyScroll()
      if (reduced) draw(performance.now(), 0)
    }
    const onVisibility = () => (document.hidden ? stop() : start())

    resize()
    applyScroll()
    if (reduced) draw(performance.now(), 0)
    else start()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    if (finePointer) window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    // Page height changes as routes and lazy content settle, which moves the progress.
    const observer = new ResizeObserver(() => {
      renderedScroll = Number.NaN
      applyScroll()
    })
    observer.observe(document.body)

    return () => {
      stop()
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div className="site-fx" style={{ '--bd-hue': hue } as CSSProperties} aria-hidden="true">
      <div ref={backdropRef} className="site-backdrop" data-scene={scene}>
        <div ref={parallaxRef} className="bd-parallax">
          <i className="bd-aurora bd-aurora-a" />
          <i className="bd-aurora bd-aurora-b" />
          <i className="bd-aurora bd-aurora-c" />
        </div>
        <div className="bd-floor">
          <div className="bd-floor-grid" />
        </div>
        <div className="bd-beam" />
        <div className="bd-rings">
          <i />
          <i />
          <i />
        </div>
        <div className="bd-sprockets">
          <i />
          <i />
        </div>
        <canvas ref={canvasRef} className="bd-dust" />
        <div ref={spotRef} className="bd-spot" />
        <div className="bd-scan" />
        <div className="bd-vignette" />
        <div className="bd-grain" />
      </div>

      <div className="site-progress">
        <i ref={barRef} />
      </div>

      <div ref={railRef} className="site-rail">
        <span className="site-rail-track" />
        <span className="site-rail-thumb" />
        <span ref={timeRef} className="site-rail-time">
          00:00:00:00
        </span>
      </div>
    </div>
  )
}
