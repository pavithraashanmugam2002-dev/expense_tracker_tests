
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow — API + Browser E2E', () => {
  test('login via API returns session cookie and user data', async ({ request }) => {
    const response = await request.post('http://localhost:8000/api/v1/auth/login', {
      data: {
        email: 'user1@example.com',
        password: 'password123',
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('user_id');
    expect(data).toHaveProperty('email', 'user1@example.com');
    expect(data).toHaveProperty('message', 'Login successful');

    const cookies = response.headers()['set-cookie'];
    expect(cookies).toContain('expense_tracker_session');
  });

  test('login with invalid credentials returns 401', async ({ request }) => {
    const response = await request.post('http://localhost:8000/api/v1/auth/login', {
      data: {
        email: 'user1@example.com',
        password: 'wrongpassword',
      },
    });

    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data.detail).toContain('Invalid email or password');
  });

  test('logout clears session cookie', async ({ request }) => {
    const loginResponse = await request.post('http://localhost:8000/api/v1/auth/login', {
      data: {
        email: 'user1@example.com',
        password: 'password123',
      },
    });
    expect(loginResponse.status()).toBe(200);

    const logoutResponse = await request.post('http://localhost:8000/api/v1/auth/logout', {
      headers: {
        Cookie: loginResponse.headers()['set-cookie'] || '',
      },
    });

    expect(logoutResponse.status()).toBe(200);
    const data = await logoutResponse.json();
    expect(data.message).toBe('Logout successful');
  });
});
