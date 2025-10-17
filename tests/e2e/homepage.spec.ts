import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display homepage with hero banner', async ({ page }) => {
    // Check hero section is visible
    await expect(page.locator('text=Rétablissons la ligne 21 directe vers Nîmes')).toBeVisible()

    // Check key information is displayed
    await expect(page.locator('text=45 minutes')).toBeVisible() // Travel time impact
    await expect(page.locator('text=300+ élèves')).toBeVisible() // Impacted students
  })

  test('should navigate to all main sections', async ({ page }) => {
    // Test navigation to "Arguments juridiques"
    await page.click('a:has-text("Arguments")')
    await expect(page).toHaveURL(/arguments-juridiques/)

    // Go back and test "Actualités"
    await page.goto('/')
    await page.click('a:has-text("Actualités")')
    await expect(page).toHaveURL(/actualites/)

    // Go back and test "Témoignages"
    await page.goto('/')
    await page.click('a:has-text("Témoignages")')
    await expect(page).toHaveURL(/temoignages/)

    // Go back and test "Contact"
    await page.goto('/')
    await page.click('a:has-text("Contact")')
    await expect(page).toHaveURL(/contact/)
  })

  test('should display "Did You Know" infographics section', async ({ page }) => {
    await expect(page.locator('text=Le saviez-vous ?')).toBeVisible()
  })

  test('should display testimonies preview section', async ({ page }) => {
    await expect(page.locator('text=Ils témoignent')).toBeVisible()
    await expect(page.locator('text=Voir tous les témoignages')).toBeVisible()
  })

  test('should display CTA section', async ({ page }) => {
    // Check for call-to-action elements
    await expect(page.locator('text=Agissez avec nous')).toBeVisible()
  })

  test('should have working footer links', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Check footer is visible
    await expect(page.locator('footer')).toBeVisible()

    // Test "Mentions légales" link
    await page.click('footer a:has-text("Mentions légales")')
    await expect(page).toHaveURL(/mentions-legales/)
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check hero is still visible
    await expect(page.locator('text=Rétablissons la ligne 21')).toBeVisible()

    // Check mobile menu button exists
    const menuButton = page.locator('button[aria-label*="menu" i], button:has-text("Menu")')
    if (await menuButton.count() > 0) {
      await expect(menuButton.first()).toBeVisible()
    }
  })
})
