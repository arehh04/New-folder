import { adminService } from '../services/adminService';

export const adminBusiness = {
  /**
   * Fetch formatted metrics & low-stock alerts for the Admin Sanctuary
   */
  getDashboardData: async () => {
    try {
      const [metricsData, alertsData] = await Promise.all([
        adminService.getMetrics(),
        adminService.getInventoryAlerts()
      ]);

      const rawMetrics = metricsData.metrics || {};
      const recentOrders = metricsData.recentOrders || [];
      const alerts = alertsData.alerts || [];

      return {
        metrics: {
          totalRevenueFormatted: `$${Number(rawMetrics.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          totalOrders: rawMetrics.totalOrders || 0,
          avgOrderValueFormatted: `$${Number(rawMetrics.avgOrderValue || 0).toFixed(2)}`,
          totalArtifacts: rawMetrics.totalArtifacts || 0,
          lowStockCount: alerts.length,
          totalItemsSold: rawMetrics.totalItemsSold || 0,
          categoryCounts: rawMetrics.categoryCounts || {}
        },
        recentOrders: recentOrders.map(o => ({
          ...o,
          formattedTotal: `$${Number(o.total || 0).toFixed(2)}`,
          formattedDate: new Date(o.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        })),
        alerts: alerts.map(a => ({
          ...a,
          formattedPrice: `$${Number(a.price).toFixed(2)}`,
          isCritical: a.stock === 0
        }))
      };
    } catch (error) {
      console.error("Admin Business Error (getDashboardData):", error);
      throw new Error(error.response?.data?.message || 'Access denied or failed to load royal admin metrics');
    }
  },

  /**
   * Update order fulfillment stage
   */
  updateOrderStatus: async (orderId, newStatus, estimatedDelivery) => {
    try {
      return await adminService.updateOrderStatus(orderId, {
        status: newStatus,
        estimatedDelivery
      });
    } catch (error) {
      console.error("Admin Business Error (updateOrderStatus):", error);
      throw new Error(error.response?.data?.message || 'Failed to update order fulfillment status');
    }
  }
};
