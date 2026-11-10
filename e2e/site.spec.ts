import { expect, test } from '@playwright/test'

test('home page and primary journeys work', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /we create impact/i })).toBeVisible()
  await page.getByRole('link', { name: /explore our work/i }).click()
  await expect(page).toHaveURL(/\/work$/)
  await expect(page.getByRole('heading', { name: /the idea/i })).toBeVisible()
})

test('contact form never claims unconfigured delivery', async ({ page }) => {
  await page.goto('/contact')
  await page.getByLabel('Name').fill('Test Person')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Service').selectOption({ label: 'Photography' })
  await page.getByLabel('Project description').fill('A sufficiently detailed test project description.')
  await page.getByRole('button', { name: /send project brief/i }).click()
  await expect(page.getByText(/delivery is not configured yet/i)).toBeVisible()
})

test('mobile menu opens and closes after navigation', async ({ page, isMobile }) => {
  test.skip(!isMobile)
  await page.goto('/')
  await page.getByRole('button', { name: /open menu/i }).click()
  await page.getByRole('navigation', { name: /mobile navigation/i }).getByRole('link', { name: 'About' }).click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(page.getByRole('heading', { name: /tangible/i })).toBeVisible()
})
