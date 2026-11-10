import type { CSSProperties } from 'react'
import type { SignatureEffect } from '../../data/serviceDetails'

const SPARK_COUNT = 14

/**
 * Full-screen, non-interactive effect layer that plays once when a service's
 * signature button is pressed. Hidden entirely for reduced-motion users via CSS.
 */
export function ServiceFx({ effect }: { effect: SignatureEffect }) {
  if (effect === 'shutter') {
    return <div className="svc-fx svc-fx-shutter" aria-hidden="true" />
  }

  if (effect === 'clapper') {
    return (
      <div className="svc-fx svc-fx-clapper" aria-hidden="true">
        <span className="svc-fx-bar is-top" />
        <span className="svc-fx-bar is-bottom" />
        <span className="svc-fx-clap-text">ACTION</span>
      </div>
    )
  }

  if (effect === 'publish') {
    return (
      <div className="svc-fx svc-fx-publish" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className="svc-fx-ring" style={{ '--i': i } as CSSProperties} />
        ))}
        <span className="svc-fx-live-toast">
          <span className="svc-fx-live-dot" />
          LIVE · Published in every format
        </span>
      </div>
    )
  }

  return (
    <div className="svc-fx svc-fx-spark" aria-hidden="true">
      <span className="svc-fx-glow" />
      {Array.from({ length: SPARK_COUNT }, (_, i) => (
        <i
          key={i}
          className="svc-fx-particle"
          style={
            {
              '--angle': `${(360 / SPARK_COUNT) * i}deg`,
              '--dist': `${14 + (i % 3) * 5}vmin`,
              '--delay': `${(i % 4) * 30}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
