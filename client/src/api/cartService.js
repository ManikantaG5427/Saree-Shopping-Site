import { api } from './client.js';

export const cartService = {
  // Get cart items from backend
  getCart: async () => {
    return api.get('/cart');
  },

  // Add item to cart on server
  addToCart: async (productId, quantity = 1) => {
    return api.post('/cart/items', { productId, quantity });
  },

  // Update item quantity
  updateQuantity: async (productId, quantity) => {
    return api.put(`/cart/items/${productId}`, { quantity });
  },

  // Remove item from cart
  removeItem: async (productId) => {
    return api.delete(`/cart/items/${productId}`);
  },

  // Clear entire cart
  clearCart: async () => {
    return api.delete('/cart');
  },
};
