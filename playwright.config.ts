import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2Eテスト設定
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './playwright-tests',
  /* 並列実行 */
  fullyParallel: true,
  /* CI環境でのfail fast */
  forbidOnly: !!process.env.CI,
  /* CI環境での再試行設定 */
  retries: process.env.CI ? 2 : 0,
  /* 並列ワーカー数 */
  workers: process.env.CI ? 1 : undefined,
  /* テストレポート設定 */
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }]
  ],
  /* テスト設定 */
  use: {
    /* テストページのベースURL */
    baseURL: 'http://localhost:3000',
    /* スクリーンショット設定 */
    screenshot: 'only-on-failure',
    /* 動画録画設定 */
    video: 'retain-on-failure',
    /* トレース設定 */
    trace: 'on-first-retry',
  },

  /* プロジェクト設定（複数ブラウザ対応） */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* モバイルブラウザテスト */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* 開発サーバー設定 */
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
})
