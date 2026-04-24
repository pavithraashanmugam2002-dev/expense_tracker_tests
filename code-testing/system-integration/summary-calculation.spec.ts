
import { test, expect } from '@playwright/test';

test.describe('Financial Summary Calculation', () => {
  let sessionCookie: string;
  let incomeId: string;
  let expenseId: string;

  test.beforeAll(async ({ request }) => {
    const loginResponse = await request.post('http://localhost:8000/api/v1/auth/login', {
      data: {
        email: 'user2@example.com',
        password: 'password123',
      },
    });
    expect(loginResponse.status()).toBe(200);
    sessionCookie = loginResponse.headers()['set-cookie'] || '';

    // Create income record
    const incomeResponse = await request.post('http://localhost:8000/api/v1/records', {
      headers: { Cookie: sessionCookie },
      data: {
        type: 'income',
        amount: 3000.00,
        category: 'Salary',
        description: 'Monthly salary',
        date: '2024-02-01',
      },
    });
    const incomeData = await incomeResponse.json();
    incomeId = incomeData.id;

    // Create expense record
    const expenseResponse = await request.post('http://localhost:8000/api/v1/records', {
      headers: { Cookie: sessionCookie },
      data: {
        type: 'expense',
        amount: 800.00,
        category: 'Rent',
        description: 'Monthly rent',
        date: '2024-02-05',
      },
    });
    const expenseData = await expenseResponse.json();
    expenseId = expenseData.id;
  });

  test('summary returns correct totals and balance', async ({ request }) => {
    const response = await request.get('http://localhost:8000/api/v1/summary', {
      headers: { Cookie: sessionCookie },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.total_income).toBeGreaterThanOrEqual(3000.00);
    expect(data.total_expenses).toBeGreaterThanOrEqual(800.00);
    expect(data.balance).toBeGreaterThanOrEqual(2200.00);
  });

  test.afterAll(async ({ request }) => {
    await request.delete(`http://localhost:8000/api/v1/records/${incomeId}`, {
      headers: { Cookie: sessionCookie },
    });
    await request.delete(`http://localhost:8000/api/v1/records/${expenseId}`, {
      headers: { Cookie: sessionCookie },
    });
  });
});
