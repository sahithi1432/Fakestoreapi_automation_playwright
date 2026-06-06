const { test, expect } = require('@playwright/test');
const { expectCartSchema } = require('./helpers/cartSchema');

test.describe('Cart query and filtering API tests', () => {
  test('QUERY_001 GET /carts?limit=3 returns only requested number of carts', async ({ request }) => {
    const response = await request.get('/carts?limit=3');
    expect(response.status()).toBe(200);

    const carts = await response.json();
    expect(carts).toHaveLength(3);
    carts.forEach(expectCartSchema);
  });

  test('QUERY_002 GET /carts?sort=desc returns carts in descending id order', async ({ request }) => {
    const response = await request.get('/carts?sort=desc');
    expect(response.status()).toBe(200);

    const carts = await response.json();
    carts.forEach(expectCartSchema);

    const ids = carts.map(cart => Number(cart.id));
    expect(ids).toEqual([...ids].sort((a, b) => b - a));
  });

  test('QUERY_003 GET /carts/user/{userId} returns carts for one user only', async ({ request }) => {
    const userId = 2;

    const response = await request.get(`/carts/user/${userId}`);
    expect(response.status()).toBe(200);

    const carts = await response.json();
    expect(carts.length).toBeGreaterThan(0);

    carts.forEach(cart => {
      expectCartSchema(cart);
      expect(Number(cart.userId)).toBe(userId);
    });
  });

  test('QUERY_004 GET /carts with date range returns carts inside requested dates', async ({ request }) => {
    const startDate = new Date('2019-12-10T00:00:00.000Z');
    const endDate = new Date('2020-10-10T23:59:59.999Z');

    const response = await request.get('/carts?startdate=2019-12-10&enddate=2020-10-10');
    expect(response.status()).toBe(200);

    const carts = await response.json();
    expect(carts.length).toBeGreaterThan(0);
    carts.forEach(cart => {
      expectCartSchema(cart);
      const cartDate = new Date(cart.date);
      expect(cartDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
      expect(cartDate.getTime()).toBeLessThanOrEqual(endDate.getTime());
    });
  });
});
