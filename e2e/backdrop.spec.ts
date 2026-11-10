import { expect, test, type Page } from '@playwright/test'

/** Every route and the backdrop scene it should play. */
const SCENES: Array<[string, string]> = [
  ['/', 'home'],
  ['/about', 'about'],
  ['/services', 'services'],
  ['/services/photography', 'service'],
  ['/services/video-production', 'service'],
  ['/work', 'work'],
  ['/contact', 'contact'],
  ['/privacy-policy', 'legal'],
  ['/terms-and-conditions', 'legal'],
  ['/not-a-real-page', 'lost'],
]

/** Scrolls the whole page in steps so every scroll-reveal fires. */
async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += 260) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
    await page.waitForTimeout(40)
  }
}

for (const [route, scene] of SCENES) {
  test(`backdrop plays the "${scene}" scene on ${route}`, async ({ page }) => {
    await page.goto(route)
    const backdrop = page.locator('.site-backdrop')
    await expect(backdrop).toHaveAttribute('data-scene', scene)

    // It sits behind the content, covers the viewport, and never eats clicks.
    const style = await backdrop.evaluate((el) => {
      const cs = getComputedStyle(el)
      const box = el.getBoundingClientRect()
      return { position: cs.position, zIndex: cs.zIndex, events: cs.pointerEvents, top: box.top, width: box.width, height: box.height }
    })
    expect(style.position).toBe('fixed')
    expect(Number(style.zIndex)).toBeLessThan(0)
    expect(style.events).toBe('none')
    expect(style.top).toBe(0)
    expect(style.width).toBeGreaterThanOrEqual((page.viewportSize()?.width ?? 0) - 1)
  })
}

test('light dust is drawn on the canvas and the backdrop follows the viewport', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(1200)

  const drawn = await page.locator('.bd-dust').evaluate((canvas: HTMLCanvasElement) => {
    const data = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data
    let lit = 0
    for (let i = 3; i < data.length; i += 4) if (data[i] > 0) lit += 1
    return lit
  })
  expect(drawn).toBeGreaterThan(50)

  await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' }))
  const top = await page.locator('.site-backdrop').evaluate((el) => el.getBoundingClientRect().top)
  expect(top).toBe(0)
})

test('scroll progress line and timecode rail follow the page', async ({ page, isMobile }) => {
  await page.goto('/about')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  const scale = () => page.locator('.site-progress i').evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a)
  expect(await scale()).toBeLessThan(0.05)

  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))
  await expect.poll(scale).toBeGreaterThan(0.95)

  // The side rail is only shown on wide screens.
  const rail = page.locator('.site-rail')
  if (isMobile) await expect(rail).toBeHidden()
  else {
    await expect(rail).toBeVisible()
    await expect(page.locator('.site-rail-time')).not.toHaveText('00:00:00:00')
  }
})

test('the backdrop retints when moving between pages', async ({ page, isMobile }) => {
  test.skip(isMobile, 'The inline navigation is a menu on phones; the scene switch itself is covered per route above.')
  await page.goto('/')
  const hue = () => page.locator('.site-fx').evaluate((el) => Number(getComputedStyle(el).getPropertyValue('--bd-hue')))
  expect(await hue()).toBe(268)

  await page.getByRole('navigation', { name: /primary navigation/i }).getByRole('link', { name: 'Services' }).click()
  await expect(page.locator('.site-backdrop')).toHaveAttribute('data-scene', 'services')
  await expect.poll(hue, { timeout: 5000 }).toBe(258)
})

test('home: every section reveals as it is scrolled to', async ({ page, isMobile }) => {
  test.skip(isMobile, 'The same reveal logic runs on phones; this walks the desktop layout.')
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: /we create impact/i })).toBeVisible()
  await scrollThrough(page)

  await expect(page.locator('[data-reveal-state="hidden"]')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 2, name: 'OUR WORK SPEAKS IN FRAMES.' })).toBeVisible()
  await expect(page.locator('.fx-marquee').first()).toBeAttached()
})

test('services page: cards reveal and the call to action links to contact', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Reveal logic is shared with the desktop run.')
  await page.goto('/services')
  await expect(page.getByRole('heading', { level: 1, name: 'ONE STUDIO. MANY FORMS.' })).toBeVisible()
  await scrollThrough(page)

  await expect(page.locator('[data-reveal-state="hidden"]')).toHaveCount(0)
  await expect(page.locator('.service-theme-card')).toHaveCount(4)
  await expect(page.getByRole('link', { name: /Discuss your project/i })).toHaveAttribute('href', '/contact')
})

test('legal pages number their clauses and stamp the draft notice', async ({ page, isMobile }) => {
  await page.goto('/privacy-policy')
  await expect(page.getByRole('heading', { level: 1, name: 'PRIVACY POLICY' })).toBeVisible()
  await expect(page.locator('.legal-clause')).toHaveCount(3)

  // The clause number comes from a CSS counter, which Chrome reports unresolved; check the rule is in place.
  const marker = await page.locator('.legal-clause').first().evaluate((el) => getComputedStyle(el, '::before').content)
  expect(marker).toContain('counter(clause')
  if (!isMobile) {
    const stamp = await page.locator('.legal-notice').evaluate((el) => getComputedStyle(el, '::after').content)
    expect(stamp).toBe('"DRAFT"')
  }

  await page.goto('/terms-and-conditions')
  await expect(page.getByRole('heading', { level: 1, name: 'TERMS & CONDITIONS' })).toBeVisible()
  await expect(page.locator('.legal-clause')).toHaveCount(3)
})

test('404 page keeps its message and offers the way home', async ({ page }) => {
  await page.goto('/not-a-real-page')
  await expect(page.getByRole('heading', { level: 1, name: "THIS SHOT DIDN'T MAKE THE FINAL CUT." })).toBeVisible()
  await expect(page.locator('.lost-leader b')).toHaveCount(3)
  await page.getByRole('link', { name: 'Return home' }).click()
  await expect(page).toHaveURL('/')
})

test('reduced motion: backdrop is still, nothing is hidden, headings stay readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const route of ['/', '/services', '/privacy-policy', '/not-a-real-page']) {
    await page.goto(route)
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
    await expect(page.locator('[data-reveal-state="hidden"]')).toHaveCount(0)
  }

  await page.goto('/')
  // No animation loop: the dust is painted once and the parallax is not applied.
  await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }))
  await page.waitForTimeout(300)
  const transform = await page.locator('.bd-parallax').evaluate((el) => (el as HTMLElement).style.transform)
  expect(transform).toBe('')
  const wordsVisible = await page.locator('.split-word > span').first().evaluate((el) => getComputedStyle(el).transform)
  expect(wordsVisible).toBe('none')
})

test('no page grows a horizontal scrollbar with the backdrop in place', async ({ page }) => {
  for (const [route] of SCENES) {
    await page.goto(route)
    await page.waitForTimeout(300)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow, route).toBeLessThanOrEqual(0)
  }
})
