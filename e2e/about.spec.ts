import { expect, test } from '@playwright/test'

test('about page renders every section', async ({ page }) => {
  await page.goto('/about')

  await expect(page.getByRole('heading', { level: 1, name: 'IDEAS, MADE TANGIBLE.' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Creative thinking belongs close to the camera.' })).toBeVisible()
  await expect(page.getByRole('list', { name: 'How we think' }).getByRole('listitem')).toHaveCount(3)
  await expect(page.getByRole('heading', { level: 2, name: 'FROM THE FIRST IDEA TO THE FINAL FRAME.' })).toBeVisible()
  await expect(page.getByRole('region', { name: /project process/i }).getByRole('listitem')).toHaveCount(6)
  await expect(page.getByRole('heading', { level: 2, name: "BRING US THE SPARK. WE'LL BUILD THE FRAME." })).toBeVisible()
})

test('pull focus moves the viewfinder to the next frame', async ({ page }) => {
  await page.goto('/about')

  const frame = page.locator('.about-vf-frame')
  await expect(frame).toHaveText(/FRAME 01 \/ 03/)
  await page.getByRole('button', { name: /Pull Focus/i }).click()
  await expect(frame).toHaveText(/FRAME 02 \/ 03/)
  await expect(page.locator('.about-vf-img.is-active')).toHaveCount(1)

  // Picking a frame directly works too, and the pick holds while the pointer is over the viewfinder.
  await page.getByRole('button', { name: /Frame 3/ }).click()
  await expect(frame).toHaveText(/FRAME 03 \/ 03/)

  // The active frame's image actually loads.
  await expect
    .poll(() => page.locator('.about-vf-img.is-active').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
    .toBe(true)
})

test('viewfinder advances on its own when motion is allowed', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Autoplay is exercised on desktop; the logic is identical on mobile.')
  await page.goto('/about')

  await expect(page.locator('.about-vf-frame')).toHaveText(/FRAME 01/)
  // Park the pointer away from the viewfinder (hovering pauses autoplay), then wait one interval.
  await page.mouse.move(5, 400)
  await expect(page.locator('.about-vf-frame')).toHaveText(/FRAME 02/, { timeout: 9000 })
})

test('film strip: hovering a frame dims the others', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Hover only applies to pointer devices.')
  await page.goto('/about')

  const frames = page.locator('.about-frame-card')
  await frames.first().scrollIntoViewIfNeeded()
  // Let the playhead sweep and the reveal finish so opacity reflects hover only.
  await page.waitForTimeout(2800)

  await frames.nth(3).hover()
  await expect
    .poll(() => frames.nth(0).evaluate((el) => Number(getComputedStyle(el).opacity)))
    .toBeLessThan(0.6)
  expect(await frames.nth(3).evaluate((el) => Number(getComputedStyle(el).opacity))).toBe(1)
})

test('film strip scrolls sideways on phones without widening the page', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Desktop shows all six frames in a grid.')
  await page.goto('/about')

  const strip = page.locator('.about-strip-wrap')
  await strip.scrollIntoViewIfNeeded()
  const metrics = await strip.evaluate((el) => ({ scroll: el.scrollWidth, client: el.clientWidth }))
  expect(metrics.scroll).toBeGreaterThan(metrics.client)

  await strip.evaluate((el) => el.scrollTo({ left: el.scrollWidth, behavior: 'instant' }))
  await expect(page.locator('.about-frame-card').last()).toBeInViewport()
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0)
})

test('scrolling through the page reveals every section', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Sideways-scrolling frames on phones reveal as they are swiped to.')
  await page.goto('/about')
  // The page is lazy-loaded: measure the scroll height only once it has rendered, not the loading fallback.
  await expect(page.getByRole('heading', { level: 1, name: 'IDEAS, MADE TANGIBLE.' })).toBeVisible()

  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += 180) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
    await page.waitForTimeout(50)
  }
  await expect(page.locator('[data-reveal-state="hidden"]')).toHaveCount(0)
})

test('hero heading and page never overflow horizontally', async ({ page }) => {
  await page.goto('/about')
  await expect(page.getByRole('heading', { level: 1, name: 'IDEAS, MADE TANGIBLE.' })).toBeVisible()

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

test('reduced motion: nothing hidden, no autoplay, no sweep', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/about')

  await expect(page.getByRole('heading', { level: 1, name: 'IDEAS, MADE TANGIBLE.' })).toBeVisible()
  await expect(page.locator('[data-reveal-state="hidden"]')).toHaveCount(0)
  await expect(page.locator('.about-playhead')).toBeHidden()

  // Stays on the first frame well past the 5.5s autoplay interval.
  await page.mouse.move(5, 400)
  await page.waitForTimeout(6500)
  await expect(page.locator('.about-vf-frame')).toHaveText(/FRAME 01/)
})
