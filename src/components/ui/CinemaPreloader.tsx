import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { playFocusLockSound } from '../../utils/serviceSounds'
import { playCameraShutterSound } from '../../utils/cameraShutter'
import '../../styles/cinema-preloader.css'

interface CinemaPreloaderProps {
  duration?: number
  onComplete?: () => void
}

const DISTANCE_MARKS = ['0.5m', '0.7m', '1.0m', '1.5m', '2.5m', '5.0m', '10m', '∞']
const APERTURE_STOPS = ['f/1.2', 'f/1.4', 'f/2.0', 'f/2.8', 'f/4.0', 'f/5.6', 'T1.5']

export function CinemaPreloader({ duration = 3000, onComplete }: CinemaPreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'initializing' | 'focusing' | 'locking' | 'ready'>('initializing')
  const [timecode, setTimecode] = useState('00:00:00:00')
  const [currentAperture, setCurrentAperture] = useState('f/1.4')
  const [currentDistance, setCurrentDistance] = useState('1.5m')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [flashActive, setFlashActive] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const stageRef = useRef<HTMLDivElement>(null)
  const hasPlayedFocusSound = useRef(false)
  const hasPlayedShutterSound = useRef(false)

  useEffect(() => {
    const startTime = performance.now()
    let frameId: number

    const tick = (now: number) => {
      const elapsed = now - startTime
      const rawProgress = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(rawProgress)

      // Timecode calculations (24 frames per second)
      const totalFrames = Math.floor((elapsed / 1000) * 24)
      const sec = Math.floor(totalFrames / 24)
      const remFrames = totalFrames % 24
      const tc = `00:00:0${sec}:${remFrames < 10 ? '0' : ''}${remFrames}`
      setTimecode(tc)

      // Optical parameters morphing
      if (rawProgress < 30) {
        setPhase('initializing')
        setCurrentAperture('f/1.2')
        setCurrentDistance('∞')
      } else if (rawProgress < 70) {
        setPhase('focusing')
        setCurrentAperture(APERTURE_STOPS[Math.floor((rawProgress / 70) * 4)])
        setCurrentDistance(DISTANCE_MARKS[Math.floor((rawProgress / 70) * (DISTANCE_MARKS.length - 1))])

        if (!hasPlayedFocusSound.current && rawProgress > 45) {
          hasPlayedFocusSound.current = true
          if (soundEnabled) {
            try {
              playFocusLockSound()
            } catch {
              // Sound is progressive
            }
          }
        }
      } else if (rawProgress < 94) {
        setPhase('locking')
        setCurrentAperture('T1.5')
        setCurrentDistance('1.5m [LOCKED]')

        if (!hasPlayedShutterSound.current && rawProgress > 88) {
          hasPlayedShutterSound.current = true
          setFlashActive(true)
          if (soundEnabled) {
            try {
              playCameraShutterSound()
            } catch {
              // Sound is progressive
            }
          }
        }
      } else {
        setPhase('ready')
        setCurrentAperture('T1.5 PRIME')
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
  }, [duration, onComplete, soundEnabled])

  // Mouse tilt parallax for real 3D depth
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    stageRef.current.style.setProperty('--lens-tilt-x', `${y * -16}deg`)
    stageRef.current.style.setProperty('--lens-tilt-y', `${x * 16}deg`)
    stageRef.current.style.setProperty('--flare-shift-x', `${x * 40}px`)
  }

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
        aria-label="Camera and lens calibration preloader"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        onPointerMove={handlePointerMove}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Shutter White Flash transition burst */}
        <div className={`cine-flash-burst ${flashActive ? 'active' : ''}`} aria-hidden="true" />

        {/* 35mm Celluloid Film Sprocket Track - TOP */}
        <div className="cine-filmstrip top" aria-hidden="true">
          <div className="cine-sprocket-row">
            {[...Array(20)].map((_, i) => (
              <span key={`sprocket-top-${i}`} className="cine-sprocket-hole" />
            ))}
          </div>
          <div className="cine-film-edge-code">
            <span>EASTMAN 5219</span>
            <span>KODAK VISION3 500T</span>
            <span>IKL-2026-CINE</span>
          </div>
        </div>

        {/* Ambient Anamorphic Flares */}
        <div className="cine-anamorphic-flare" aria-hidden="true" />
        <div className="cine-anamorphic-streak" aria-hidden="true" />
        <div className="cine-grain-mesh" aria-hidden="true" />

        {/* Viewfinder Reticle & Peaking Overlay */}
        <div className="cine-viewfinder-grid" aria-hidden="true">
          <span className="cine-corner top-left" />
          <span className="cine-corner top-right" />
          <span className="cine-corner bottom-left" />
          <span className="cine-corner bottom-right" />

          {/* Golden Ratio & Safe Area Frame */}
          <div className="cine-safe-area-frame">
            <span className="cine-safe-label">2.39:1 CINEMASCOPE</span>
          </div>

          {/* Center Gyro Horizon Line */}
          <div className="cine-gyro-horizon">
            <span className="cine-gyro-bar left" />
            <div className="cine-gyro-circle">
              <span className="cine-gyro-dot" />
            </div>
            <span className="cine-gyro-bar right" />
          </div>

          {/* Focus Peaking Green Laser Scan */}
          <div className="cine-focus-peaking-scan" />
        </div>

        {/* Camera HUD Header */}
        <header className="cine-hud-header" aria-hidden="true">
          <div className="cine-hud-left">
            <span className="cine-rec-dot" />
            <span className="cine-rec-label">CALIBRATING</span>
            <span className="cine-hud-sep">/</span>
            <span className="cine-hud-mono">IKASLÉ CINE-CAM</span>
            <span className="cine-fps-pill">24.000 FPS</span>
          </div>

          <div className="cine-hud-center">
            <span className="cine-hud-tag">180° SHUTTER</span>
            <span className="cine-hud-tag">EI 800</span>
            <span className="cine-hud-tag">5600K RAW</span>
            <span className="cine-hud-tag accent">PRORES 4444 XQ</span>
          </div>

          <div className="cine-hud-right">
            <span className="cine-timecode">{timecode}</span>
          </div>
        </header>

        {/* Central 3D Interactive Camera Rig & Master Lens Assembly */}
        <div className="cine-rig-stage" ref={stageRef}>
          {/* Cinema Matte Box / Lens Shade Accents */}
          <div className="cine-matte-box-frame" aria-hidden="true">
            <div className="cine-flag-top" />
            <div className="cine-flag-left" />
            <div className="cine-flag-right" />
          </div>

          {/* Master Cine Lens Assembly */}
          <div className="cine-lens-barrel-assembly">
            {/* Outer Geared Follow-Focus Teeth Ring */}
            <div className="cine-geared-ring" aria-hidden="true">
              {[...Array(36)].map((_, i) => (
                <span
                  key={`gear-${i}`}
                  className="cine-gear-tooth"
                  style={{ transform: `rotate(${i * 10}deg)` }}
                />
              ))}
            </div>

            {/* Metric Distance Scale Markings */}
            <div className="cine-distance-scale" aria-hidden="true">
              {DISTANCE_MARKS.map((mark, i) => (
                <span
                  key={`dist-${i}`}
                  className={`cine-distance-mark ${currentDistance.startsWith(mark) ? 'is-active' : ''}`}
                  style={{ transform: `rotate(${i * 24 - 84}deg)` }}
                >
                  <i>{mark}</i>
                </span>
              ))}
            </div>

            {/* Optical Glass Multi-Coatings Chamber */}
            <div className="cine-lens-glass-chamber">
              {/* Iridescent Multi-layer Anti-reflective Coating (Emerald & Violet) */}
              <div className="cine-coating-emerald" aria-hidden="true" />
              <div className="cine-coating-magenta" aria-hidden="true" />
              <div className="cine-glass-reflection-arc" aria-hidden="true" />

              {/* 10 Mechanical Iris Aperture Blades (SVG Geometric Iris) */}
              <svg
                className={`cine-iris-svg phase-${phase}`}
                viewBox="0 0 240 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Concentric Calibration Circles */}
                <circle cx="120" cy="120" r="112" stroke="#a78bfa" strokeWidth="1.5" strokeOpacity="0.4" />
                <circle cx="120" cy="120" r="100" stroke="#c4a2ff" strokeWidth="0.8" strokeDasharray="3 4" strokeOpacity="0.5" />
                <circle cx="120" cy="120" r="82" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.3" />
                <circle cx="120" cy="120" r="62" stroke="#e879f9" strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.4" />

                {/* 10 Precision Aperture Blades */}
                <g className="cine-iris-blades-group">
                  <path d="M120 40 L170 70 L140 120 Z" fill="url(#blade-grad-lux)" />
                  <path d="M170 70 L195 120 L140 145 Z" fill="url(#blade-grad-lux)" />
                  <path d="M195 120 L168 175 L120 145 Z" fill="url(#blade-grad-lux)" />
                  <path d="M168 175 L120 200 L95 145 Z" fill="url(#blade-grad-lux)" />
                  <path d="M120 200 L72 175 L95 120 Z" fill="url(#blade-grad-lux)" />
                  <path d="M72 175 L45 120 L95 95 Z" fill="url(#blade-grad-lux)" />
                  <path d="M45 120 L72 65 L120 95 Z" fill="url(#blade-grad-lux)" />
                  <path d="M72 65 L120 40 L145 95 Z" fill="url(#blade-grad-lux)" />
                </g>

                {/* Digital CMOS Sensor Grid Behind Aperture */}
                <rect x="94" y="94" width="52" height="52" rx="4" fill="#090812" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.6" />
                <line x1="94" y1="120" x2="146" y2="120" stroke="#a855f7" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6" />
                <line x1="120" y1="94" x2="120" y2="146" stroke="#a855f7" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6" />
                <circle cx="120" cy="120" r="16" fill="#040308" stroke="#38bdf8" strokeWidth="1.2" />

                <defs>
                  <linearGradient id="blade-grad-lux" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2c253d" />
                    <stop offset="60%" stopColor="#171224" />
                    <stop offset="100%" stopColor="#08060f" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Dynamic Anamorphic Blue Flare Beam across optic */}
              <div className="cine-lens-flare-beam" aria-hidden="true" />

              {/* Center Cinema Camera Core Silhouette */}
              <div className="cine-camera-core-hub">
                <svg
                  className="cine-cam-vector"
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
                  <line x1="12" y1="1" x2="12" y2="4" />
                </svg>
              </div>
            </div>

            {/* Precision Lens Engravings */}
            <div className="cine-lens-engraving" aria-hidden="true">
              <span className="brand">IKASLÉ CINE-PRIME 35mm</span>
              <span className="spec">T1.5 • ANAMORPHIC 2.39:1</span>
              <span className="serial">№ 847291 • MADE FOR CINEMA</span>
            </div>
          </div>

          {/* Telemetry Live Diagnostics Dashboard */}
          <div className="cine-telemetry-hud">
            <div className="cine-hud-metric-pill">
              <span className="label">IRIS STOP</span>
              <span className="value neon-purple">{currentAperture}</span>
            </div>
            <div className="cine-hud-metric-pill">
              <span className="label">FOCUS DIST</span>
              <span className="value neon-cyan">{currentDistance}</span>
            </div>
            <div className="cine-hud-metric-pill">
              <span className="label">SENSOR RESOLUTION</span>
              <span className="value">4K DCI (4096×2160)</span>
            </div>
          </div>

          {/* Studio Brand & Calibration Phase Title */}
          <div className="cine-status-block">
            <h1 className="cine-brand-title">
              IKASLÉ <span>PRODUCTIONS</span>
            </h1>

            <div className="cine-phase-row">
              <span className={`cine-pulse-indicator ${phase}`} />
              <span className="cine-phase-text">
                {phase === 'initializing' && 'INITIALIZING HIGH-RES SENSORS...'}
                {phase === 'focusing' && 'PULLING FOCUS // 35mm OPTICS'}
                {phase === 'locking' && 'APERTURE CALIBRATED // T1.5'}
                {phase === 'ready' && 'ROLL CAMERA // ACTION'}
              </span>
            </div>

            {/* Precision Cinematic Progress Bar */}
            <div className="cine-progress-container">
              <div className="cine-progress-track">
                <motion.div
                  className="cine-progress-bar"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
              <div className="cine-progress-info">
                <span className="cine-optical-cal">
                  OPTICAL CALIBRATION • {progress < 100 ? 'SYNCHRONIZING' : 'LOCKED'}
                </span>
                <span className="cine-percent">{progress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 35mm Celluloid Film Sprocket Track - BOTTOM */}
        <div className="cine-filmstrip bottom" aria-hidden="true">
          <div className="cine-sprocket-row">
            {[...Array(20)].map((_, i) => (
              <span key={`sprocket-bot-${i}`} className="cine-sprocket-hole" />
            ))}
          </div>
          <div className="cine-film-edge-code">
            <span>FRAME #0024</span>
            <span>COIMBATORE STUDIO SOUNDSTAGE</span>
            <span>2.39:1 DCI SCOPE</span>
          </div>
        </div>

        {/* HUD Footer Controls */}
        <footer className="cine-hud-footer">
          <div className="cine-tech-meta">
            <button
              type="button"
              className={`cine-sound-toggle ${soundEnabled ? 'is-active' : ''}`}
              onClick={() => setSoundEnabled((prev) => !prev)}
              aria-label="Toggle camera sound effects"
            >
              <span className="dot" />
              <span>SOUND: {soundEnabled ? 'ON' : 'MUTED'}</span>
            </button>
            <span className="sep">•</span>
            <span>4K DCI MASTERING</span>
            <span className="sep">•</span>
            <span>COIMBATORE SOUNDSTAGE</span>
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