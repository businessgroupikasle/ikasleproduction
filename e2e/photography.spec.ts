import { expect, test } from '@playwright/test'

test('photography service detail page renders all required sections and interactions', async ({ page, isMobile }) => {
  await page.goto('/services/photography')

  // 1. Heading and description
  const mainHeading = page.getByRole('heading', { name: /^PHOTOGRAPHY$/i })
  await expect(mainHeading).toBeVisible()

  await expect(
    page.getByText(
      'Purposeful image-making for brands, products, portraits, and editorial stories — from visual planning through the final grade.'
    )
  ).toBeVisible()

  // 2. Possible Deliverables card
  await expect(page.getByText(/POSSIBLE DELIVERABLES/i)).toBeVisible()
  await expect(page.getByText('Campaign and Editorial Photography')).toBeVisible()
  await expect(page.getByText('Product and People Photography')).toBeVisible()
  await expect(page.getByText('Retouching and Colour Finishing')).toBeVisible()

  // 3. 10 Photography services
  const services = [
    'Product Photography',
    'Wedding Photography',
    'Event Photography',
    'Fashion Photography',
    'Corporate Photography',
    'Commercial Photography',
    'Portrait Photography',
    'Food Photography',
    'Architectural Photography',
    'Industrial Photography',
  ]

  if (isMobile) {
    // On mobile, services are displayed in the accordion container
    const accordion = page.locator('.disciplines-mobile-accordion')
    await expect(accordion).toBeVisible()

    for (const name of services) {
      await expect(accordion.locator('.mobile-card-title', { hasText: name })).toBeVisible()
    }

    // Tap to expand Wedding Photography
    const weddingTrigger = accordion.getByRole('button', { name: /Wedding Photography/i })
    await weddingTrigger.click()
    await expect(page.locator('#mobile-panel-wedding')).toBeVisible()
    await expect(page.locator('#mobile-panel-product')).toHaveCount(0)
  } else {
    // On desktop, services are in the vertical list with dynamic preview
    const list = page.locator('.disciplines-list')
    await expect(list).toBeVisible()

    for (const name of services) {
      await expect(list.locator('.discipline-item-title', { hasText: name })).toBeVisible()
    }

    // Hover interaction on desktop
    const weddingTab = page.getByRole('tab', { name: /Wedding Photography/i })
    await weddingTab.hover()
    await expect(page.locator('.preview-service-title')).toHaveText('Wedding Photography')
  }

  // 4. Bottom CTA section
  await expect(page.getByRole('heading', { name: /LET'S SHAPE THE RIGHT PRODUCTION FOR YOUR IDEA/i })).toBeVisible()
  const ctaBtn = page.getByRole('link', { name: /Discuss Your Project/i })
  await expect(ctaBtn).toBeVisible()
  await expect(ctaBtn).toHaveAttribute('href', '/contact')
})
