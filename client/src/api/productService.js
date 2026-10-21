import { api } from './client.js';

export const productService = {
  // Fetch all products with filtering, search, pagination
  getAll: async (params) => {
    return api.get('/products', { params });
  },

  // Fetch product by ID or Slug
  getById: async (id) => {
    return api.get(`/products/${id}`);
  },

  // Fetch all product categories
  getCategories: async () => {
    return api.get('/categories');
  },

  // Search products by text query
  search: async (query) => {
    const res = await api.get('/products', { params: { q: query, limit: 20 } });
    return res?.products || [];
  },

  // Get featured sarees
  getFeatured: async (limit = 8) => {
    const res = await api.get('/products', { params: { limit } });
    return (res?.products || []).filter(p => p.isFeatured || p.tags?.includes('top-picks') || p.isActive).slice(0, limit);
  },

  // Create product (Admin)
  create: async (data) => {
    return api.post('/products', data);
  },

  // Update product (Admin)
  update: async (id, data) => {
    return api.put(`/products/${id}`, data);
  },

  // Delete product (Admin)
  delete: async (id) => {
    return api.delete(`/products/${id}`);
  },
};
