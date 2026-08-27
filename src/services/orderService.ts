import axiosInstance from '../api/axiosInstance';
import { OrderDTO } from '../types';

export interface CreateOrderPayload {
  items: Array<{
    id: number | string;
    title?: string;
    price: number | string;
    quantity: number | string;
    thumbnail?: string;
  }>;
  customer?: {
    fullName?: string;
    email?: string;
  };
  shippingAddress?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  deliveryMethod?: string;
  paymentMethod?: string;
  subtotal: number;
  discount?: number;
  total: number;
}

export interface OrdersListResponse {
  orders: OrderDTO[];
  count: number;
  scope?: string;
}

export interface OrderCreateResponse {
  message: string;
  order: OrderDTO;
}

/**
 * Order API Service Layer (Encapsulated Promise API)
 */
export const orderService = {
  /**
   * Submit and authorize a royal order
   */
  createOrder: async (orderData: CreateOrderPayload): Promise<OrderCreateResponse> => {
    const res = await axiosInstance.post<OrderCreateResponse>('/orders', orderData);
    return res.data;
  },

  /**
   * Retrieve order details by ID
   */
  getOrderById: async (orderId: string): Promise<OrderDTO> => {
    const res = await axiosInstance.get<OrderDTO>(`/orders/${orderId}`);
    return res.data;
  },

  /**
   * List recent orders
   */
  getOrders: async (): Promise<OrdersListResponse> => {
    const res = await axiosInstance.get<OrdersListResponse>('/orders');
    return res.data;
  }
};

export default orderService;
