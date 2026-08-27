import { ApiResponse } from '../utils/apiResponse.js';
import { config } from '../config/environment.js';

/**
 * Global Exception Interceptor & Error Handler Middleware
 */
export function errorHandlerMiddleware(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'The Royal Server encountered an unexpected anomaly';
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const details = !config.isProduction && err.stack ? { stack: err.stack } : err.details;

  // Log error to server console
  console.error(`💥 [ERROR ${statusCode}] ${req.method} ${req.url} -> [${code}] ${message}`);
  if (!config.isProduction && err.stack) {
    console.error(err.stack);
  }

  return ApiResponse.error(res, message, statusCode, code, details);
}

/**
 * 404 Route Not Found Middleware
 */
export function notFoundHandlerMiddleware(req, res) {
  return ApiResponse.error(
    res,
    `Endpoint ${req.method} ${req.originalUrl} does not exist in the Royal Vault API`,
    404,
    'ROUTE_NOT_FOUND'
  );
}
