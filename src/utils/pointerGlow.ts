import type { PointerEvent } from 'react'

/**
 * Feeds the pointer position to CSS as `--mx` / `--my` (px, relative to the element) so a card can
 * draw a spotlight under the cursor. Writes straight to the DOM, so hovering never re-renders React.
 */
export function trackPointer(event: PointerEvent<HTMLElement>) {
  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  el.style.setProperty('--my', `${event.clientY - rect.top}px`)
}
