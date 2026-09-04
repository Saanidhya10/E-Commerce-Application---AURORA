const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const BASE_URL = API_BASE ? `${API_BASE.replace(/\/$/, '')}/api` : '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || data?.data || `HTTP ${response.status} error`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (err) {
    throw err;
  }
}
