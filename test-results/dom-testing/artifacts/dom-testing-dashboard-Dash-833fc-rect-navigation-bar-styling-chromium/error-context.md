# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dom-testing\dashboard.spec.ts >> Dashboard Page >> should have correct navigation bar styling
- Location: dom-testing\dashboard.spec.ts:33:3

# Error details

```
Test timeout of 60000ms exceeded while running "beforeEach" hook.
```

```
Error: page.fill: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('input#emailId')

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - heading "💰 Expense Tracker" [level=1] [ref=e5]
  - paragraph [ref=e6]: Sign in to manage your finances
  - generic [ref=e7]:
    - generic [ref=e8]:
      - generic [ref=e9]: Email
      - textbox "user1@example.com" [active] [ref=e10]
    - generic [ref=e11]:
      - generic [ref=e12]: Password
      - textbox "Enter your password" [ref=e13]
    - button "Sign In" [ref=e14] [cursor=pointer]
  - generic [ref=e15]:
    - paragraph [ref=e16]: "Demo Credentials:"
    - paragraph [ref=e17]: user1@example.com / password123
    - paragraph [ref=e18]: user2@example.com / password123
    - paragraph [ref=e19]: user3@example.com / password123
```

# Test source

```ts
  1  | /// <reference types="node" />
  2  | import { test, expect, type Page } from '@playwright/test';
  3  | 
  4  | async function login(page: Page) {
  5  |   await page.goto('/login');
> 6  |   await page.fill('input#emailId', process.env.TEST_USER_EMAIL || 'alice@example.com');
     |              ^ Error: page.fill: Test timeout of 60000ms exceeded.
  7  |   await page.fill('input#password', process.env.TEST_USER_PASSWORD || 'password123');
  8  |   await page.click('button[type="submit"]');
  9  |   await page.waitForURL('/dashboard');
  10 | }
  11 | 
  12 | test.describe('Dashboard Page', () => {
  13 |   test.beforeEach(async ({ page }) => {
  14 |     await login(page);
  15 |     await page.goto('/dashboard');
  16 |   });
  17 | 
  18 |   test('should display navigation bar with app title', async ({ page }) => {
  19 |     const navBar = page.locator('nav');
  20 |     await expect(navBar).toBeVisible();
  21 |     
  22 |     const heading = page.locator('h1:has-text("💰 Expense Tracker")');
  23 |     await expect(heading).toBeVisible();
  24 |     await expect(heading).toHaveCSS('color', 'rgb(255, 255, 255)');
  25 |   });
  26 | 
  27 |   test('should display logged-in user email', async ({ page }) => {
  28 |     const userEmail = page.locator('span:has-text("user1@example.com")');
  29 |     await expect(userEmail).toBeVisible();
  30 |     await expect(userEmail).toHaveCSS('color', 'rgb(236, 240, 241)');
  31 |   });
  32 | 
  33 |   test('should have correct navigation bar styling', async ({ page }) => {
  34 |     const navBar = page.locator('nav');
  35 |     await expect(navBar).toHaveCSS('background-color', 'rgb(44, 62, 80)');
  36 |   });
  37 | 
  38 |   test('should display navigation content in flex layout', async ({ page }) => {
  39 |     const navContent = page.locator('nav > div').first();
  40 |     await expect(navContent).toHaveCSS('display', 'flex');
  41 |     await expect(navContent).toHaveCSS('justify-content', 'space-between');
  42 |   });
  43 | });
```