import type { SignatureEffect } from '../data/serviceDetails'
import { playCameraShutterSound, playClapperActionSound } from './cameraShutter'
import { playPublishSound, playSparkSound } from './serviceSounds'

/**
 * How long each full-screen effect stays mounted (ms).
 * Keep in sync with the CSS animation lengths in service-detail.css (".svc-fx-*").
 */
export const FX_DURATION: Record<SignatureEffect, number> = {
  shutter: 320,
  clapper: 1200,
  publish: 1600,
  spark: 1400,
}

/** Sound fired together with each effect. */
export const FX_SOUND: Record<SignatureEffect, () => void> = {
  shutter: playCameraShutterSound,
  clapper: playClapperActionSound,
  publish: playPublishSound,
  spark: playSparkSound,
}
