import { api } from './client.js';

export const orderService = {
  // Create new order
  createOrder: async (data) => {
    return api.post('/orders', data);
  },

  // Get customer's orders
  getMyOrders: async () => {
    return api.get('/orders');
  },

  // Get order by ID
  getOrderById: async (id) => {
    return api.get(`/orders/${id}`);
  },

  // Verify Razorpay payment
  verifyPayment: async (data) => {
    return api.post('/orders/verify-payment', data);
  },

  // Cancel order
  cancelOrder: async (orderId, reason) => {
    return api.post(`/orders/${orderId}/cancel`, { reason });
  },
};
