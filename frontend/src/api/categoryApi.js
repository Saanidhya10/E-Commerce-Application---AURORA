import { request } from './client';

export const categoryApi = {
  getAll: () => request('/categories'),

  getById: (id) => request(`/categories/${id}`),

  create: (category) =>
    request('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    }),

  update: (id, category) =>
    request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    }),

  delete: (id) =>
    request(`/categories/${id}`, {
      method: 'DELETE',
    }),
};
