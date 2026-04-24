
import { test, expect } from '@playwright/test';

test.describe('Frontend E2E — Login Flow', () => {
  test('user can log in and see dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/login');

    await page.fill('input[type="email"]', 'user1@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=💰 Expense Tracker')).toBeVisible();
    await expect(page.locator('text=Financial Summary')).toBeVisible();
  });

  test('invalid login shows error message', async ({ page }) => {
    await page.goto('http://localhost:5173/login');

    await page.fill('input[type="email"]', 'user1@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("Sign In")');

    await expect(page.locator('text=/Invalid email or password/i')).toBeVisible();
  });

  test('unauthenticated user redirected to login', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard');
    await expect(page).toHaveURL(/.*login/);
  });
});
