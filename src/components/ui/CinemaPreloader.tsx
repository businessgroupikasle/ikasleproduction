import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import '../../styles/cinema-preloader.css'

interface CinemaPreloaderProps {
  duration?: number
  onComplete?: () => void
}

export function CinemaPreloader({ duration = 3000, onComplete }: CinemaPreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'initializing' | 'focusing' | 'locking' | 'ready'>('initializing')
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const startTime = performance.now()
    let frameId: number

    const tick = (now: number) => {
      const elapsed = now - startTime
      const rawProgress = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(rawProgress)

      if (rawProgress < 30) {
        setPhase('initializing')
      } else if (rawProgress < 70) {
        setPhase('focusing')
      } else if (rawProgress < 95) {
        setPhase('locking')
      } else {
        setPhase('ready')
      }

      if (elapsed < duration) {
        frameId = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setIsVisible(false)
          onComplete?.()
        }, 180)
      }
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [duration, onComplete])

  const handleSkip = () => {
    setIsVisible(false)
    onComplete?.()
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.aside
        className="cinema-preloader-overlay"
        role="progressbar"
        aria-label="Camera and lens calibration preloader"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Anamorphic Blue/Purple Flare Background */}
        <div className="cine-anamorphic-flare" aria-hidden="true" />
        <div className="cine-grain-mesh" aria-hidden="true" />

        {/* Viewfinder Reticle Frame */}
        <div className="cine-viewfinder-grid" aria-hidden="true">
          <span className="cine-corner top-left" />
          <span className="cine-corner top-right" />
          <span className="cine-corner bottom-left" />
          <span className="cine-corner bottom-right" />
          <div className="cine-crosshair center-h" />
          <div className="cine-crosshair center-v" />
        </div>

        {/* Camera HUD Header */}
        <header className="cine-hud-header" aria-hidden="true">
          <div className="cine-hud-left">
            <span className="cine-rec-dot" />
            <span className="cine-rec-label">CALIBRATING</span>
            <span className="cine-hud-sep">/</span>
            <span className="cine-hud-mono">IKASLÉ CINE-CAM</span>
          </div>
          <div className="cine-hud-center">
            <span className="cine-hud-tag">24.00 FPS</span>
            <span className="cine-hud-tag">180° SHUTTER</span>
            <span className="cine-hud-tag">ISO 800</span>
          </div>
          <div className="cine-hud-right">
            <span className="cine-timecode">00:00:03:00</span>
          </div>
        </header>

        {/* Central Creative Camera & Lens Optics System */}
        <div className="cine-rig-stage">
          {/* Outer Lens Housing & Focus Ring */}
          <div className="cine-lens-barrel">
            {/* Focal ticks around the perimeter */}
            <div className="cine-lens-ticks" aria-hidden="true">
              {[...Array(24)].map((_, i) => (
                <span
                  key={i}
                  className={`cine-tick ${i % 4 === 0 ? 'major' : ''}`}
                  style={{ transform: `rotate(${i * 15}deg)` }}
                />
              ))}
            </div>

            {/* Glass Optics Glass Rings */}
            <div className="cine-lens-glass">
              {/* Rotating Iris Aperture with 8 mechanical blades */}
              <svg
                className="cine-iris-svg"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="100" cy="100" r="92" stroke="#a78bfa" strokeWidth="1.5" strokeOpacity="0.4" />
                <circle cx="100" cy="100" r="80" stroke="#c4a2ff" strokeWidth="0.8" strokeDasharray="3 4" strokeOpacity="0.6" />
                <circle cx="100" cy="100" r="62" stroke="#9333ea" strokeWidth="1" strokeOpacity="0.3" />

                {/* 8 Aperture Blades that open and close */}
                <g className="cine-aperture-blades">
                  <path d="M100 38 L142 62 L120 100 Z" fill="url(#blade-grad)" opacity="0.85" />
                  <path d="M142 62 L162 100 L120 120 Z" fill="url(#blade-grad)" opacity="0.85" />
                  <path d="M162 100 L138 142 L100 120 Z" fill="url(#blade-grad)" opacity="0.85" />
                  <path d="M138 142 L100 162 L80 120 Z" fill="url(#blade-grad)" opacity="0.85" />
                  <path d="M100 162 L58 138 L80 100 Z" fill="url(#blade-grad)" opacity="0.85" />
                  <path d="M58 138 L38 100 L80 80 Z" fill="url(#blade-grad)" opacity="0.85" />
                  <path d="M38 100 L62 58 L100 80 Z" fill="url(#blade-grad)" opacity="0.85" />
                  <path d="M62 58 L100 38 L120 80 Z" fill="url(#blade-grad)" opacity="0.85" />
                </g>

                {/* Inner glass aperture opening */}
                <circle cx="100" cy="100" r="32" fill="#08070d" stroke="#a855f7" strokeWidth="1.5" />
                <circle cx="100" cy="100" r="22" fill="#030206" />

                {/* Gradients */}
                <defs>
                  <linearGradient id="blade-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#252136" />
                    <stop offset="100%" stopColor="#0f0c1a" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Cyan & Violet Optical Glass Glare */}
              <div className="cine-glass-reflection" aria-hidden="true" />
              <div className="cine-lens-flare-beam" aria-hidden="true" />

              {/* Inner Lens Core with Camera Icon */}
              <div className="cine-lens-core">
                <svg
                  className="cine-camera-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
            </div>

            {/* Lens Specification Markings */}
            <div className="cine-lens-engraving" aria-hidden="true">
              <span>IKASLÉ CINE-PRIME 35mm</span>
              <span>T1.5 • ANAMORPHIC 2.39:1</span>
            </div>
          </div>

          {/* Studio Brand & Calibration Phase */}
          <div className="cine-status-block">
            <h1 className="cine-brand-title">
              IKASLÉ <span>PRODUCTIONS</span>
            </h1>

            <div className="cine-phase-row">
              <span className="cine-pulse-indicator" />
              <span className="cine-phase-text">
                {phase === 'initializing' && 'INITIALIZING HIGH-RES SENSORS...'}
                {phase === 'focusing' && 'PULLING FOCUS // 35mm OPTICS'}
                {phase === 'locking' && 'APERTURE CALIBRATED // T1.5'}
                {phase === 'ready' && 'ROLL CAMERA // ACTION'}
              </span>
            </div>

            {/* Cinematic Progress Bar */}
            <div className="cine-progress-container">
              <div className="cine-progress-track">
                <motion.div
                  className="cine-progress-bar"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
              <div className="cine-progress-info">
                <span className="cine-optical-cal">OPTICAL CALIBRATION</span>
                <span className="cine-percent">{progress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer controls with skip button */}
        <footer className="cine-hud-footer">
          <div className="cine-tech-meta">
            <span>COIMBATORE SOUNDSTAGE</span>
            <span className="sep">•</span>
            <span>4K DCI MASTERING</span>
          </div>
          <button
            type="button"
            className="cine-skip-btn"
            onClick={handleSkip}
            aria-label="Skip camera loading animation"
          >
            Skip Intro →
          </button>
        </footer>
      </motion.aside>
    </AnimatePresence>
  )
}

export default CinemaPreloader