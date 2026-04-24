
import { test, expect } from '@playwright/test';

test.describe('Records CRUD — Full Integration', () => {
  let sessionCookie: string;
  let recordId: string;

  test.beforeAll(async ({ request }) => {
    const loginResponse = await request.post('http://localhost:8000/api/v1/auth/login', {
      data: {
        email: 'user1@example.com',
        password: 'password123',
      },
    });
    expect(loginResponse.status()).toBe(200);
    sessionCookie = loginResponse.headers()['set-cookie'] || '';
  });

  test('create record via API returns 201 with record data', async ({ request }) => {
    const response = await request.post('http://localhost:8000/api/v1/records', {
      headers: { Cookie: sessionCookie },
      data: {
        type: 'income',
        amount: 2500.00,
        category: 'Freelance',
        description: 'Project payment',
        date: '2024-02-01',
      },
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.type).toBe('income');
    expect(data.amount).toBe(2500.00);
    expect(data.category).toBe('Freelance');
    recordId = data.id;
  });

  test('get all records returns created record', async ({ request }) => {
    const response = await request.get('http://localhost:8000/api/v1/records', {
      headers: { Cookie: sessionCookie },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.total).toBeGreaterThan(0);
    expect(data.records).toBeInstanceOf(Array);
    const found = data.records.find((r: any) => r.id === recordId);
    expect(found).toBeDefined();
  });

  test('update record via API returns updated data', async ({ request }) => {
    const response = await request.put(`http://localhost:8000/api/v1/records/${recordId}`, {
      headers: { Cookie: sessionCookie },
      data: {
        type: 'expense',
        amount: 100.00,
        category: 'Updated Category',
        description: 'Updated description',
        date: '2024-02-05',
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.type).toBe('expense');
    expect(data.amount).toBe(100.00);
    expect(data.category).toBe('Updated Category');
  });

  test('delete record via API returns 200', async ({ request }) => {
    const response = await request.delete(`http://localhost:8000/api/v1/records/${recordId}`, {
      headers: { Cookie: sessionCookie },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.deleted_id).toBe(recordId);
  });

  test('deleted record no longer exists', async ({ request }) => {
    const response = await request.get('http://localhost:8000/api/v1/records', {
      headers: { Cookie: sessionCookie },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    const found = data.records.find((r: any) => r.id === recordId);
    expect(found).toBeUndefined();
  });
});
