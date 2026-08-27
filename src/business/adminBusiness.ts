import { adminService, UpdateOrderStatusPayload } from '../services/adminService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { mapOrderDtoToModel } from '../mappers';
import { OrderModel, SalesVelocityMetrics } from '../types';

export interface UIDashboardMetrics {
  totalRevenueFormatted: string;
  totalOrders: number;
  avgOrderValueFormatted: string;
  totalArtifacts: number;
  lowStockCount: number;
  totalItemsSold: number;
  categoryCounts: Record<string, number>;
}

export interface UIInventoryAlert {
  id: number;
  title: string;
  stock: number;
  price: number;
  category: string;
  formattedPrice: string;
  isCritical: boolean;
}

export interface UIDashboardData {
  metrics: UIDashboardMetrics;
  recentOrders: OrderModel[];
  alerts: UIInventoryAlert[];
}

export const adminBusiness = {
  /**
   * Fetch formatted metrics & low-stock alerts for the Admin Sanctuary
   */
  getDashboardData: async (): Promise<UIDashboardData> => {
    try {
      const [metricsData, alertsData] = await Promise.all([
        adminService.getMetrics(),
        adminService.getInventoryAlerts()
      ]);

      const rawMetrics = metricsData.metrics || {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        totalArtifacts: 0,
        totalItemsSold: 0,
        categoryCounts: {}
      };
      const recentOrders = metricsData.recentOrders || [];
      const alerts = alertsData.alerts || [];

      return {
        metrics: {
          totalRevenueFormatted: formatCurrency(rawMetrics.totalRevenue || 0),
          totalOrders: rawMetrics.totalOrders || 0,
          avgOrderValueFormatted: formatCurrency(rawMetrics.avgOrderValue || 0),
          totalArtifacts: rawMetrics.totalArtifacts || 0,
          lowStockCount: alerts.length,
          totalItemsSold: rawMetrics.totalItemsSold || 0,
          categoryCounts: rawMetrics.categoryCounts || {}
        },
        recentOrders: recentOrders.map(mapOrderDtoToModel),
        alerts: alerts.map(a => ({
          ...a,
          formattedPrice: formatCurrency(a.price),
          isCritical: a.stock === 0
        }))
      };
    } catch (error: any) {
      console.error("Admin Business Error (getDashboardData):", error);
      throw new Error(error.response?.data?.message || 'Access denied or failed to load royal admin metrics');
    }
  },

  /**
   * Update order fulfillment stage
   */
  updateOrderStatus: async (orderId: string, newStatus: string, estimatedDelivery?: string) => {
    try {
      return await adminService.updateOrderStatus(orderId, {
        status: newStatus,
        estimatedDelivery
      });
    } catch (error: any) {
      console.error("Admin Business Error (updateOrderStatus):", error);
      throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
  },

  /**
   * Fetch sales velocity analytics
   */
  getSalesVelocity: async (): Promise<SalesVelocityMetrics> => {
    return await adminService.getSalesVelocity();
  }
};

export default adminBusiness;
