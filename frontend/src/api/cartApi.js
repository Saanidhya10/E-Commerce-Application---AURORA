import { request } from './client';

export const cartApi = {
  getCart: () => request('/cart'),

  addItem: (productId, quantity = 1) =>
    request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),

  updateQuantity: (cartItemId, quantity) =>
    request(`/cart/items/${cartItemId}?quantity=${quantity}`, {
      method: 'PUT',
    }),

  removeItem: (cartItemId) =>
    request(`/cart/items/${cartItemId}`, {
      method: 'DELETE',
    }),

  clearCart: () =>
    request('/cart', {
      method: 'DELETE',
    }),
};
