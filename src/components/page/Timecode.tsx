import { useEffect, useRef } from 'react'
import { formatTimecode } from '../../utils/timecode'

/**
 * Running 24 fps timecode. Re-mount it (change its `key`) to restart from 00:00:00:00.
 * Stays static for reduced-motion users.
 */
export function Timecode() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const start = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      el.textContent = formatTimecode((now - start) / 1000)
      frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <span ref={ref} className="hud-timecode">
      00:00:00:00
    </span>
  )
}
