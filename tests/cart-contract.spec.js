const { test, expect } = require('@playwright/test');
const expectedCartContract = require('./contracts/cart.contract.json');
const { cartContractShape, expectCartSchema } = require('./helpers/cartSchema');

test.describe('Cart schema and contract tests', () => {
  test('CONTRACT_001 cart response shape matches saved contract', async ({ request }) => {
    const response = await request.get('/carts/1');
    expect(response.status()).toBe(200);

    const cart = await response.json();
    expectCartSchema(cart);
    expect(cartContractShape(cart)).toEqual(expectedCartContract);
  });

  test('CONTRACT_002 every cart in list conforms to cart schema', async ({ request }) => {
    const response = await request.get('/carts');
    expect(response.status()).toBe(200);

    const carts = await response.json();
    expect(Array.isArray(carts)).toBeTruthy();

    for (const cart of carts) {
      expectCartSchema(cart);
    }
  });
});
