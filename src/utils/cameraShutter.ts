let audioContext: AudioContext | null = null

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return null
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new AudioCtx()
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {})
  }
  return audioContext
}

/**
 * Web Audio API synthesized mechanical camera shutter sound.
 * Dual-impulse transient: curtain open + mirror return snap.
 */
function synthesizeCameraClick(): void {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    // 1st impulse: Shutter open (~0 to 30ms)
    createClickImpulse(ctx, now, 3200, 1800, 0.035, 0.7)

    // 2nd impulse: Mirror return / curtain close (~52ms later, punchier)
    createClickImpulse(ctx, now + 0.052, 2400, 480, 0.08, 0.95)
  } catch {
    // Ignore any audio errors
  }
}

function createClickImpulse(
  ctx: AudioContext,
  startTime: number,
  highFreq: number,
  bodyFreq: number,
  duration: number,
  gainLevel: number
): void {
  const bufferSize = Math.floor(ctx.sampleRate * duration)
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const output = noiseBuffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1
  }

  const whiteNoise = ctx.createBufferSource()
  whiteNoise.buffer = noiseBuffer

  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'bandpass'
  noiseFilter.frequency.setValueAtTime(highFreq, startTime)
  noiseFilter.Q.setValueAtTime(2.2, startTime)

  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(gainLevel * 0.7, startTime)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  whiteNoise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(ctx.destination)

  whiteNoise.start(startTime)
  whiteNoise.stop(startTime + duration)

  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(highFreq * 0.9, startTime)
  osc.frequency.exponentialRampToValueAtTime(bodyFreq, startTime + duration * 0.6)

  const oscGain = ctx.createGain()
  oscGain.gain.setValueAtTime(gainLevel * 0.5, startTime)
  oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.8)

  osc.connect(oscGain)
  oscGain.connect(ctx.destination)

  osc.start(startTime)
  osc.stop(startTime + duration)
}

let ambientDroneNodes: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null = null

/**
 * Starts a subtle cinematic sub-bass film projector atmosphere when the video frame opens.
 */
export function startCinemaAmbientSound(): void {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    stopCinemaAmbientSound()

    const now = ctx.currentTime
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    osc1.type = 'sawtooth'
    osc1.frequency.setValueAtTime(55, now)

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(110, now)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(240, now)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.6)

    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc1.start(now)
    osc2.start(now)

    ambientDroneNodes = { osc1, osc2, gain }
  } catch {
    // Ignore audio errors
  }
}

/**
 * Stops the cinematic ambient sound with a smooth fade-out.
 */
export function stopCinemaAmbientSound(): void {
  if (ambientDroneNodes) {
    try {
      const { osc1, osc2, gain } = ambientDroneNodes
      const ctx = getAudioContext()
      if (ctx) {
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.25)
        setTimeout(() => {
          try {
            osc1.stop()
            osc2.stop()
            osc1.disconnect()
            osc2.disconnect()
          } catch {
            // Audio node disconnect error ignored
          }
        }, 280)
      }
    } catch {
      // Audio stop error ignored
    }
    ambientDroneNodes = null
  }
}

function synthesizeClapperSnap(): void {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Sharp woody snap
    createClickImpulse(ctx, now, 1850, 420, 0.05, 1.0)
    createClickImpulse(ctx, now + 0.024, 2200, 650, 0.03, 0.5)
  } catch {
    // Ignore audio errors
  }
}

/**
 * Plays the clapperboard snap and director 'Action!' sound.
 */
export function playClapperActionSound(): void {
  try {
    const audio = new Audio('/assets/sounds/clapper-action.wav')
    audio.volume = 0.95
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        synthesizeClapperSnap()
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance('Action!')
          utterance.rate = 1.15
          window.speechSynthesis.speak(utterance)
        }
      })
    }
  } catch {
    synthesizeClapperSnap()
  }
}

/**
 * Plays a camera shutter click sound.
 * Tries the pre-rendered crisp WAV audio asset first, with zero-latency Web Audio API synthesis as fallback.
 */
export function playCameraShutterSound(): void {
  try {
    const audio = new Audio('/assets/sounds/camera-shutter.wav')
    audio.volume = 0.9
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        synthesizeCameraClick()
      })
    }
  } catch {
    synthesizeCameraClick()
  }
}

/**
 * Synthesizes a typing/keyboard sound for content creation.
 * Rapid clicking with varied pitch for keyboard feel.
 */
function synthesizeTypingSound(): void {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    for (let i = 0; i < 3; i++) {
      const delay = i * 0.08
      createClickImpulse(ctx, now + delay, 4500, 2200, 0.04, 0.6)
      createClickImpulse(ctx, now + delay + 0.02, 3800, 1800, 0.02, 0.35)
    }
  } catch {
    // Ignore audio errors
  }
}

/**
 * Plays a typing/keyboard sound for content creation.
 */
export function playContentCreationSound(): void {
  try {
    synthesizeTypingSound()
  } catch {
    // Ignore audio errors
  }
}

/**
 * Synthesizes a bright, idea-like sound (lightbulb ping) for creative solutions.
 * Rising pitch with a resonant bell-like quality.
 */
function synthesizeIdeaSound(): void {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.15)

    filter.type = 'highpass'
    filter.frequency.setValueAtTime(600, now)

    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.25)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.25)
  } catch {
    // Ignore audio errors
  }
}

/**
 * Plays a creative/idea sound for creative solutions.
 */
export function playCreativeSolutionsSound(): void {
  try {
    synthesizeIdeaSound()
  } catch {
    // Ignore audio errors
  }
}

