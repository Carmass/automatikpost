const { test, expect } = require('@playwright/test')

test.describe('Publish flow', () => {
  test('creates a post and opens editor', async ({ page }) => {
    await page.goto('http://localhost:5173')
    // After auth (assumes beforeAll handles login globally)
    await page.click('.fab')
    await expect(page.locator('.tbt')).toContainText('Criar Post')
    await page.click('text=Quick Post')
    await expect(page.getByPlaceholder('Título do Post...')).toBeVisible()
  })
})
