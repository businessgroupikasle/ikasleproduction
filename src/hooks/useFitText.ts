import { useLayoutEffect, type RefObject } from 'react'

/**
 * Shrinks an element's font-size just enough that its longest unbreakable word fits its box.
 *
 * The hero heading uses `background-clip: text`, which only paints inside the element's box,
 * so a long word such as "PHOTOGRAPHY" or "PRODUCTION" would otherwise be clipped
 * at narrower desktop widths. Clearing the inline size first lets the CSS `clamp()` stay in
 * charge whenever the text already fits.
 *
 * Two guards keep this from ever oscillating:
 *  - Transitions are disabled on the element. The site's global reduced-motion rule gives every
 *    element a 0.01ms transition on `all`, and a font-size transition makes the "reset, then
 *    measure" step read the stale pre-transition size.
 *  - Only a change in the observed container's *width* triggers a re-fit. Height changes are
 *    caused by this hook's own font-size change and must not feed back into it.
 */
export function useFitText(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    el.style.setProperty('transition', 'none', 'important')

    const fit = () => {
      el.style.fontSize = ''
      const available = el.clientWidth
      const needed = el.scrollWidth
      if (!available || needed <= available) return

      const base = parseFloat(getComputedStyle(el).fontSize)
      // 3% breathing room covers the negative letter-spacing overhang of the last glyph.
      el.style.fontSize = `${((base * available) / needed) * 0.97}px`
    }

    fit()

    let lastWidth = -1
    const observer = new ResizeObserver((entries) => {
      const width = Math.round(entries[0]?.contentRect.width ?? -1)
      if (width === lastWidth) return
      lastWidth = width
      fit()
    })
    observer.observe(el.parentElement ?? el)
    void document.fonts?.ready.then(fit)

    return () => {
      observer.disconnect()
      el.style.fontSize = ''
      el.style.removeProperty('transition')
    }
  }, [ref])
}
