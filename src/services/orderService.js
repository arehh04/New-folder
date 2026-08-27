import axiosInstance from '../api/axiosInstance';

/**
 * Order Service Layer (Encapsulated Promise API)
 */
export const orderService = {
  /**
   * Submit and authorize a royal order
   * @param {Object} orderData - Order payload (items, customer, shippingAddress, totals)
   * @returns {Promise<Object>} Order confirmation record
   */
  createOrder: async (orderData) => {
    const res = await axiosInstance.post('/orders', orderData);
    return res.data;
  },

  /**
   * Retrieve order details by ID
   * @param {string} orderId - Royal Order ID
   * @returns {Promise<Object>} Order details
   */
  getOrderById: async (orderId) => {
    const res = await axiosInstance.get(`/orders/${orderId}`);
    return res.data;
  },

  /**
   * List recent orders
   * @returns {Promise<Object>} List of orders
   */
  getOrders: async () => {
    const res = await axiosInstance.get('/orders');
    return res.data;
  }
};
