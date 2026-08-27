import axiosInstance from '../api/axiosInstance';

/**
 * Admin Service Layer (Encapsulated Promise API for Store Custodians)
 */
export const adminService = {
  /**
   * Fetch executive metrics & KPI summaries
   * @returns {Promise<Object>} Metrics & recent orders
   */
  getMetrics: async () => {
    const res = await axiosInstance.get('/admin/metrics');
    return res.data;
  },

  /**
   * Fetch low stock & depleted inventory alerts
   * @returns {Promise<Object>} Inventory alerts
   */
  getInventoryAlerts: async () => {
    const res = await axiosInstance.get('/admin/inventory-alerts');
    return res.data;
  },

  /**
   * Fetch executive sales velocity & category distribution
   * @returns {Promise<Object>} Sales velocity data
   */
  getSalesVelocity: async () => {
    const res = await axiosInstance.get('/admin/analytics/sales-velocity');
    return res.data;
  },

  /**
   * Download Orders CSV report file
   */
  downloadOrdersCSV: async () => {
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
  downloadInventoryCSV: async () => {
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
   * @param {string} orderId 
   * @param {Object} statusData - { status, estimatedDelivery }
   * @returns {Promise<Object>} Updated order record
   */
  updateOrderStatus: async (orderId, statusData) => {
    const res = await axiosInstance.patch(`/admin/orders/${orderId}/status`, statusData);
    return res.data;
  }
};
