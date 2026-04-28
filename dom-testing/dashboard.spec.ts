import { test, expect, type Page } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display navigation bar with application name', async ({ page }) => {
    // Check if navigation bar exists
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check application name/logo
    const appName = page.locator('h1', { hasText: '💰 Application' });
    await expect(appName).toBeVisible();
    await expect(appName).toHaveCSS('color', 'rgb(255, 255, 255)'); // white color
  });

  test('should display user email in navigation', async ({ page }) => {
    // Check if user email is displayed
    const userEmail = page.locator('span', { hasText: 'user1@example.com' });
    await expect(userEmail).toBeVisible();
    await expect(userEmail).toHaveCSS('color', 'rgb(236, 240, 241)');
  });

  test('should have correct navigation bar styling', async ({ page }) => {
    const nav = page.locator('nav');
    
    // Verify navigation bar background color
    await expect(nav).toHaveCSS('background-color', 'rgb(44, 62, 80)');
    
    // Verify padding
    await expect(nav).toHaveCSS('padding', '16px 32px');
  });

  test('should display navigation items aligned correctly', async ({ page }) => {
    // Check if navigation container has correct layout
    const navContainer = page.locator('nav > div').first();
    await expect(navContainer).toHaveCSS('display', 'flex');
    await expect(navContainer).toHaveCSS('justify-content', 'space-between');
    await expect(navContainer).toHaveCSS('align-items', 'center');
    await expect(navContainer).toHaveCSS('max-width', '1200px');
  });

  test('should display user info section with correct layout', async ({ page }) => {
    // Check if user info section exists with correct styling
    const userInfoSection = page.locator('div', { hasText: 'user1@example.com' }).locator('..');
    await expect(userInfoSection).toHaveCSS('display', 'flex');
    await expect(userInfoSection).toHaveCSS('align-items', 'center');
    await expect(userInfoSection).toHaveCSS('gap', '16px');
  });

  test('should have correct page background color', async ({ page }) => {
    // Check if page has correct background color
    const rootDiv = page.locator('#root > div').first();
    await expect(rootDiv).toHaveCSS('background-color', 'rgb(236, 240, 241)');
    await expect(rootDiv).toHaveCSS('min-height', '100vh');
  });

  test('should apply global styles correctly', async ({ page }) => {
    // Verify body font family
    const body = page.locator('body');
    const fontFamily = await body.evaluate((el) => 
      window.getComputedStyle(el).fontFamily
    );
    
    // Check if font family includes expected system fonts
    expect(fontFamily).toMatch(/Segoe UI|Roboto|Oxygen|Ubuntu|Cantarell|Fira Sans|Droid Sans|Helvetica Neue|sans-serif/);
  });

  test('should have responsive navigation layout', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigation should still be visible
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Navigation items should still be in flexbox layout
    const navContainer = page.locator('nav > div').first();
    await expect(navContainer).toHaveCSS('display', 'flex');
    
    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('navigation bar should have shadow effect', async ({ page }) => {
    const nav = page.locator('nav');
    const boxShadow = await nav.evaluate((el) => 
      window.getComputedStyle(el).boxShadow
    );
    
    // Check if box shadow is applied (any shadow value)
    expect(boxShadow).not.toBe('none');
    expect(boxShadow).toBeTruthy();
  });

  test('should display complete page structure', async ({ page }) => {
    // Verify root element exists
    const root = page.locator('#root');
    await expect(root).toBeVisible();
    
    // Verify main container exists
    const mainContainer = page.locator('#root > div');
    await expect(mainContainer).toBeVisible();
    
    // Verify navigation exists inside main container
    const nav = page.locator('#root nav');
    await expect(nav).toBeVisible();
  });

  test('h1 element should have correct font size', async ({ page }) => {
    const heading = page.locator('h1', { hasText: '💰 Application' });
    await expect(heading).toHaveCSS('font-size', '24px'); // 1.5rem = 24px
    await expect(heading).toHaveCSS('margin', '0px');
  });

  test('user email should have correct font size', async ({ page }) => {
    const userEmail = page.locator('span', { hasText: 'user1@example.com' });
    await expect(userEmail).toHaveCSS('font-size', '14.4px'); // 0.9rem
  });
});