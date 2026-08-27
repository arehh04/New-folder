/**
 * Standardized API Response Formatter
 * Generates consistent, predictable response payloads across all REST endpoints.
 */

export class ApiResponse {
  /**
   * Send a successful response
   * @param {Object} res - Express response
   * @param {any} data - Response payload
   * @param {string} message - Optional user-friendly message
   * @param {number} statusCode - HTTP status code (default: 200)
   * @param {Object} meta - Optional metadata (e.g. cache status, timestamps)
   */
  static success(res, data = null, message = 'Operation successful', statusCode = 200, meta = {}) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta
      }
    });
  }

  /**
   * Send a formatted error response
   * @param {Object} res - Express response
   * @param {string} message - Error description
   * @param {number} statusCode - HTTP status code (default: 500)
   * @param {string} code - Error identifier code
   * @param {any} details - Additional debugging or validation details
   */
  static error(res, message = 'Internal sovereign server error', statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    const payload = {
      success: false,
      message,
      error: {
        code,
        statusCode,
        ...(details ? { details } : {})
      },
      timestamp: new Date().toISOString()
    };

    return res.status(statusCode).json(payload);
  }

  /**
   * Send a standardized paginated response
   */
  static paginated(res, items = [], total = 0, skip = 0, limit = 12, message = 'Curations retrieved successfully', meta = {}) {
    const hasMore = (Number(skip) + items.length) < total;

    return res.status(200).json({
      success: true,
      message,
      data: {
        items,
        total: Number(total),
        skip: Number(skip),
        limit: Number(limit),
        hasMore
      },
      meta: {
        timestamp: new Date().toISOString(),
        ...meta
      }
    });
  }
}
