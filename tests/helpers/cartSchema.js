const { expect } = require('@playwright/test');

function expectCartSchema(cart) {
  expect(cart).toEqual(expect.any(Object));
  expect(cart).toHaveProperty('id');
  expect(cart).toHaveProperty('userId');
  expect(cart).toHaveProperty('date');
  expect(cart).toHaveProperty('products');

  expect(Number.isInteger(Number(cart.id))).toBeTruthy();
  expect(Number.isInteger(Number(cart.userId))).toBeTruthy();
  expect(typeof cart.date).toBe('string');
  expect(Array.isArray(cart.products)).toBeTruthy();

  for (const product of cart.products) {
    expectCartProductSchema(product);
  }
}

function expectCartProductSchema(product) {
  expect(product).toEqual(expect.any(Object));
  expect(product).toHaveProperty('productId');
  expect(product).toHaveProperty('quantity');
  expect(Number.isInteger(Number(product.productId))).toBeTruthy();
  expect(Number.isInteger(Number(product.quantity))).toBeTruthy();
}

function cartContractShape(cart) {
  return {
    id: typeOf(cart.id),
    userId: typeOf(cart.userId),
    date: typeOf(cart.date),
    products: Array.isArray(cart.products)
      ? cart.products.slice(0, 1).map(product => ({
          productId: typeOf(product.productId),
          quantity: typeOf(product.quantity),
        }))
      : typeOf(cart.products),
  };
}

function typeOf(value) {
  if (Array.isArray(value)) {
    return 'array';
  }

  return typeof value;
}

module.exports = {
  expectCartSchema,
  expectCartProductSchema,
  cartContractShape,
};
