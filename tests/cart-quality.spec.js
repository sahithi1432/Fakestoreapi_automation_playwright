const { test, expect } = require('@playwright/test');
const { CART_PAYLOAD } = require('./data/testData');
const { expectCartSchema } = require('./helpers/cartSchema');

test.describe('Cart API quality and integrity tests', () => {
  test('QUALITY_001 GET /carts returns JSON within acceptable response time', async ({ request }) => {
    const start = Date.now();
    const response = await request.get('/carts');
    const duration = Date.now() - start;

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(duration).toBeLessThan(3000);
  });

  test('QUALITY_002 GET /carts does not return duplicate cart ids', async ({ request }) => {
    const response = await request.get('/carts');
    expect(response.status()).toBe(200);

    const carts = await response.json();
    const ids = carts.map(cart => Number(cart.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('QUALITY_003 every cart has a valid parseable date', async ({ request }) => {
    const response = await request.get('/carts');
    expect(response.status()).toBe(200);

    const carts = await response.json();
    carts.forEach(cart => {
      expectCartSchema(cart);
      expect(Number.isNaN(Date.parse(cart.date))).toBeFalsy();
    });
  });

  test('QUALITY_004 every cart productId exists in products catalog', async ({ request }) => {
    const [cartResponse, productResponse] = await Promise.all([
      request.get('/carts'),
      request.get('/products'),
    ]);

    expect(cartResponse.status()).toBe(200);
    expect(productResponse.status()).toBe(200);

    const carts = await cartResponse.json();
    const products = await productResponse.json();
    const productIds = new Set(products.map(product => Number(product.id)));

    for (const cart of carts) {
      for (const product of cart.products) {
        expect(productIds.has(Number(product.productId))).toBeTruthy();
      }
    }
  });

  test('QUALITY_005 every cart userId exists in users catalog', async ({ request }) => {
    const [cartResponse, userResponse] = await Promise.all([
      request.get('/carts'),
      request.get('/users'),
    ]);

    expect(cartResponse.status()).toBe(200);
    expect(userResponse.status()).toBe(200);

    const carts = await cartResponse.json();
    const users = await userResponse.json();
    const userIds = new Set(users.map(user => Number(user.id)));

    for (const cart of carts) {
      expect(userIds.has(Number(cart.userId))).toBeTruthy();
    }
  });

  test('QUALITY_006 created cart response is not persisted by mock API', async ({ request }) => {
    const createResponse = await request.post('/carts', { data: CART_PAYLOAD });
    expect(createResponse.status()).toBeGreaterThanOrEqual(200);
    expect(createResponse.status()).toBeLessThan(300);

    const createdCart = await createResponse.json();
    expect(createdCart).toHaveProperty('id');

    const fetchResponse = await request.get(`/carts/${createdCart.id}`);
    expect(fetchResponse.status()).toBe(200);
    const fetchedCart = await fetchResponse.json();

    expect(fetchedCart === null || Object.keys(fetchedCart).length === 0).toBeTruthy();
  });
});
