import { Router } from 'express';
import { memoryDb } from '../config/db.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';
import { sanitizeOrder, sanitizeProduct } from '../utils/sanitizer.js';
import { redisCache } from '../config/redis.js';
import { auditLogger } from '../utils/auditLogger.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { exportOrdersToCSV, exportInventoryToCSV } from '../utils/csvExporter.js';

const router = Router();

// Apply RBAC: Admin Role Required for all /api/admin endpoints
router.use(authenticateToken, requireRole('admin'));

// GET /api/admin/metrics (Executive KPIs)
router.get('/metrics', async (req, res) => {
  const totalOrders = memoryDb.orders.length;
  const totalRevenue = memoryDb.orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalArtifacts = memoryDb.products.length;
  const lowStockProducts = memoryDb.products.filter(p => p.stock <= 5);

  // Category counts
  const categoryCounts = {};
  for (const p of memoryDb.products) {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  }

  // Total items sold
  let totalItemsSold = 0;
  for (const order of memoryDb.orders) {
    if (order.items) {
      for (const item of order.items) {
        totalItemsSold += (item.quantity || 1);
      }
    }
  }

  const metricsData = {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    grossRevenue: Number(totalRevenue.toFixed(2)),
    totalOrders,
    avgOrderValue: Number(avgOrderValue.toFixed(2)),
    totalArtifacts,
    lowStockCount: lowStockProducts.length,
    totalItemsSold,
    categoryCounts
  };

  res.json({
    metrics: metricsData,
    data: metricsData,
    recentOrders: memoryDb.orders.slice(0, 5).map(sanitizeOrder)
  });
});

// GET /api/admin/analytics/sales-velocity (Category breakdown & Inventory Valuation)
router.get('/analytics/sales-velocity', (req, res) => {
  const totalVaultValuation = memoryDb.products.reduce((sum, p) => 
    sum + (Number(p.price || 0) * Number(p.stock || 0)), 0
  );

  // Category Revenue Share
  const categoryRevenue = {};
  for (const order of memoryDb.orders) {
    if (order.items) {
      for (const item of order.items) {
        const prod = memoryDb.products.find(p => p.id === item.id);
        const cat = prod?.category || 'General Haute Curations';
        const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + itemTotal;
      }
    }
  }

  // Top Selling Artifacts
  const productSalesCount = {};
  for (const order of memoryDb.orders) {
    if (order.items) {
      for (const item of order.items) {
        productSalesCount[item.id] = (productSalesCount[item.id] || 0) + (Number(item.quantity) || 1);
      }
    }
  }

  const topSellingArtifacts = Object.entries(productSalesCount)
    .map(([id, count]) => {
      const p = memoryDb.products.find(prod => prod.id === Number(id));
      return {
        id: Number(id),
        title: p?.title || `Artifact #${id}`,
        unitsSold: count,
        revenue: Number(((p?.price || 0) * count).toFixed(2))
      };
    })
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);

  const analyticsData = {
    totalVaultValuation: Number(totalVaultValuation.toFixed(2)),
    categoryRevenue: Object.entries(categoryRevenue).map(([category, revenue]) => ({
      category,
      revenue: Number(revenue.toFixed(2))
    })),
    topSellingArtifacts,
    inventoryTurnoverHealth: memoryDb.orders.length > 5 ? 'EXEMPLARY_HIGH_VELOCITY' : 'BALANCED'
  };

  return ApiResponse.success(res, analyticsData, 'Executive sales velocity harvested');
});

// GET /api/admin/export/orders-csv (One-click Orders CSV Download)
router.get('/export/orders-csv', (req, res) => {
  const csvContent = exportOrdersToCSV(memoryDb.orders);

  auditLogger.log({
    level: 'INFO',
    type: 'ADMIN_CSV_EXPORT_ORDERS',
    message: `Admin ${req.user.username} exported ${memoryDb.orders.length} orders to CSV`,
    req
  });

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="Royal_Orders_Ledger.csv"');
  return res.status(200).send(csvContent);
});

// GET /api/admin/export/inventory-csv (One-click Inventory Valuation CSV Download)
router.get('/export/inventory-csv', (req, res) => {
  const csvContent = exportInventoryToCSV(memoryDb.products);

  auditLogger.log({
    level: 'INFO',
    type: 'ADMIN_CSV_EXPORT_INVENTORY',
    message: `Admin ${req.user.username} exported ${memoryDb.products.length} inventory records to CSV`,
    req
  });

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="Royal_Inventory_Valuation.csv"');
  return res.status(200).send(csvContent);
});

// GET /api/admin/inventory-alerts (Low stock or out of stock items)
router.get('/inventory-alerts', (req, res) => {
  const alerts = memoryDb.products
    .filter(p => p.stock <= 5)
    .map(p => ({
      id: p.id,
      title: p.title,
      brand: p.brand,
      stock: p.stock,
      price: p.price,
      thumbnail: p.thumbnail,
      category: p.category,
      urgency: p.stock === 0 ? 'CRITICAL_DEPLETED' : 'WARNING_LOW_STOCK'
    }))
    .sort((a, b) => a.stock - b.stock);

  res.json({
    alerts,
    data: { alerts },
    count: alerts.length
  });
});

// GET /api/admin/soc-telemetry (Blue Team Security Operations Center Live Telemetry)
router.get('/soc-telemetry', (req, res) => {
  const telemetry = auditLogger.getMetrics();
  const recentLogs = auditLogger.getRecentEvents(30);

  return ApiResponse.success(res, {
    socStatus: 'ACTIVE_SHIELD',
    defensePosture: telemetry.threatLevel,
    totalEventsLogged: telemetry.totalEvents,
    criticalIncidents: telemetry.criticalCount,
    warnings: telemetry.warningCount,
    activeDefenses: {
      httpSecurityHeaders: 'ENFORCED (CSP, X-Frame-Options, HSTS, MIME-Protection)',
      adaptiveRateLimiting: 'ACTIVE (Sliding Window)',
      probabilisticBloomDefense: 'ACTIVE (3-Hash BitArray O(1))',
      tenantIsolationGate: 'STRICT_ENFORCEMENT',
      rbacEnforcement: 'STRICT_ADMIN_LOCKS'
    },
    recentSecurityLogs: recentLogs
  }, 'Blue Team SOC Telemetry Harvested');
});

// PATCH /api/admin/orders/:id/status (Update fulfillment status)
router.patch('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, estimatedDelivery } = req.body;

  const order = memoryDb.orders.find(o => o.orderId === id);
  if (!order) {
    return ApiResponse.error(res, 'Order not found in royal archives', 404, 'ORDER_NOT_FOUND');
  }

  if (status) {
    order.status = status;
  }
  if (estimatedDelivery) {
    order.estimatedDelivery = estimatedDelivery;
  }

  // Invalidate tenant cache if applicable
  if (order.userId) {
    await redisCache.del(`tenant:${order.userId}:orders`);
  }

  auditLogger.log({
    level: 'INFO',
    type: 'ORDER_FULFILLMENT_UPDATED',
    message: `Admin updated order #${id} status to "${order.status}"`,
    req,
    meta: { orderId: id, status: order.status }
  });

  res.json({
    message: `Order #${id} fulfillment stage updated to "${order.status}"`,
    order: sanitizeOrder(order),
    data: {
      order: sanitizeOrder(order)
    }
  });
});

export default router;
