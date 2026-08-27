import axiosInstance from '../api/axiosInstance';
import { SalesVelocityMetrics, OrderDTO } from '../types';

export interface AdminMetricsResponse {
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    totalArtifacts: number;
    totalItemsSold: number;
    categoryCounts: Record<string, number>;
  };
  recentOrders: OrderDTO[];
}

export interface InventoryAlertItem {
  id: number;
  title: string;
  stock: number;
  price: number;
  category: string;
}

export interface InventoryAlertsResponse {
  alerts: InventoryAlertItem[];
}

export interface UpdateOrderStatusPayload {
  status: string;
  estimatedDelivery?: string;
}

/**
 * Admin Service Layer (Encapsulated Promise API for Store Custodians)
 */
export const adminService = {
  /**
   * Fetch executive metrics & KPI summaries
   */
  getMetrics: async (): Promise<AdminMetricsResponse> => {
    const res = await axiosInstance.get<AdminMetricsResponse>('/admin/metrics');
    return res.data;
  },

  /**
   * Fetch low stock & depleted inventory alerts
   */
  getInventoryAlerts: async (): Promise<InventoryAlertsResponse> => {
    const res = await axiosInstance.get<InventoryAlertsResponse>('/admin/inventory-alerts');
    return res.data;
  },

  /**
   * Fetch executive sales velocity & category distribution
   */
  getSalesVelocity: async (): Promise<SalesVelocityMetrics> => {
    const res = await axiosInstance.get<SalesVelocityMetrics>('/admin/analytics/sales-velocity');
    return res.data;
  },

  /**
   * Download Orders CSV report file
   */
  downloadOrdersCSV: async (): Promise<void> => {
    const res = await axiosInstance.get('/admin/export/orders-csv', {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Royal_Orders_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Download Inventory Valuation CSV report file
   */
  downloadInventoryCSV: async (): Promise<void> => {
    const res = await axiosInstance.get('/admin/export/inventory-csv', {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Royal_Inventory_Valuation_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Update fulfillment status of an order
   */
  updateOrderStatus: async (orderId: string, payload: UpdateOrderStatusPayload): Promise<OrderDTO> => {
    const res = await axiosInstance.patch<OrderDTO>(`/admin/orders/${orderId}/status`, payload);
    return res.data;
  }
};

export default adminService;
