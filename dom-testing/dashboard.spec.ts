/// <reference types="node" />
import { test, expect, type Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/login');
  await page.fill('input#emailId', process.env.TEST_USER_EMAIL || 'alice@example.com');
  await page.fill('input#password', process.env.TEST_USER_PASSWORD || 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
  });

  test('should display navigation bar with app title', async ({ page }) => {
    const navBar = page.locator('nav');
    await expect(navBar).toBeVisible();
    
    const heading = page.locator('h1:has-text("💰 Expense Tracker")');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveCSS('color', 'rgb(255, 255, 255)');
  });

  test('should display logged-in user email', async ({ page }) => {
    const userEmail = page.locator('span:has-text("user1@example.com")');
    await expect(userEmail).toBeVisible();
    await expect(userEmail).toHaveCSS('color', 'rgb(236, 240, 241)');
  });

  test('should have correct navigation bar styling', async ({ page }) => {
    const navBar = page.locator('nav');
    await expect(navBar).toHaveCSS('background-color', 'rgb(44, 62, 80)');
  });

  test('should display navigation content in flex layout', async ({ page }) => {
    const navContent = page.locator('nav > div').first();
    await expect(navContent).toHaveCSS('display', 'flex');
    await expect(navContent).toHaveCSS('justify-content', 'space-between');
  });
});