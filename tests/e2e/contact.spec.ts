import { test, expect } from '@playwright/test'

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('should display contact page with form', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Contactez-nous')

    // Check contact info is displayed
    await expect(page.locator('text=assoligne21@gmail.com')).toBeVisible()
    await expect(page.locator('text=Délai de réponse')).toBeVisible()
    await expect(page.locator('text=Confidentialité')).toBeVisible()

    // Check form is displayed
    await expect(page.locator('form')).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]')

    // Check HTML5 validation prevents submission
    const civilityInput = page.locator('#civility')
    await expect(civilityInput).toHaveAttribute('required', '')
  })

  test('should successfully submit contact form', async ({ page }) => {
    // Fill civility
    await page.selectOption('#civility', 'M.')

    // Fill first name
    await page.fill('#firstName', 'Jean')

    // Fill last name
    await page.fill('#lastName', 'Dupont')

    // Fill email
    await page.fill('#email', 'jean.dupont@example.com')

    // Fill phone (optional)
    await page.fill('#phone', '0612345678')

    // Select subject
    await page.selectOption('#subject', 'testimony')

    // Fill message
    await page.fill('#message', 'Ceci est un message de test pour vérifier le bon fonctionnement du formulaire de contact.')

    // Accept RGPD
    await page.check('input[type="checkbox"]')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for success message
    await expect(page.locator('.bg-green-50')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Votre message a été envoyé avec succès')).toBeVisible()

    // Check form is reset
    await expect(page.locator('#firstName')).toHaveValue('')
  })

  test('should display all subject options', async ({ page }) => {
    const subjectSelect = page.locator('#subject')

    // Get all options
    const options = await subjectSelect.locator('option').allTextContents()

    // Verify all expected options are present
    expect(options).toContain('Témoignage')
    expect(options).toContain('Adhésion')
    expect(options).toContain('Bénévolat')
    expect(options).toContain('Demande presse/média')
    expect(options).toContain('Question juridique')
    expect(options).toContain('Autre')
  })

  test('should disable submit button while submitting', async ({ page }) => {
    // Fill form quickly
    await page.selectOption('#civility', 'Mme')
    await page.fill('#firstName', 'Marie')
    await page.fill('#lastName', 'Martin')
    await page.fill('#email', 'marie.martin@example.com')
    await page.selectOption('#subject', 'other')
    await page.fill('#message', 'Test message')
    await page.check('input[type="checkbox"]')

    // Click submit
    await page.click('button[type="submit"]')

    // Check button is disabled during submission
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeDisabled()

    // Wait for completion
    await page.waitForSelector('.bg-green-50, .bg-red-50', { timeout: 10000 })
  })
})
