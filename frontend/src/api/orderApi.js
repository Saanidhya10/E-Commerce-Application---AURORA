import { request } from './client';

export const orderApi = {
  createOrder: (addressId, paymentMethod = 'COD') =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify({ addressId, paymentMethod }),
    }),

  getUserOrders: () => request('/orders'),

  getOrderById: (id) => request(`/orders/${id}`),

  getAllOrders: () => request('/admin/orders'),

  updateStatus: (id, status) =>
    request(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};
