import { Router } from 'express';
import { optionalAuth, authenticateToken } from '../middleware/authMiddleware.js';
import { sanitizeOrder } from '../utils/sanitizer.js';
import { redisCache } from '../config/redis.js';
import { memoryDb } from '../config/db.js';
import { ApiResponse } from '../utils/apiResponse.js';

const router = Router();

// POST /api/orders (Create Royal Order with isolated Patron binding)
router.post('/', optionalAuth, async (req, res) => {
  const { items, customer, shippingAddress, deliveryMethod, paymentMethod, subtotal, discount, total } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return ApiResponse.error(res, 'Cannot generate order for an empty royal vault', 400, 'EMPTY_ORDER');
  }

  // 1. FINANCIAL INTEGRITY & BOUNDARY VALIDATION (Red Team Hardening)
  for (const item of items) {
    const qty = Number(item.quantity);
    const itemPrice = Number(item.price);
    if (!Number.isInteger(qty) || qty <= 0) {
      return ApiResponse.error(res, `Invalid quantity [${item.quantity}] for item "${item.title}". Quantity must be a positive integer.`, 400, 'INVALID_QUANTITY');
    }
    if (isNaN(itemPrice) || itemPrice <= 0) {
      return ApiResponse.error(res, `Invalid price [${item.price}] for item "${item.title}". Financial prices must be positive numbers.`, 400, 'NEGATIVE_PRICE_REJECTED');
    }
  }

  const numSubtotal = Number(subtotal);
  const numDiscount = Number(discount) || 0;
  const numTotal = Number(total);

  if (isNaN(numSubtotal) || numSubtotal <= 0 || isNaN(numTotal) || numTotal < 0 || numDiscount < 0) {
    return ApiResponse.error(res, 'Financial integrity violation: Order subtotal and grand total must be strictly positive values.', 400, 'FINANCIAL_INTEGRITY_VIOLATION');
  }

  const orderId = `ROYAL-${Math.floor(100000 + Math.random() * 900000)}`;
  const userId = req.user ? req.user.id : null; // Isolate user identity

  const newOrder = {
    orderId,
    userId, // Tenant / User Isolation Key
    createdAt: new Date().toISOString(),
    customer: customer || { fullName: 'Sovereign Patron', email: 'patron@royalvault.com' },
    shippingAddress: shippingAddress || {
      street: '100 Palace Gardens',
      city: 'London',
      postalCode: 'SW1A 1AA',
      country: 'United Kingdom'
    },
    deliveryMethod: deliveryMethod || 'Complimentary Royal Dispatch',
    paymentMethod: paymentMethod || 'Vault Insured Credit',
    items: items.map(item => ({
      id: item.id,
      title: item.displayName || item.title,
      price: Number(Number(item.price).toFixed(2)),
      quantity: Number(item.quantity),
      thumbnail: item.thumbnail
    })),
    subtotal: Number(numSubtotal.toFixed(2)),
    discount: Number(numDiscount.toFixed(2)),
    total: Number(numTotal.toFixed(2)),
    status: 'Dispatched via Sovereign Courier',
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    })
  };

  memoryDb.orders.unshift(newOrder);

  // Invalidate isolated tenant cache if authenticated
  if (userId) {
    await redisCache.del(`tenant:${userId}:orders`);
  }

  return res.status(201).json({
    success: true,
    message: 'Royal Order Authorized and Processed',
    order: sanitizeOrder(newOrder),
    data: {
      order: sanitizeOrder(newOrder)
    }
  });
});

// GET /api/orders (Strictly Patron-Isolated Order Ledger)
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const cacheKey = `tenant:${userId}:orders`;

  // 1. Check Redis Cache for isolated tenant orders
  const cached = await redisCache.get(cacheKey);
  if (cached) {
    res.setHeader('X-Cache-Status', 'HIT');
    res.setHeader('X-Tenant-Scope', `PATRON_ISOLATED_LEDGER_USER_${userId}`);
    return res.json(JSON.parse(cached));
  }

  // 2. Query Memory Database with Strict User Scoping
  let isolatedOrders;
  if (userRole === 'admin') {
    isolatedOrders = memoryDb.orders;
  } else {
    isolatedOrders = memoryDb.orders.filter(order => order.userId === userId);
  }

  const sanitizedOrders = isolatedOrders.map(sanitizeOrder);
  const responsePayload = {
    scope: userRole === 'admin' ? 'GLOBAL_ADMIN_OVERVIEW' : `PATRON_ISOLATED_LEDGER_USER_${userId}`,
    count: sanitizedOrders.length,
    orders: sanitizedOrders,
    data: {
      orders: sanitizedOrders
    }
  };

  // 3. Store in tenant-isolated Redis cache (60s TTL)
  await redisCache.set(cacheKey, responsePayload, 60);
  res.setHeader('X-Cache-Status', 'MISS');
  res.setHeader('X-Tenant-Scope', `PATRON_ISOLATED_LEDGER_USER_${userId}`);

  res.json(responsePayload);
});

// GET /api/orders/:orderId (Single Order Lookup with Ownership Verification)
router.get('/:orderId', optionalAuth, async (req, res) => {
  const { orderId } = req.params;
  const order = memoryDb.orders.find(o => o.orderId === orderId);

  if (!order) {
    return ApiResponse.error(res, `Consignment #${orderId} not found in royal archives`, 404, 'ORDER_NOT_FOUND');
  }

  // ENFORCE TENANT ISOLATION:
  // If order is bound to a registered user, ONLY that user or an admin can access it!
  if (order.userId !== null) {
    if (!req.user) {
      return ApiResponse.error(res, 'Authentication required to inspect registered patron consignment records', 403, 'AUTH_REQUIRED_FOR_ORDER');
    }

    if (req.user.id !== order.userId && req.user.role !== 'admin') {
      return ApiResponse.error(res, 'Forbidden: Access denied to foreign patron order records.', 403, 'TENANT_ISOLATION_VIOLATION');
    }
  }

  res.json({
    order: sanitizeOrder(order),
    data: {
      order: sanitizeOrder(order)
    }
  });
});

export default router;
