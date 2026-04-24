import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  outputDir: 'test-results',
  testMatch: [
    'code-testing/**/*.spec.ts',
    'code-testing/**/*.test.ts',
    'dom-testing/**/*.spec.ts',
    'dom-testing/**/*.test.ts',
  ],
  reporter: [['json', { outputFile: 'test-results.json' }], ['list']],
  timeout: 60000,
  expect: { timeout: 10000 },
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
