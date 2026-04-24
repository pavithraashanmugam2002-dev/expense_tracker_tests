import { defineConfig } from '@playwright/test';

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });
process.env.BASE_URL = process.env.BASE_URL || process.env.FRONTEND_URL || process.env.APP_URL || process.env.VITE_FRONTEND_URL;

export default defineConfig({
  testDir: '.',
  outputDir: 'test-results/dom-testing/artifacts',
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
