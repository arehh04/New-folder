import { orderService } from '../services/orderService';

export const orderBusiness = {
  /**
   * Calculate checkout totals with optional promo codes
   */
  calculateOrderTotals: (cartItems, promoCode = '', deliveryFee = 0) => {
    const rawSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    let discountAmount = 0;
    if (promoCode.trim().toUpperCase() === 'ROYAL10') {
      discountAmount = rawSubtotal * 0.10; // 10% discount
    }

    const grandTotal = Math.max(0, rawSubtotal - discountAmount + deliveryFee);

    return {
      subtotal: rawSubtotal,
      formattedSubtotal: `$${rawSubtotal.toFixed(2)}`,
      discount: discountAmount,
      formattedDiscount: discountAmount > 0 ? `-$${discountAmount.toFixed(2)}` : '$0.00',
      deliveryFee,
      formattedDeliveryFee: deliveryFee === 0 ? 'COMPLIMENTARY' : `$${deliveryFee.toFixed(2)}`,
      grandTotal,
      formattedGrandTotal: `$${grandTotal.toFixed(2)}`
    };
  },

  /**
   * Determine progress index (0-3) for order timeline
   */
  getTimelineStep: (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('delivered') || s.includes('estate')) return 3;
    if (s.includes('courier') || s.includes('transit') || s.includes('dispatched')) return 2;
    if (s.includes('sealed') || s.includes('vault') || s.includes('processing')) return 1;
    return 0; // Order Authorized
  },

  /**
   * Fetch and format order history
   */
  fetchUserOrders: async () => {
    try {
      const response = await orderService.getOrders();
      const rawOrders = response.orders || [];

      return rawOrders.map(order => ({
        ...order,
        formattedTotal: `$${Number(order.total || 0).toFixed(2)}`,
        formattedSubtotal: `$${Number(order.subtotal || 0).toFixed(2)}`,
        formattedDiscount: Number(order.discount || 0) > 0 ? `-$${Number(order.discount).toFixed(2)}` : '$0.00',
        timelineStep: orderBusiness.getTimelineStep(order.status),
        formattedDate: new Date(order.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
    } catch (error) {
      console.error("Order Business Error (fetchUserOrders):", error);
      throw new Error(error.response?.data?.message || 'Failed to fetch sovereign order records');
    }
  },

  /**
   * Process and authorize order submission
   */
  processCheckoutOrder: async (orderPayload) => {
    try {
      const response = await orderService.createOrder(orderPayload);
      return response.order;
    } catch (error) {
      console.error("Order Business Error (processCheckoutOrder):", error);
      throw new Error(error.response?.data?.message || 'Failed to authorize royal order transaction');
    }
  }
};
