import { verifyToken } from '../utils/security.js';

/**
 * Authentication Middleware
 * Enforces mandatory active session token
 */
export function authenticateToken(req, res, next) {
  const token = req.cookies?.royal_session || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      message: 'Authentication required. No sovereign session token detected.',
      code: 'AUTH_REQUIRED'
    });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({
      message: 'Sovereign session token expired or invalid.',
      code: 'TOKEN_INVALID'
    });
  }

  req.user = payload;
  next();
}

/**
 * Optional Authentication Middleware
 * Populates req.user if a session exists, but permits guest workflows
 */
export function optionalAuth(req, res, next) {
  const token = req.cookies?.royal_session || req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  
  next();
}

/**
 * Role-Based Access Control (RBAC) Middleware
 * Restricts route access to specified sovereign roles (e.g. 'admin')
 * @param  {...string} allowedRoles 
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required to evaluate sovereign credentials.',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Sovereign role [${req.user.role}] lacks required clearance [${allowedRoles.join(', ')}].`,
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
}
