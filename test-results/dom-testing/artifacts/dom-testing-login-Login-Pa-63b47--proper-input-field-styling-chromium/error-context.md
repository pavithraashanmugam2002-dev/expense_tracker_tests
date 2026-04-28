# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dom-testing\login.spec.ts >> Login Page >> should have proper input field styling
- Location: dom-testing\login.spec.ts:112:3

# Error details

```
Error: expect(locator).toHaveCSS(expected) failed

Locator:  locator('input[type="email"]')
Expected: "100%"
Received: "304px"
Timeout:  10000ms

Call log:
  - Expect "toHaveCSS" with timeout 10000ms
  - waiting for locator('input[type="email"]')
    13 × locator resolved to <input value="" required="" type="email" placeholder="user1@example.com"/>
       - unexpected value "304px"

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
  17  |     await expect(page.locator('input[type="email"]')).toBeVisible();
  18  |     await expect(page.locator('input[type="email"]')).toHaveAttribute('placeholder', 'user1@example.com');
  19  |     
  20  |     await expect(page.locator('label').filter({ hasText: 'Password' })).toBeVisible();
  21  |     await expect(page.locator('input[type="password"]')).toBeVisible();
  22  |     await expect(page.locator('input[type="password"]')).toHaveAttribute('placeholder', 'Enter your password');
  23  |     
  24  |     // Check submit button
  25  |     await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
  26  |     
  27  |     // Check demo credentials section
  28  |     await expect(page.locator('text=Demo Credentials:')).toBeVisible();
  29  |     await expect(page.locator('text=user1@example.com / password123')).toBeVisible();
  30  |     await expect(page.locator('text=user2@example.com / password123')).toBeVisible();
  31  |     await expect(page.locator('text=user3@example.com / password123')).toBeVisible();
  32  |   });
  33  | 
  34  |   test('should submit form with empty fields', async ({ page }) => {
  35  |     // Click submit without filling fields
  36  |     await page.locator('button[type="submit"]').click();
  37  |     
  38  |     // Browser should show validation errors for required fields
  39  |     const emailInput = page.locator('input[type="email"]');
  40  |     const passwordInput = page.locator('input[type="password"]');
  41  |     
  42  |     // Check if inputs have required attribute
  43  |     await expect(emailInput).toHaveAttribute('required', '');
  44  |     await expect(passwordInput).toHaveAttribute('required', '');
  45  |   });
  46  | 
  47  |   test('should submit form with invalid email', async ({ page }) => {
  48  |     // Fill with invalid email
  49  |     await page.locator('input[type="email"]').fill('invalid-email');
  50  |     await page.locator('input[type="password"]').fill('password123');
  51  |     
  52  |     // Try to submit
  53  |     await page.locator('button[type="submit"]').click();
  54  |     
  55  |     // Browser validation should prevent submission
  56  |     const emailInput = page.locator('input[type="email"]');
  57  |     const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
  58  |     expect(isInvalid).toBe(true);
  59  |   });
  60  | 
  61  |   test('should submit form with valid demo credentials - user1', async ({ page }) => {
  62  |     // Fill with demo credentials
  63  |     await page.locator('input[type="email"]').fill('user1@example.com');
  64  |     await page.locator('input[type="password"]').fill('password123');
  65  |     
  66  |     // Submit form
  67  |     await page.locator('button[type="submit"]').click();
  68  |     
  69  |     // Wait for potential navigation or response
  70  |     await page.waitForTimeout(500);
  71  |   });
  72  | 
  73  |   test('should submit form with valid demo credentials - user2', async ({ page }) => {
  74  |     // Fill with demo credentials
  75  |     await page.locator('input[type="email"]').fill('user2@example.com');
  76  |     await page.locator('input[type="password"]').fill('password123');
  77  |     
  78  |     // Submit form
  79  |     await page.locator('button[type="submit"]').click();
  80  |     
  81  |     // Wait for potential navigation or response
  82  |     await page.waitForTimeout(500);
  83  |   });
  84  | 
  85  |   test('should submit form with valid demo credentials - user3', async ({ page }) => {
  86  |     // Fill with demo credentials
  87  |     await page.locator('input[type="email"]').fill('user3@example.com');
  88  |     await page.locator('input[type="password"]').fill('password123');
  89  |     
  90  |     // Submit form
  91  |     await page.locator('button[type="submit"]').click();
  92  |     
  93  |     // Wait for potential navigation or response
  94  |     await page.waitForTimeout(500);
  95  |   });
  96  | 
  97  |   test('should submit form with environment credentials', async ({ page }) => {
  98  |     // Use credentials from .env.test file
  99  |     const email = process.env.TEST_USER_EMAIL || 'user1@example.com';
  100 |     const password = process.env.TEST_USER_PASSWORD || 'password123';
  101 |     
  102 |     await page.locator('input[type="email"]').fill(email);
  103 |     await page.locator('input[type="password"]').fill(password);
  104 |     
  105 |     // Submit form
  106 |     await page.locator('button[type="submit"]').click();
  107 |     
  108 |     // Wait for potential navigation or response
  109 |     await page.waitForTimeout(500);
  110 |   });
  111 | 
  112 |   test('should have proper input field styling', async ({ page }) => {
  113 |     const emailInput = page.locator('input[type="email"]');
  114 |     const passwordInput = page.locator('input[type="password"]');
  115 |     
  116 |     // Check inputs have proper styling attributes
> 117 |     await expect(emailInput).toHaveCSS('width', '100%');
      |                              ^ Error: expect(locator).toHaveCSS(expected) failed
  118 |     await expect(passwordInput).toHaveCSS('width', '100%');
  119 |   });
  120 | 
  121 |   test('should have submit button with proper styling', async ({ page }) => {
  122 |     const submitButton = page.locator('button[type="submit"]');
  123 |     
  124 |     await expect(submitButton).toHaveCSS('width', '100%');
  125 |     await expect(submitButton).toHaveCSS('background-color', 'rgb(52, 152, 219)');
  126 |     await expect(submitButton).toHaveCSS('color', 'rgb(255, 255, 255)');
  127 |   });
  128 | 
  129 |   test('should clear input values when typing', async ({ page }) => {
  130 |     // Fill email
  131 |     await page.locator('input[type="email"]').fill('test@example.com');
  132 |     await expect(page.locator('input[type="email"]')).toHaveValue('test@example.com');
  133 |     
  134 |     // Clear and type new value
  135 |     await page.locator('input[type="email"]').clear();
  136 |     await page.locator('input[type="email"]').fill('new@example.com');
  137 |     await expect(page.locator('input[type="email"]')).toHaveValue('new@example.com');
  138 |     
  139 |     // Fill password
  140 |     await page.locator('input[type="password"]').fill('password123');
  141 |     await expect(page.locator('input[type="password"]')).toHaveValue('password123');
  142 |     
  143 |     // Clear and type new value
  144 |     await page.locator('input[type="password"]').clear();
  145 |     await page.locator('input[type="password"]').fill('newpassword');
  146 |     await expect(page.locator('input[type="password"]')).toHaveValue('newpassword');
  147 |   });
  148 | });
```