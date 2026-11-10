import { expect, test } from '@playwright/test'

/**
 * Every service detail page shares one template (hero + deliverables, interactive
 * disciplines, CTA). Photography has its own spec; this covers the other three.
 */
const pages = [
  {
    slug: 'video-production',
    title: 'VIDEO PRODUCTION',
    description: 'End-to-end film production shaped around the idea — treatments, crews, shoots, edits, sound, colour, and delivery.',
    deliverables: ['Creative treatment and planning', 'Production and direction', 'Edit, sound and colour grade'],
    disciplines: ['Commercial Films', 'Brand Films', 'Product Films', 'Corporate Videos', 'Event Films', 'Wedding Films', 'Trailers & Short Films', 'Post-Production & Grade'],
    second: { id: 'brand', title: 'Brand Films' },
    effect: 'clapper',
    style: 'cinema',
  },
  {
    slug: 'content-creation',
    title: 'CONTENT CREATION',
    description: 'A repeatable content system with platform-aware concepts, flexible formats, and a consistent visual voice.',
    deliverables: ['Content concepts and formats', 'Platform-ready production', 'Modular aspect ratios and cutdowns'],
    disciplines: ['Reels & Short-Form', 'Social Campaigns', 'Creator-Led Content', 'Fashion & Lifestyle Content', 'Content Systems & Planning', 'Cutdowns & Versioning'],
    second: { id: 'campaigns', title: 'Social Campaigns' },
    effect: 'publish',
    style: 'format',
  },
  {
    slug: 'creative-solutions',
    title: 'CREATIVE SOLUTIONS',
    description: 'Creative direction that connects the brief to a practical, production-ready visual world.',
    deliverables: ['Creative direction', 'Visual treatments and story systems', 'Production design and supervision'],
    disciplines: ['Creative Direction', 'Concept Development', 'Visual Treatments & Moodboards', 'Storyboards & Pre-Vis', 'Production Design & Styling', 'Brand Visual Systems'],
    second: { id: 'concept', title: 'Concept Development' },
    effect: 'spark',
    style: 'studio',
  },
] as const

for (const service of pages) {
  test.describe(`service detail: ${service.slug}`, () => {
    test('renders the hero, deliverables and every discipline', async ({ page, isMobile }) => {
      await page.goto(`/services/${service.slug}`)

      await expect(page.getByRole('heading', { level: 1, name: service.title })).toBeVisible()
      await expect(page.getByText(service.description)).toBeVisible()
      await expect(page.getByText(/POSSIBLE DELIVERABLES/i)).toBeVisible()
      for (const deliverable of service.deliverables) {
        await expect(page.getByText(deliverable, { exact: true }).first()).toBeVisible()
      }

      const container = page.locator(isMobile ? '.disciplines-mobile-accordion' : '.disciplines-list')
      await expect(container).toBeVisible()
      const titleSelector = isMobile ? '.mobile-card-title' : '.discipline-item-title'
      await expect(container.locator(titleSelector)).toHaveCount(service.disciplines.length)
      for (const name of service.disciplines) {
        await expect(container.locator(titleSelector, { hasText: name }).first()).toBeVisible()
      }
    })

    test('switching discipline updates the preview', async ({ page, isMobile }) => {
      await page.goto(`/services/${service.slug}`)

      if (isMobile) {
        const accordion = page.locator('.disciplines-mobile-accordion')
        await accordion.getByRole('button', { name: new RegExp(service.second.title) }).click()
        await expect(page.locator(`#mobile-panel-${service.second.id}`)).toBeVisible()
      } else {
        await page.getByRole('tab', { name: new RegExp(service.second.title) }).hover()
        await expect(page.locator('.preview-service-title')).toHaveText(service.second.title)
        await expect(page.locator(`.preview-glass-frame.is-${service.style}`)).toBeVisible()

        // Preview imagery actually loads (guards against a bad path or missing file).
        await expect
          .poll(() => page.locator('.preview-image').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
          .toBe(true)
      }
    })

    test('signature button plays its screen effect and cleans up', async ({ page }) => {
      await page.goto(`/services/${service.slug}`)

      await page.locator('.svc-signature-btn').click()
      await expect(page.locator(`.svc-fx-${service.effect}`)).toHaveCount(1)
      await expect(page.locator('.svc-fx')).toHaveCount(0, { timeout: 4000 })
    })

    test('hero heading and page never overflow horizontally', async ({ page }) => {
      await page.goto(`/services/${service.slug}`)
      await expect(page.getByRole('heading', { level: 1, name: service.title })).toBeVisible()

      const overflow = await page.evaluate(() => {
        const heading = document.querySelector('.svc-main-heading') as HTMLElement
        return {
          heading: heading.scrollWidth - heading.clientWidth,
          page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        }
      })
      expect(overflow.heading).toBeLessThanOrEqual(1)
      expect(overflow.page).toBeLessThanOrEqual(0)
    })

    test('closing call to action links to the contact page', async ({ page }) => {
      await page.goto(`/services/${service.slug}`)

      await expect(page.getByRole('heading', { name: /LET'S SHAPE THE RIGHT PRODUCTION FOR YOUR IDEA/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /Discuss Your Project/i })).toHaveAttribute('href', '/contact')
    })
  })
}

test('content creation format switcher reshapes the preview frame', async ({ page, isMobile }) => {
  test.skip(isMobile, 'The interactive preview is desktop-only; mobile uses the accordion.')
  await page.goto('/services/content-creation')

  const frame = page.locator('.preview-format-frame')
  const tag = page.locator('.preview-format-tag')
  await expect(tag).toHaveText(/9:16/)

  const vertical = await frame.boundingBox()
  await page.getByRole('button', { name: /16:9/ }).click()
  await expect(tag).toHaveText(/16:9/)
  // Width change is transitioned; wait until it settles.
  await expect.poll(async () => (await frame.boundingBox())!.width).toBeGreaterThan(vertical!.width * 2)

  const wide = (await frame.boundingBox())!
  expect(wide.width / wide.height).toBeGreaterThan(1.6)
})

test('video production preview runs a live timecode', async ({ page, isMobile }) => {
  test.skip(isMobile, 'The interactive preview is desktop-only; mobile uses the accordion.')
  await page.goto('/services/video-production')

  const timecode = page.locator('.hud-timecode')
  await expect(timecode).toHaveText(/^\d\d:\d\d:\d\d:\d\d$/)
  const first = await timecode.textContent()
  await page.waitForTimeout(1200)
  expect(await timecode.textContent()).not.toBe(first)
})

test('reduced motion: content stays visible and no screen effect is shown', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/services/video-production')

  await expect(page.getByRole('heading', { level: 1, name: 'VIDEO PRODUCTION' })).toBeVisible()
  await page.locator('.svc-signature-btn').click()
  await expect(page.locator('.svc-fx')).toBeHidden()
  // Scroll-reveal must not leave anything hidden.
  await expect(page.locator('[data-reveal-state="hidden"]')).toHaveCount(0)
})
