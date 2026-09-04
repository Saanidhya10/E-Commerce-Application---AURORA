import { request } from './client';

export const adminApi = {
  getDashboardStats: () => request('/admin/dashboard'),
};
