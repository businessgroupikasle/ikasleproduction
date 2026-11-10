import { expect, test } from '@playwright/test'

/**
 * Text sizes come from the shared type scale (--fs-* tokens in global.css), so a page title is the
 * same size on every page. This guards that: if a page hard-codes its own heading size, it fails here.
 */
const routes = [
  '/',
  '/about',
  '/services',
  '/services/photography',
  '/services/video-production',
  '/services/content-creation',
  '/services/creative-solutions',
  '/work',
  '/contact',
  '/privacy-policy',
  '/terms-and-conditions',
  '/not-a-real-page',
]

test('every page uses the shared type scale for its titles', async ({ page }) => {
  const problems: string[] = []
  let sampleTitle = 0

  for (const route of routes) {
    await page.goto(route)
    await expect(page.locator('h1').first()).toBeVisible()
    // Wait for any lazy content so every heading on the page is present.
    await page.waitForLoadState('networkidle')

    const result = await page.evaluate(() => {
      // Resolve each token to pixels by measuring a probe element that uses it.
      const px = (token: string) => {
        const probe = document.createElement('span')
        probe.style.cssText = `position:absolute;visibility:hidden;font-size:var(${token})`
        document.body.append(probe)
        const size = parseFloat(getComputedStyle(probe).fontSize)
        probe.remove()
        return Math.round(size * 100) / 100
      }
      const size = (el: Element) => Math.round(parseFloat(getComputedStyle(el).fontSize) * 100) / 100
      return {
        display: px('--fs-display'),
        headings: [px('--fs-title'), px('--fs-subtitle'), px('--fs-card')],
        h1: [...document.querySelectorAll('h1')].map(size),
        h2: [...document.querySelectorAll('main h2')].map((el) => ({ text: (el.textContent ?? '').trim().slice(0, 30), size: size(el) })),
      }
    })

    sampleTitle = result.display
    for (const h1 of result.h1) {
      if (h1 !== result.display) problems.push(`${route}: h1 is ${h1}px, expected ${result.display}px (--fs-display)`)
    }
    for (const h2 of result.h2) {
      if (!result.headings.includes(h2.size)) {
        problems.push(`${route}: h2 "${h2.text}" is ${h2.size}px, expected one of ${result.headings.join(' / ')}px (--fs-title / --fs-subtitle / --fs-card)`)
      }
    }
  }

  expect(problems, problems.join('\n')).toEqual([])
  // Sanity: the scale itself stays modest (the old per-page sizes reached 130-160px).
  expect(sampleTitle).toBeLessThanOrEqual(80)
})
