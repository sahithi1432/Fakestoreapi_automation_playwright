const { test, expect } = require('@playwright/test');
const { AUTH_USER, INVALID_AUTH_USER } = require('./data/testData');

test.describe('Authentication API tests', () => {
  test('AUTH_001 valid user can generate auth token', async ({ request }) => {
    const response = await request.post('/auth/login', { data: AUTH_USER });
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);

    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(10);
  });

  test('AUTH_002 invalid credentials are rejected', async ({ request }) => {
    const response = await request.post('/auth/login', { data: INVALID_AUTH_USER });

    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });
});
