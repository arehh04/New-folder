import { orderService, CreateOrderPayload } from '../services/orderService';
import { mapOrderDtoToModel } from '../mappers';
import { formatCurrency } from '../utils/formatters';
import { OrderModel, CartItem } from '../types';

export interface OrderTotalsCalculation {
  subtotal: number;
  formattedSubtotal: string;
  discount: number;
  formattedDiscount: string;
  deliveryFee: number;
  formattedDeliveryFee: string;
  grandTotal: number;
  formattedGrandTotal: string;
}

export interface UIOrderModel extends OrderModel {
  timelineStep: number;
}

export const orderBusiness = {
  /**
   * Calculate checkout totals with optional promo codes
   */
  calculateOrderTotals: (
    cartItems: CartItem[] | Array<{ price?: number | string; quantity?: number | string }> = [], 
    promoCode: string = '', 
    deliveryFee: number = 0
  ): OrderTotalsCalculation => {
    const rawSubtotal = cartItems.reduce((acc, item) => acc + (Number(item.price || 0) * (Number(item.quantity) || 1)), 0);
    
    let discountAmount = 0;
    if (promoCode.trim().toUpperCase() === 'ROYAL10') {
      discountAmount = rawSubtotal * 0.10; // 10% discount
    }

    const grandTotal = Math.max(0, rawSubtotal - discountAmount + deliveryFee);

    return {
      subtotal: rawSubtotal,
      formattedSubtotal: formatCurrency(rawSubtotal),
      discount: discountAmount,
      formattedDiscount: discountAmount > 0 ? `-${formatCurrency(discountAmount)}` : '$0.00',
      deliveryFee,
      formattedDeliveryFee: deliveryFee === 0 ? 'COMPLIMENTARY' : formatCurrency(deliveryFee),
      grandTotal,
      formattedGrandTotal: formatCurrency(grandTotal)
    };
  },

  /**
   * Determine progress index (0-3) for order timeline
   */
  getTimelineStep: (status: string = ''): number => {
    const s = String(status).toLowerCase();
    if (s.includes('delivered') || s.includes('estate')) return 3;
    if (s.includes('courier') || s.includes('transit') || s.includes('dispatched')) return 2;
    if (s.includes('sealed') || s.includes('vault') || s.includes('processing') || s.includes('inspection')) return 1;
    return 0; // Order Authorized
  },

  /**
   * Fetch and format order history via Model Mapper
   */
  fetchUserOrders: async (): Promise<UIOrderModel[]> => {
    try {
      const response = await orderService.getOrders();
      const rawOrders = response.orders || [];

      return rawOrders.map(order => {
        const mapped = mapOrderDtoToModel(order);
        return {
          ...mapped,
          timelineStep: orderBusiness.getTimelineStep(mapped.status)
        };
      });
    } catch (error) {
      console.error("Business Layer Error (fetchUserOrders):", error);
      throw error;
    }
  },

  /**
   * Process a checkout order via Model Mapper
   */
  processCheckoutOrder: async (orderPayload: CreateOrderPayload): Promise<UIOrderModel> => {
    try {
      const response = await orderService.createOrder(orderPayload);
      const rawOrder = response.order || response;
      const mapped = mapOrderDtoToModel(rawOrder);
      return {
        ...mapped,
        timelineStep: orderBusiness.getTimelineStep(mapped.status)
      };
    } catch (error) {
      console.error("Business Layer Error (processCheckoutOrder):", error);
      throw error;
    }
  }
};

export default orderBusiness;
