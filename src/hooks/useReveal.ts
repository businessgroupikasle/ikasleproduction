import { useLayoutEffect, type CSSProperties, type RefObject } from 'react'

/** Inline style that staggers a `data-reveal` element: `style={revealDelay(index)}`. */
export function revealDelay(step: number): CSSProperties {
  return { '--reveal-delay': step } as CSSProperties
}

/**
 * Scroll-reveal for a section: every descendant marked `data-reveal` starts hidden and
 * animates in (CSS, see `[data-reveal-state]` in service-detail.css) when it scrolls into view.
 * Stagger by setting `--reveal-delay` (a unitless step) on the element.
 *
 * Content is left fully visible when the user prefers reduced motion or the browser
 * has no IntersectionObserver, so the effect can never hide content permanently.
 */
export function useReveal(containerRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const targets = Array.from(container.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (targets.length === 0) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || typeof IntersectionObserver === 'undefined') return

    targets.forEach((el) => {
      el.dataset.revealState = 'hidden'
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          el.dataset.revealState = 'in'
          observer.unobserve(el)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )

    targets.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      // Never leave content hidden if the effect is torn down mid-reveal.
      targets.forEach((el) => {
        delete el.dataset.revealState
      })
    }
  }, [containerRef])
}
