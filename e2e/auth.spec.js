// AutomatikPOST — E2E tests (Playwright)
const { test, expect } = require('@playwright/test')

test.describe('Authentication', () => {
  test('shows login page when not authenticated', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await expect(page.getByText('AutomatikPOST')).toBeVisible()
    await expect(page.getByPlaceholder('voce@empresa.com')).toBeVisible()
  })

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.fill('[placeholder="voce@empresa.com"]', 'wrong@email.com')
    await page.fill('[placeholder="••••••••"]', 'wrongpassword')
    await page.click('button[type=submit]')
    await expect(page.getByText(/incorretos|inválid/i)).toBeVisible({ timeout: 8000 })
  })

  test('switches between login and signup tabs', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.click('button:has-text("Criar conta")')
    await expect(page.getByPlaceholder('Ana Lima')).toBeVisible()
    await page.click('button:has-text("Entrar")')
    await expect(page.getByPlaceholder('Ana Lima')).not.toBeVisible()
  })
})
