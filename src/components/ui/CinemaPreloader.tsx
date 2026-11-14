import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { playFocusLockSound } from '../../utils/serviceSounds'
import { playCameraShutterSound } from '../../utils/cameraShutter'
import '../../styles/cinema-preloader.css'

interface CinemaPreloaderProps {
  duration?: number
  onComplete?: () => void
}

export function CinemaPreloader({ duration = 3000, onComplete }: CinemaPreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [flashActive, setFlashActive] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const startTime = performance.now()
    let frameId: number
    let soundFired = false
    let shutterFired = false

    const tick = (now: number) => {
      const elapsed = now - startTime
      const rawProgress = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(rawProgress)

      if (!soundFired && rawProgress > 45) {
        soundFired = true
        try {
          playFocusLockSound()
        } catch {
          // Audio progressive enhancement
        }
      }

      if (!shutterFired && rawProgress > 88) {
        shutterFired = true
        setFlashActive(true)
        try {
          playCameraShutterSound()
        } catch {
          // Audio progressive enhancement
        }
      }

      if (elapsed < duration) {
        frameId = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setIsVisible(false)
          onComplete?.()
        }, 160)
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
        className={`cinema-preloader-overlay ${flashActive ? 'is-shutter-flash' : ''}`}
        role="progressbar"
        aria-label="Loading animation"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        onClick={handleSkip}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.06, filter: 'blur(14px)' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Shutter White Flash transition burst */}
        <div className={`cine-flash-burst ${flashActive ? 'active' : ''}`} aria-hidden="true" />

        {/* Ambient Anamorphic Flares */}
        <div className="cine-anamorphic-flare" aria-hidden="true" />
        <div className="cine-anamorphic-streak" aria-hidden="true" />
        <div className="cine-grain-mesh" aria-hidden="true" />

        {/* Central Visual Showcase: Logo + Camera Lens Imagery & Animation */}
        <div className="cine-visual-container">
          {/* Brand Logo with Glow Backlight */}
          <div className="cine-logo-wrapper">
            <div className="cine-logo-glow" aria-hidden="true" />
            <img
              src="/assets/brand/ikasle-mark.svg"
              alt="IKASLÉ"
              className="cine-brand-logo"
            />
          </div>

          {/* Camera Lens Image & Mechanical Aperture Rings Animation */}
          <div className="cine-lens-portal">
            {/* Outer Geared Focus Ring */}
            <div className="cine-lens-gear-orbit" aria-hidden="true">
              {[...Array(24)].map((_, i) => (
                <span
                  key={`gear-tooth-${i}`}
                  className="cine-gear-notch"
                  style={{ transform: `rotate(${i * 15}deg)` }}
                />
              ))}
            </div>

            {/* Glowing Aperture Glass Frame */}
            <div className="cine-lens-frame">
              {/* High-Resolution Camera Lens Optics Image */}
              <img
                src="/assets/services/camera-lens.jpg"
                alt="Camera Lens"
                className="cine-lens-image"
              />

              {/* Multi-coating Glass Reflections & Light Beams */}
              <div className="cine-coating-emerald" aria-hidden="true" />
              <div className="cine-coating-magenta" aria-hidden="true" />
              <div className="cine-glass-reflection-arc" aria-hidden="true" />
              <div className="cine-lens-flare-beam" aria-hidden="true" />

              {/* Concentric Mechanical Iris Blades SVG Animation */}
              <svg
                className="cine-iris-ring-svg"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="100" cy="100" r="94" stroke="#c4a2ff" strokeWidth="1.5" strokeOpacity="0.5" />
                <circle cx="100" cy="100" r="82" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 6" strokeOpacity="0.6" />
                <circle cx="100" cy="100" r="68" stroke="#a855f7" strokeWidth="1.2" strokeOpacity="0.4" />
                <circle cx="100" cy="100" r="46" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 4" strokeOpacity="0.7" />
              </svg>

              {/* Central Optical Core with Camera Silhouette */}
              <div className="cine-lens-aperture-core">
                <svg
                  className="cine-core-camera-icon"
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

            {/* Glowing Focus Orbit Pulse Ring */}
            <div className="cine-focus-orbit-pulse" aria-hidden="true" />
          </div>

          {/* Minimalist Visual Progress Line (Zero Text) */}
          <div className="cine-progress-wrapper" aria-hidden="true">
            <div className="cine-progress-rail">
              <motion.div
                className="cine-progress-fill"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}

export default CinemaPreloader