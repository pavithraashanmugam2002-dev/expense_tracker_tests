# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dom-testing\dashboard.spec.ts >> Dashboard Page >> h1 element should have correct font size
- Location: dom-testing\dashboard.spec.ts:112:3

# Error details

```
Error: expect(locator).toHaveCSS(expected) failed

Locator: locator('h1').filter({ hasText: '💰 Application' })
Expected: "24px"
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toHaveCSS" with timeout 10000ms
  - waiting for locator('h1').filter({ hasText: '💰 Application' })

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
  14  |     const appName = page.locator('h1', { hasText: '💰 Application' });
  15  |     await expect(appName).toBeVisible();
  16  |     await expect(appName).toHaveCSS('color', 'rgb(255, 255, 255)'); // white color
  17  |   });
  18  | 
  19  |   test('should display user email in navigation', async ({ page }) => {
  20  |     // Check if user email is displayed
  21  |     const userEmail = page.locator('span', { hasText: 'user1@example.com' });
  22  |     await expect(userEmail).toBeVisible();
  23  |     await expect(userEmail).toHaveCSS('color', 'rgb(236, 240, 241)');
  24  |   });
  25  | 
  26  |   test('should have correct navigation bar styling', async ({ page }) => {
  27  |     const nav = page.locator('nav');
  28  |     
  29  |     // Verify navigation bar background color
  30  |     await expect(nav).toHaveCSS('background-color', 'rgb(44, 62, 80)');
  31  |     
  32  |     // Verify padding
  33  |     await expect(nav).toHaveCSS('padding', '16px 32px');
  34  |   });
  35  | 
  36  |   test('should display navigation items aligned correctly', async ({ page }) => {
  37  |     // Check if navigation container has correct layout
  38  |     const navContainer = page.locator('nav > div').first();
  39  |     await expect(navContainer).toHaveCSS('display', 'flex');
  40  |     await expect(navContainer).toHaveCSS('justify-content', 'space-between');
  41  |     await expect(navContainer).toHaveCSS('align-items', 'center');
  42  |     await expect(navContainer).toHaveCSS('max-width', '1200px');
  43  |   });
  44  | 
  45  |   test('should display user info section with correct layout', async ({ page }) => {
  46  |     // Check if user info section exists with correct styling
  47  |     const userInfoSection = page.locator('div', { hasText: 'user1@example.com' }).locator('..');
  48  |     await expect(userInfoSection).toHaveCSS('display', 'flex');
  49  |     await expect(userInfoSection).toHaveCSS('align-items', 'center');
  50  |     await expect(userInfoSection).toHaveCSS('gap', '16px');
  51  |   });
  52  | 
  53  |   test('should have correct page background color', async ({ page }) => {
  54  |     // Check if page has correct background color
  55  |     const rootDiv = page.locator('#root > div').first();
  56  |     await expect(rootDiv).toHaveCSS('background-color', 'rgb(236, 240, 241)');
  57  |     await expect(rootDiv).toHaveCSS('min-height', '100vh');
  58  |   });
  59  | 
  60  |   test('should apply global styles correctly', async ({ page }) => {
  61  |     // Verify body font family
  62  |     const body = page.locator('body');
  63  |     const fontFamily = await body.evaluate((el) => 
  64  |       window.getComputedStyle(el).fontFamily
  65  |     );
  66  |     
  67  |     // Check if font family includes expected system fonts
  68  |     expect(fontFamily).toMatch(/Segoe UI|Roboto|Oxygen|Ubuntu|Cantarell|Fira Sans|Droid Sans|Helvetica Neue|sans-serif/);
  69  |   });
  70  | 
  71  |   test('should have responsive navigation layout', async ({ page }) => {
  72  |     // Set viewport to mobile size
  73  |     await page.setViewportSize({ width: 375, height: 667 });
  74  |     
  75  |     // Navigation should still be visible
  76  |     const nav = page.locator('nav');
  77  |     await expect(nav).toBeVisible();
  78  |     
  79  |     // Navigation items should still be in flexbox layout
  80  |     const navContainer = page.locator('nav > div').first();
  81  |     await expect(navContainer).toHaveCSS('display', 'flex');
  82  |     
  83  |     // Reset viewport
  84  |     await page.setViewportSize({ width: 1280, height: 720 });
  85  |   });
  86  | 
  87  |   test('navigation bar should have shadow effect', async ({ page }) => {
  88  |     const nav = page.locator('nav');
  89  |     const boxShadow = await nav.evaluate((el) => 
  90  |       window.getComputedStyle(el).boxShadow
  91  |     );
  92  |     
  93  |     // Check if box shadow is applied (any shadow value)
  94  |     expect(boxShadow).not.toBe('none');
  95  |     expect(boxShadow).toBeTruthy();
  96  |   });
  97  | 
  98  |   test('should display complete page structure', async ({ page }) => {
  99  |     // Verify root element exists
  100 |     const root = page.locator('#root');
  101 |     await expect(root).toBeVisible();
  102 |     
  103 |     // Verify main container exists
  104 |     const mainContainer = page.locator('#root > div');
  105 |     await expect(mainContainer).toBeVisible();
  106 |     
  107 |     // Verify navigation exists inside main container
  108 |     const nav = page.locator('#root nav');
  109 |     await expect(nav).toBeVisible();
  110 |   });
  111 | 
  112 |   test('h1 element should have correct font size', async ({ page }) => {
  113 |     const heading = page.locator('h1', { hasText: '💰 Application' });
> 114 |     await expect(heading).toHaveCSS('font-size', '24px'); // 1.5rem = 24px
      |                           ^ Error: expect(locator).toHaveCSS(expected) failed
  115 |     await expect(heading).toHaveCSS('margin', '0px');
  116 |   });
  117 | 
  118 |   test('user email should have correct font size', async ({ page }) => {
  119 |     const userEmail = page.locator('span', { hasText: 'user1@example.com' });
  120 |     await expect(userEmail).toHaveCSS('font-size', '14.4px'); // 0.9rem
  121 |   });
  122 | });
```