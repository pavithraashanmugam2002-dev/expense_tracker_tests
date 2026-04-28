import { test, expect, type Page } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login page elements', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('💰 Expense Tracker');
    
    // Check subtitle
    await expect(page.locator('p').first()).toContainText('Sign in to manage your finances');
    
    // Check form fields
    await expect(page.locator('label').filter({ hasText: 'Email' })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toHaveAttribute('placeholder', 'user1@example.com');
    
    await expect(page.locator('label').filter({ hasText: 'Password' })).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toHaveAttribute('placeholder', 'Enter your password');
    
    // Check submit button
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
    
    // Check demo credentials section
    await expect(page.locator('text=Demo Credentials:')).toBeVisible();
    await expect(page.locator('text=user1@example.com / password123')).toBeVisible();
    await expect(page.locator('text=user2@example.com / password123')).toBeVisible();
    await expect(page.locator('text=user3@example.com / password123')).toBeVisible();
  });

  test('should submit form with empty fields', async ({ page }) => {
    // Click submit without filling fields
    await page.locator('button[type="submit"]').click();
    
    // Browser should show validation errors for required fields
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    // Check if inputs have required attribute
    await expect(emailInput).toHaveAttribute('required', '');
    await expect(passwordInput).toHaveAttribute('required', '');
  });

  test('should submit form with invalid email', async ({ page }) => {
    // Fill with invalid email
    await page.locator('input[type="email"]').fill('invalid-email');
    await page.locator('input[type="password"]').fill('password123');
    
    // Try to submit
    await page.locator('button[type="submit"]').click();
    
    // Browser validation should prevent submission
    const emailInput = page.locator('input[type="email"]');
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('should submit form with valid demo credentials - user1', async ({ page }) => {
    // Fill with demo credentials
    await page.locator('input[type="email"]').fill('user1@example.com');
    await page.locator('input[type="password"]').fill('password123');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for potential navigation or response
    await page.waitForTimeout(500);
  });

  test('should submit form with valid demo credentials - user2', async ({ page }) => {
    // Fill with demo credentials
    await page.locator('input[type="email"]').fill('user2@example.com');
    await page.locator('input[type="password"]').fill('password123');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for potential navigation or response
    await page.waitForTimeout(500);
  });

  test('should submit form with valid demo credentials - user3', async ({ page }) => {
    // Fill with demo credentials
    await page.locator('input[type="email"]').fill('user3@example.com');
    await page.locator('input[type="password"]').fill('password123');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for potential navigation or response
    await page.waitForTimeout(500);
  });

  test('should submit form with environment credentials', async ({ page }) => {
    // Use credentials from .env.test file
    const email = process.env.TEST_USER_EMAIL || 'user1@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'password123';
    
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(password);
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for potential navigation or response
    await page.waitForTimeout(500);
  });

  test('should have proper input field styling', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    // Check inputs have proper styling attributes
    await expect(emailInput).toHaveCSS('width', '100%');
    await expect(passwordInput).toHaveCSS('width', '100%');
  });

  test('should have submit button with proper styling', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    
    await expect(submitButton).toHaveCSS('width', '100%');
    await expect(submitButton).toHaveCSS('background-color', 'rgb(52, 152, 219)');
    await expect(submitButton).toHaveCSS('color', 'rgb(255, 255, 255)');
  });

  test('should clear input values when typing', async ({ page }) => {
    // Fill email
    await page.locator('input[type="email"]').fill('test@example.com');
    await expect(page.locator('input[type="email"]')).toHaveValue('test@example.com');
    
    // Clear and type new value
    await page.locator('input[type="email"]').clear();
    await page.locator('input[type="email"]').fill('new@example.com');
    await expect(page.locator('input[type="email"]')).toHaveValue('new@example.com');
    
    // Fill password
    await page.locator('input[type="password"]').fill('password123');
    await expect(page.locator('input[type="password"]')).toHaveValue('password123');
    
    // Clear and type new value
    await page.locator('input[type="password"]').clear();
    await page.locator('input[type="password"]').fill('newpassword');
    await expect(page.locator('input[type="password"]')).toHaveValue('newpassword');
  });
});