const { defineConfig } = require('@playwright/test')
module.exports = defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:5173', headless: true, screenshot: 'only-on-failure' },
  webServer: { command: 'npm run dev', port: 5173, reuseExistingServer: true }
})
