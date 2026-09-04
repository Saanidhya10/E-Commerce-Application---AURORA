import { request } from './client';

export const addressApi = {
  getUserAddresses: () => request('/addresses'),

  addAddress: (addressData) =>
    request('/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    }),

  deleteAddress: (id) =>
    request(`/addresses/${id}`, {
      method: 'DELETE',
    }),
};
