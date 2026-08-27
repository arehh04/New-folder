/**
 * Data Isolation & Boundary Sanitization Utilities
 * Prevents raw database fields, password hashes, and internal metadata from leaking across API boundaries.
 */

/**
 * Sanitizes user entities for outbound transmission
 * @param {Object} user 
 * @returns {Object} Clean user DTO
 */
export function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, _id, __v, ...safeUser } = typeof user.toObject === 'function' ? user.toObject() : user;
  return safeUser;
}

/**
 * Sanitizes order records ensuring safe delivery
 * @param {Object} order 
 * @returns {Object} Safe order DTO
 */
export function sanitizeOrder(order) {
  if (!order) return null;
  const { _id, __v, ...safeOrder } = typeof order.toObject === 'function' ? order.toObject() : order;
  return safeOrder;
}

/**
 * Sanitizes product items
 * @param {Object} product 
 * @returns {Object} Safe product DTO
 */
export function sanitizeProduct(product) {
  if (!product) return null;
  const { _id, __v, ...safeProduct } = typeof product.toObject === 'function' ? product.toObject() : product;
  return safeProduct;
}
