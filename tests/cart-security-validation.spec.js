const { test, expect } = require('@playwright/test');
const { CART_PAYLOAD } = require('./data/testData');

test.describe('Cart security and validation gap tests', () => {
  test('SEC_001 POST /carts without auth token is accepted as API validation gap', async ({ request }) => {
    const response = await request.post('/carts', { data: CART_PAYLOAD });

    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);

    const cart = await response.json();
    expect(Number(cart.userId)).toBe(CART_PAYLOAD.userId);
    expect(cart.products).toEqual(CART_PAYLOAD.products);
  });

  test('SEC_002 POST /carts with invalid bearer token is accepted as API validation gap', async ({ request }) => {
    const response = await request.post('/carts', {
      headers: { Authorization: 'Bearer invalid-token' },
      data: CART_PAYLOAD,
    });

    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);

    const cart = await response.json();
    expect(Number(cart.userId)).toBe(CART_PAYLOAD.userId);
  });

  test('VAL_001 POST /carts accepts nonexistent product id as validation gap', async ({ request }) => {
    const payload = {
      userId: 5,
      date: '2026-06-05',
      products: [{ productId: 99999, quantity: 1 }],
    };

    const response = await request.post('/carts', { data: payload });
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);

    const cart = await response.json();
    expect(cart.products).toEqual(payload.products);
  });

  test('VAL_002 POST /carts accepts zero quantity as validation gap', async ({ request }) => {
    const payload = {
      userId: 5,
      date: '2026-06-05',
      products: [{ productId: 1, quantity: 0 }],
    };

    const response = await request.post('/carts', { data: payload });
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);

    const cart = await response.json();
    expect(cart.products).toEqual(payload.products);
  });

  test('VAL_003 POST /carts accepts negative quantity as validation gap', async ({ request }) => {
    const payload = {
      userId: 5,
      date: '2026-06-05',
      products: [{ productId: 1, quantity: -1 }],
    };

    const response = await request.post('/carts', { data: payload });
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);

    const cart = await response.json();
    expect(cart.products).toEqual(payload.products);
  });

  test('VAL_004 POST /carts accepts non-array products field as validation gap', async ({ request }) => {
    const payload = {
      userId: 5,
      date: '2026-06-05',
      products: { productId: 1, quantity: 1 },
    };

    const response = await request.post('/carts', { data: payload });
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);

    const cart = await response.json();
    expect(cart.products).toEqual(payload.products);
  });
});
