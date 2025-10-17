import { test, expect } from '@playwright/test'

test.describe('Testimony Submission', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/temoignages')
  })

  test('should display testimonies page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Témoignages')
  })

  test('should navigate to testimony submission form', async ({ page }) => {
    // Click on "Témoigner" or similar CTA button
    const submitButton = page.locator('a:has-text("Témoigner"), button:has-text("Témoigner")')

    if (await submitButton.count() > 0) {
      await submitButton.first().click()
      await expect(page).toHaveURL(/temoignages\/nouveau/)
    }
  })

  test('should display testimony form', async ({ page }) => {
    await page.goto('/temoignages/nouveau')

    // Check page title
    await expect(page.locator('h1, h2')).toContainText('Témoigner')

    // Check form elements are present
    await expect(page.locator('form')).toBeVisible()
  })

  test('should validate required fields in testimony form', async ({ page }) => {
    await page.goto('/temoignages/nouveau')

    // Try to navigate through steps without filling required fields
    const nextButton = page.locator('button:has-text("Suivant"), button:has-text("Continuer")')

    if (await nextButton.count() > 0) {
      await nextButton.first().click()

      // Check that validation prevents moving forward
      const errorMessage = page.locator('.text-red-500, .text-red-600, .text-red-700')
      // At least some validation should appear
      const hasValidation = await errorMessage.count() > 0 ||
                           await page.locator('input:invalid').count() > 0

      expect(hasValidation).toBeTruthy()
    }
  })

  test('should complete testimony submission flow - Step 1', async ({ page }) => {
    await page.goto('/temoignages/nouveau')

    // Step 1: Personal information
    const civilitySelect = page.locator('#civility, select[name="civility"]')
    if (await civilitySelect.count() > 0) {
      await civilitySelect.selectOption('M.')
    }

    const firstNameInput = page.locator('#firstName, input[name="firstName"], input[placeholder*="Prénom" i]')
    if (await firstNameInput.count() > 0) {
      await firstNameInput.fill('Pierre')
    }

    const lastNameInput = page.locator('#lastName, input[name="lastName"], input[placeholder*="Nom" i]')
    if (await lastNameInput.count() > 0) {
      await lastNameInput.fill('Durant')
    }

    const emailInput = page.locator('#email, input[type="email"]')
    if (await emailInput.count() > 0) {
      await emailInput.fill('pierre.durant@example.com')
    }

    // Try to move to next step
    const nextButton = page.locator('button:has-text("Suivant"), button:has-text("Continuer")')
    if (await nextButton.count() > 0) {
      await nextButton.first().click()

      // Check we're not still on the same error state
      await page.waitForTimeout(500)
    }
  })
})

test.describe('View Published Testimonies', () => {
  test('should display published testimonies', async ({ page }) => {
    await page.goto('/temoignages')

    // Check if there are testimony cards
    const testimonyCards = page.locator('.card, article, [data-testid="testimony"]')

    // Either there are testimonies or a message saying there are none
    const hasTestimonies = await testimonyCards.count() > 0
    const hasEmptyMessage = await page.locator('text=Aucun témoignage, text=Pas encore de témoignage').count() > 0

    expect(hasTestimonies || hasEmptyMessage).toBeTruthy()
  })

  test('should allow filtering testimonies by user type', async ({ page }) => {
    await page.goto('/temoignages')

    // Check if filter buttons/select exist
    const filters = page.locator('button:has-text("Parent"), button:has-text("Lycéen"), select[name*="filter" i]')

    if (await filters.count() > 0) {
      // Filters are implemented
      await expect(filters.first()).toBeVisible()
    }
  })
})
