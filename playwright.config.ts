import { defineConfig, devices } from '@playwright/test';
import { BASE_URL, TIMEOUT } from './config/env';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export default defineConfig({
  grep: /@git/,
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 3,

  timeout: TIMEOUT,

  reporter: [
    ['allure-playwright'],
    //['html', { outputFolder: 'reports/test-report', open: 'on-failure' }],
    //['list'],
    //['json', { outputFile: 'reports/test-results.json' }]
],
  outputDir: 'reports/test-output',
  use: {
      headless: true,
      //locale: 'fr-FR',
      baseURL: BASE_URL,
      viewport: { width: 800, height: 900 },
      screenshot: 'only-on-failure', 
      video: 'retain-on-failure', 
      trace: 'on-first-retry',
      testIdAttribute: "id"
  },
  expect: {
      timeout: 5000, 
  },

  /* Configure projects for major browsers */
  projects: [
      { name: 'chromium', use: { browserName: 'chromium' } },
      //{ name: 'Microsoft Edge', use: { ...devices['Desktop Edge'], channel: 'msedge' },}
   // {
   //   name: 'firefox',
   //   use: { ...devices['Desktop Firefox'] },
   // },

   // {
   //   name: 'webkit',
   //   use: { ...devices['Desktop Safari'] },
   // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
