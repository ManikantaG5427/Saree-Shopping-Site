import { api } from './client.js';

export const authService = {
  // Login with email and password
  login: async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    const token = data?.token || data?.accessToken;
    if (token) {
      localStorage.setItem('saree_web_token', token);
    }
    return data;
  },

  // Register new customer
  register: async (name, email, password, phone) => {
    const data = await api.post('/auth/register', { name, email, password, phone });
    const token = data?.token || data?.accessToken;
    if (token) {
      localStorage.setItem('saree_web_token', token);
    }
    return data;
  },

  // Get current logged-in user profile
  getProfile: async () => {
    return api.get('/auth/me');
  },

  // Update profile
  updateProfile: async (userData) => {
    return api.put('/auth/profile', userData);
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore if offline
    } finally {
      localStorage.removeItem('saree_web_token');
    }
  },

  // Manage addresses
  addAddress: async (address) => {
    return api.post('/auth/addresses', address);
  },

  updateAddress: async (id, address) => {
    return api.put(`/auth/addresses/${id}`, address);
  },

  deleteAddress: async (id) => {
    return api.delete(`/auth/addresses/${id}`);
  },
};
