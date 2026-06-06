const AUTH_USER = {
  username: 'mor_2314',
  password: '83r5^_',
};

const INVALID_AUTH_USER = {
  username: 'invalid_user',
  password: 'wrong_password',
};

const CART_PAYLOAD = {
  userId: 5,
  date: '2026-06-05',
  products: [
    { productId: 1, quantity: 2 },
    { productId: 2, quantity: 1 },
  ],
};

const UPDATED_CART_PAYLOAD = {
  userId: 5,
  date: '2026-06-05',
  products: [
    { productId: 3, quantity: 4 },
  ],
};

const PRODUCT_IDS_FOR_DATA_DRIVEN_TEST = [1, 2, 3, 4];

module.exports = {
  AUTH_USER,
  INVALID_AUTH_USER,
  CART_PAYLOAD,
  UPDATED_CART_PAYLOAD,
  PRODUCT_IDS_FOR_DATA_DRIVEN_TEST,
};
