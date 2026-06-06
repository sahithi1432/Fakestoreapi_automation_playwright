const { test, expect } = require('@playwright/test');
const {
  AUTH_USER,
  CART_PAYLOAD,
  UPDATED_CART_PAYLOAD,
  PRODUCT_IDS_FOR_DATA_DRIVEN_TEST,
} = require('./data/testData');
const { expectCartSchema, expectCartProductSchema } = require('./helpers/cartSchema');

test.describe('Cart CRUD API tests', () => {
  let authToken;

  test.beforeAll(async ({ request }) => {
    const response = await request.post('/auth/login', { data: AUTH_USER });
    expect(response.ok()).toBeTruthy();
    authToken = (await response.json()).token;
  });

  test('CART_001 GET /carts returns cart list with valid schema', async ({ request }) => {
    const response = await request.get('/carts');
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);

    const carts = await response.json();
    expect(Array.isArray(carts)).toBeTruthy();
    expect(carts.length).toBeGreaterThan(0);
    expectCartSchema(carts[0]);
  });

  test('CART_002 GET /carts/{id} returns one cart with valid schema', async ({ request }) => {
    const response = await request.get('/carts/1');
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);

    const cart = await response.json();
    expectCartSchema(cart);
    expect(Number(cart.id)).toBe(1);
  });

  test('CART_003 POST /carts creates a cart with products', async ({ request }) => {
    const response = await request.post('/carts', {
      headers: { Authorization: `Bearer ${authToken}` },
      data: CART_PAYLOAD,
    });

    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);
    const cart = await response.json();

    expect(Number(cart.userId)).toBe(CART_PAYLOAD.userId);
    expect(cart.products).toEqual(CART_PAYLOAD.products);
    for (const product of cart.products) {
      expectCartProductSchema(product);
    }
  });

  test('CART_004 PUT /carts/{id} updates a cart payload', async ({ request }) => {
    const response = await request.put('/carts/7', {
      headers: { Authorization: `Bearer ${authToken}` },
      data: UPDATED_CART_PAYLOAD,
    });

    expect(response.status()).toBe(200);
    const cart = await response.json();

    expect(Number(cart.id)).toBe(7);
    expect(Number(cart.userId)).toBe(UPDATED_CART_PAYLOAD.userId);
    expect(cart.products).toEqual(UPDATED_CART_PAYLOAD.products);
  });

  test('CART_005 DELETE /carts/{id} deletes an existing cart', async ({ request }) => {
    const response = await request.delete('/carts/6', {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.status()).toBe(200);
    const cart = await response.json();
    expectCartSchema(cart);
    expect(Number(cart.id)).toBe(6);
  });

  test('CART_006 negative: GET unknown cart id does not return a valid cart', async ({ request }) => {
    const response = await request.get('/carts/99999');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body === null || Object.keys(body).length === 0).toBeTruthy();
  });

  test('CART_007 negative: invalid cart id path does not return success', async ({ request }) => {
    const response = await request.get('/carts/not-a-number');

    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });

  test('CART_008 negative: PUT invalid cart id path returns client error', async ({ request }) => {
    const response = await request.put('/carts/not-a-number', {
      headers: { Authorization: `Bearer ${authToken}` },
      data: UPDATED_CART_PAYLOAD,
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });

  test('CART_009 negative: DELETE unknown cart id returns null body', async ({ request }) => {
    const response = await request.delete('/carts/99999', {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toBeNull();
  });

  test('CART_010 negative: empty POST payload exposes missing API validation', async ({ request }) => {
    const response = await request.post('/carts', {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {},
    });

    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);

    const cart = await response.json();
    expect(cart).toHaveProperty('id');
    expect(cart).not.toHaveProperty('userId');
    expect(cart).not.toHaveProperty('products');
  });

  test('CART_011 negative: invalid product data is accepted by API', async ({ request }) => {
    const invalidPayload = {
      userId: 'invalid-user',
      date: 'bad-date',
      products: [{ productId: 'invalid-product', quantity: 'invalid-quantity' }],
    };

    const response = await request.post('/carts', {
      headers: { Authorization: `Bearer ${authToken}` },
      data: invalidPayload,
    });

    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);

    const cart = await response.json();
    expect(cart.userId).toBe(invalidPayload.userId);
    expect(cart.products).toEqual(invalidPayload.products);
  });

  for (const productId of PRODUCT_IDS_FOR_DATA_DRIVEN_TEST) {
    test(`CART_DD productId ${productId} can be posted in a cart`, async ({ request }) => {
      const payload = {
        userId: 3,
        date: '2026-06-05',
        products: [{ productId, quantity: 1 }],
      };

      const response = await request.post('/carts', {
        headers: { Authorization: `Bearer ${authToken}` },
        data: payload,
      });

      expect(response.status()).toBeGreaterThanOrEqual(200);
      expect(response.status()).toBeLessThan(300);
      const cart = await response.json();
      expect(Number(cart.userId)).toBe(payload.userId);
      expect(cart.products).toEqual(payload.products);
    });
  }
});
