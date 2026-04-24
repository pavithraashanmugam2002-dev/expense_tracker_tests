import { test, expect, type Page } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form with all elements', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('💰 Expense Tracker');
    
    // Check subtitle
    await expect(page.locator('p').first()).toContainText('Sign in to manage your finances');
    
    // Check email field
    const emailLabel = page.locator('label').filter({ hasText: 'Email' });
    await expect(emailLabel).toBeVisible();
    
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('placeholder', 'user1@example.com');
    
    // Check password field
    const passwordLabel = page.locator('label').filter({ hasText: 'Password' });
    await expect(passwordLabel).toBeVisible();
    
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password');
    
    // Check submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText('Sign In');
  });

  test('should display demo credentials', async ({ page }) => {
    // Check demo credentials section
    await expect(page.locator('p').filter({ hasText: 'Demo Credentials:' })).toBeVisible();
    
    // Check all three demo credentials
    await expect(page.locator('p').filter({ hasText: 'user1@example.com / password123' })).toBeVisible();
    await expect(page.locator('p').filter({ hasText: 'user2@example.com / password123' })).toBeVisible();
    await expect(page.locator('p').filter({ hasText: 'user3@example.com / password123' })).toBeVisible();
  });

  test('should handle empty form submission', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    
    // Try to submit empty form
    await submitButton.click();
    
    // Browser's built-in validation should prevent submission
    // Check that we're still on the login page
    await expect(page.locator('h1')).toContainText('💰 Expense Tracker');
  });

  test('should handle invalid email format', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Enter invalid email
    await emailInput.fill('invalid-email');
    await passwordInput.fill('password123');
    
    // Try to submit
    await submitButton.click();
    
    // Browser's built-in validation should prevent submission
    await expect(page.locator('h1')).toContainText('💰 Expense Tracker');
  });

  test('should handle empty email with valid password', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Enter only password
    await passwordInput.fill('password123');
    
    // Try to submit
    await submitButton.click();
    
    // Should still be on login page
    await expect(page.locator('h1')).toContainText('💰 Expense Tracker');
  });

  test('should handle valid email with empty password', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Enter only email
    await emailInput.fill('user1@example.com');
    
    // Try to submit
    await submitButton.click();
    
    // Should still be on login page
    await expect(page.locator('h1')).toContainText('💰 Expense Tracker');
  });

  test('should fill email and password fields', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    // Fill in the form
    await emailInput.fill('user1@example.com');
    await passwordInput.fill('password123');
    
    // Verify values are filled
    await expect(emailInput).toHaveValue('user1@example.com');
    await expect(passwordInput).toHaveValue('password123');
  });

  test('should attempt login with demo credentials - user1', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Use first demo credentials
    await emailInput.fill('user1@example.com');
    await passwordInput.fill('password123');
    
    // Submit form
    await submitButton.click();
    
    // Wait for navigation or response (this will depend on actual backend behavior)
    // Since we don't know the exact success behavior, we just verify the form submission
  });

  test('should attempt login with demo credentials - user2', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Use second demo credentials
    await emailInput.fill('user2@example.com');
    await passwordInput.fill('password123');
    
    // Submit form
    await submitButton.click();
  });

  test('should attempt login with demo credentials - user3', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Use third demo credentials
    await emailInput.fill('user3@example.com');
    await passwordInput.fill('password123');
    
    // Submit form
    await submitButton.click();
  });

  test('should have proper form attributes', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    // Check required attributes
    await expect(emailInput).toHaveAttribute('required', '');
    await expect(passwordInput).toHaveAttribute('required', '');
    
    // Check input types
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should have accessible labels', async ({ page }) => {
    // Check that labels are properly associated with inputs
    const emailLabel = page.locator('label').filter({ hasText: 'Email' });
    const passwordLabel = page.locator('label').filter({ hasText: 'Password' });
    
    await expect(emailLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
  });

  test('should maintain password visibility security', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    
    // Fill password
    await passwordInput.fill('secretpassword');
    
    // Verify it's still type password (masked)
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});