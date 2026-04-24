
import { test, expect } from '@playwright/test';

test.describe('Frontend E2E — Record Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'user1@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('user can add a new income record', async ({ page }) => {
    await page.click('button:has-text("+ Add New Record")');
    
    await page.selectOption('select[name="type"]', 'income');
    await page.fill('input[name="amount"]', '1500.50');
    await page.fill('input[name="category"]', 'Freelance');
    await page.fill('textarea[name="description"]', 'Project payment');
    await page.fill('input[name="date"]', '2024-02-10');
    
    await page.click('button:has-text("Add Record")');

    await expect(page.locator('text=Freelance')).toBeVisible();
    await expect(page.locator('text=$1500.50')).toBeVisible();
  });

  test('user can edit an existing record', async ({ page }) => {
    const editButton = page.locator('button:has-text("Edit")').first();
    await editButton.click();

    await page.fill('input[name="category"]', 'Updated Category');
    await page.click('button:has-text("Update")');

    await expect(page.locator('text=Updated Category')).toBeVisible();
  });

  test('user can delete a record with confirmation', async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());
    
    const deleteButton = page.locator('button:has-text("Delete")').first();
    await deleteButton.click();

    // Record should disappear
    await expect(deleteButton).not.toBeVisible({ timeout: 5000 });
  });
});
