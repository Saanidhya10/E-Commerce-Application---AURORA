import { request } from './client';

export const productApi = {
  getAll: (categoryId = null, search = '') => {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    if (search && search.trim()) params.append('search', search.trim());
    const query = params.toString() ? `?${params.toString()}` : '';
    return request(`/products${query}`);
  },

  getById: (id) => request(`/products/${id}`),

  create: (product) =>
    request('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  update: (id, product) =>
    request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }),

  delete: (id) =>
    request(`/products/${id}`, {
      method: 'DELETE',
    }),

  updateStock: (id, stock) =>
    request(`/products/${id}/stock?stock=${stock}`, {
      method: 'PATCH',
    }),
};
