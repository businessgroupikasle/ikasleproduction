import type { CSSProperties } from 'react'

interface MarqueeProps {
  items: readonly string[]
  /** Seconds for one full loop. Larger is slower. */
  duration?: number
  reverse?: boolean
  /** Huge outlined words instead of a small ticker line (used as a ghost behind a section). */
  outline?: boolean
  className?: string
}

/**
 * A slow, endless ticker of words. The group is rendered twice so the loop is seamless;
 * it is purely decorative, so it is hidden from assistive tech. Pauses on hover.
 */
export function Marquee({ items, duration = 46, reverse = false, outline = false, className = '' }: MarqueeProps) {
  const classes = ['fx-marquee', reverse ? 'is-reverse' : '', outline ? 'is-outline' : '', className].filter(Boolean).join(' ')

  return (
    <div className={classes} aria-hidden="true">
      <div className="fx-marquee-track" style={{ '--dur': `${duration}s` } as CSSProperties}>
        {[0, 1].map((copy) => (
          <div className="fx-marquee-group" key={copy}>
            {items.map((item) => (
              <span className="fx-marquee-item" key={item}>
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
