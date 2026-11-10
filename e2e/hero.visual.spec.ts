import { expect, test } from '@playwright/test'

const viewports = [
  { name: 'mobile-320', width: 320, height: 568 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
] as const

for (const viewport of viewports) {
  test(`hero visual ${viewport.name}`, async ({ page, isMobile }, testInfo) => {
    test.skip(isMobile)
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /we create impact/i })).toBeVisible()
    const hero = page.locator('.hero')
    const video = hero.locator('video')
    const cta = hero.getByRole('link', { name: /explore our work/i })
    await expect(hero.getByRole('button', { name: /background video/i })).toHaveCount(0)
    await expect(hero.locator('.hero-actions a')).toHaveCount(1)
    await expect(hero.getByRole('link', { name: /watch showreel/i })).toHaveCount(0)
    await expect(hero.locator('.hero-video-toggle')).toHaveCount(0)
    await expect(page.locator('#showreel')).toHaveCount(1)
    await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.readyState)).toBeGreaterThanOrEqual(2)
    await expect.poll(() => video.evaluate((el: HTMLVideoElement) => !el.paused)).toBe(true)
    expect(await video.evaluate((el: HTMLVideoElement) => el.autoplay && el.muted && el.loop && el.playsInline)).toBe(true)
    await expect(video).toHaveCSS('opacity', '1')
    await page.waitForTimeout(2200)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(overflow).toBe(false)
    await page.screenshot({ path: testInfo.outputPath(`${viewport.name}.png`), fullPage: false })
    await cta.click()
    await expect(page).toHaveURL(/\/work$/)
  })
}

test('hero respects reduced motion', async ({ page, isMobile }) => {
  test.skip(isMobile)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.hero-video')).toHaveCSS('display', 'none')
})

test('camera remains visible while the hero scrolls', async ({ page, isMobile }) => {
  test.skip(isMobile)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.waitForTimeout(1800)
  await page.evaluate(() => window.scrollTo(0, document.querySelector<HTMLElement>('.hero')!.offsetHeight * .72))
  await page.waitForTimeout(700)
  await expect(page.locator('.hero-video')).toHaveCSS('opacity', '1')
  await expect.poll(() => page.locator('.hero-video').evaluate((el: HTMLVideoElement) => !el.paused)).toBe(true)
})
