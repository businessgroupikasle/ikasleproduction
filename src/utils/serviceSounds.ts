import {
  getAudioContext,
  playCameraShutterSound,
  playClapperActionSound,
  playContentCreationSound,
  playCreativeSolutionsSound,
} from './cameraShutter'

let lastFocusSoundAt = 0

/**
 * Crisp, low-gain camera autofocus lock double-pip played on card hover.
 * Throttled so rapid pointer sweeps across cards stay clean.
 */
export function playFocusLockSound(): void {
  try {
    const nowMs = performance.now()
    if (nowMs - lastFocusSoundAt < 90) return
    lastFocusSoundAt = nowMs

    const ctx = getAudioContext()
    if (!ctx || ctx.state !== 'running') return
    const now = ctx.currentTime

    ;[
      { freq: 1760, start: 0, dur: 0.032 },
      { freq: 2349.32, start: 0.042, dur: 0.045 },
    ].forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + start)
      gain.gain.setValueAtTime(0.0001, now + start)
      gain.gain.exponentialRampToValueAtTime(0.065, now + start + 0.006)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + start)
      osc.stop(now + start + dur + 0.01)
    })
  } catch {
    // Audio is a progressive enhancement; ignore failures.
  }
}

const CAPABILITY_SOUNDS: Record<string, () => void> = {
  photography: playCameraShutterSound,
  'video-production': playClapperActionSound,
  'content-creation': playContentCreationSound,
  'creative-solutions': playCreativeSolutionsSound,
}

/**
 * Plays the signature studio sound for a capability card on flip/interaction.
 */
export function playCapabilitySound(slug: string): void {
  CAPABILITY_SOUNDS[slug]?.()
}

/**
 * Soft two-note "notification" pop used by the Content Creation page.
 * Pure Web Audio synthesis: no asset to load, silent when audio is unavailable.
 */
export function playPublishSound(): void {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    ;[
      { freq: 659.25, start: 0, length: 0.16 }, // E5
      { freq: 987.77, start: 0.09, length: 0.28 }, // B5
    ].forEach(({ freq, start, length }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + start)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.02, now + start + length)
      gain.gain.setValueAtTime(0.0001, now + start)
      gain.gain.exponentialRampToValueAtTime(0.26, now + start + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + length)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + start)
      osc.stop(now + start + length + 0.02)
    })
  } catch {
    // Audio is a progressive enhancement; ignore failures.
  }
}

/**
 * Bright ascending chime used by the Creative Solutions page ("idea spark").
 */
export function playSparkSound(): void {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    ;[783.99, 1046.5, 1318.51, 1567.98].forEach((freq, i) => {
      const start = now + i * 0.07
      const osc = ctx.createOscillator()
      const shimmer = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      shimmer.type = 'sine'
      osc.frequency.setValueAtTime(freq, start)
      shimmer.frequency.setValueAtTime(freq * 2, start)
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.16, start + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55)
      osc.connect(gain)
      shimmer.connect(gain)
      gain.connect(ctx.destination)
      osc.start(start)
      shimmer.start(start)
      osc.stop(start + 0.6)
      shimmer.stop(start + 0.6)
    })
  } catch {
    // Audio is a progressive enhancement; ignore failures.
  }
}
