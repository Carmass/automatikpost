const { test, expect } = require('@playwright/test')

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login with test credentials (set in .env.test)
    await page.goto('http://localhost:5173')
    const email = process.env.TEST_EMAIL || 'test@automatikpost.com'
    const pass  = process.env.TEST_PASS  || 'test123456'
    await page.fill('[placeholder="voce@empresa.com"]', email)
    await page.fill('[placeholder="••••••••"]', pass)
    await page.click('button[type=submit]')
    await page.waitForURL('http://localhost:5173')
    await page.waitForSelector('.tb')
  })

  test('shows dashboard metrics', async ({ page }) => {
    await expect(page.locator('.mg .mc')).toHaveCount(4)
  })

  test('command palette opens with Cmd+K', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await expect(page.getByPlaceholder('Buscar páginas e ações...')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByPlaceholder('Buscar páginas e ações...')).not.toBeVisible()
  })

  test('navigates to Posts page', async ({ page }) => {
    await page.click('.ni:has-text("Posts")')
    await expect(page.locator('.tbt')).toContainText('Posts')
  })
})
