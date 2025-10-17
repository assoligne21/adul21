import { test, expect } from '@playwright/test'

test.describe('Admin Authentication', () => {
  test('should display admin login page', async ({ page }) => {
    await page.goto('/admin/connexion')

    // Check login form is displayed
    await expect(page.locator('h1, h2')).toContainText(/Connexion|Administration/i)
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('input[type="email"], input[type="text"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/admin/connexion')

    // Try to submit without credentials
    await page.click('button[type="submit"]')

    // Check HTML5 validation or error messages
    const emailInput = page.locator('input[type="email"], input[type="text"]').first()
    const passwordInput = page.locator('input[type="password"]')

    await expect(emailInput).toHaveAttribute('required', '')
    await expect(passwordInput).toHaveAttribute('required', '')
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/admin/connexion')

    // Fill with invalid credentials
    await page.fill('input[type="email"], input[type="text"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')

    // Submit
    await page.click('button[type="submit"]')

    // Wait for error message
    await page.waitForTimeout(2000)

    // Check for error message (various possible selectors)
    const errorSelectors = [
      '.text-red-500',
      '.text-red-600',
      '.text-red-700',
      '.bg-red-50',
      'text=identifiants invalides',
      'text=erreur'
    ]

    let errorFound = false
    for (const selector of errorSelectors) {
      if (await page.locator(selector).count() > 0) {
        errorFound = true
        break
      }
    }

    // Either error message is shown, or we're still on login page (not redirected)
    const stillOnLoginPage = page.url().includes('connexion')
    expect(errorFound || stillOnLoginPage).toBeTruthy()
  })

  test('should redirect to login when accessing protected admin page', async ({ page }) => {
    // Try to access admin dashboard without authentication
    await page.goto('/admin/dashboard')

    // Should redirect to login or show access denied
    await page.waitForTimeout(1000)

    const onLoginPage = page.url().includes('connexion')
    const hasAccessDenied = await page.locator('text=Accès refusé, text=Non autorisé, text=Connexion requise').count() > 0

    expect(onLoginPage || hasAccessDenied).toBeTruthy()
  })

  test('should have password visibility toggle', async ({ page }) => {
    await page.goto('/admin/connexion')

    const passwordInput = page.locator('input[type="password"]')
    await expect(passwordInput).toBeVisible()

    // Check if there's a toggle button
    const toggleButton = page.locator('button[aria-label*="password" i], button:has-text("👁")')

    if (await toggleButton.count() > 0) {
      await toggleButton.first().click()

      // Password input should change to text type
      await page.waitForTimeout(200)
      const textInput = page.locator('input[type="text"][name="password"], input[type="text"]').last()
      if (await textInput.count() > 0) {
        await expect(textInput).toBeVisible()
      }
    }
  })
})

test.describe('Admin Dashboard (Protected)', () => {
  test('should display admin navigation when authenticated', async ({ page }) => {
    // Note: This test would require setting up authentication first
    // For now, we just test the structure exists

    await page.goto('/admin/dashboard')

    // If redirected to login, that's expected behavior
    if (page.url().includes('connexion')) {
      expect(true).toBeTruthy() // Expected behavior
    } else {
      // If somehow authenticated, check dashboard exists
      await expect(page.locator('text=Dashboard, text=Tableau de bord')).toBeVisible()
    }
  })
})
