import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/environment.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { initDatabase } from './config/db.js';
import { errorHandlerMiddleware, notFoundHandlerMiddleware } from './middleware/errorHandlerMiddleware.js';
import { securityHeadersMiddleware } from './middleware/securityHeaders.js';
import { auditLogger } from './utils/auditLogger.js';
import { ApiResponse } from './utils/apiResponse.js';

const app = express();

// 1. Blue Team HTTP Security Hardening Headers
app.use(securityHeadersMiddleware);

// 2. CORS configuration from centralized environment
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie']
}));

// 3. Cookie Parser & Body Parsers
app.use(cookieParser());
app.use(express.json({ limit: '1mb' })); // Limit body payload size against DoS

// 4. Request SIEM Auditing & Security Telemetry
app.use((req, res, next) => {
  const isAuth = req.cookies?.[config.cookie.name] ? 'Authenticated' : 'Anonymous';
  console.log(`👑 [ROYAL API] ${req.method} ${req.url} - Cookie: ${isAuth}`);
  next();
});

// 5. Health check endpoint
app.get('/api/health', (req, res) => {
  return ApiResponse.success(res, {
    server: 'Id10T Maison de Luxe Enterprise API',
    environment: config.nodeEnv,
    socDefense: 'ACTIVE_BLUE_TEAM_FORTRESS',
    security: {
      headers: 'Enforced (CSP, HSTS, X-Frame-Options, MIME-NoSniff)',
      rateLimiting: 'Sliding Window Enabled',
      cookies: 'HTTP-Only Enabled',
      hashing: 'bcryptjs (10 rounds)',
      bloomFilter: 'Active',
      redisCache: 'Active',
      database: 'MongoDB / Memory Model Active'
    }
  }, 'Sovereign API Server Online & Operational (Blue Team Guarded)');
});

// 6. Mount Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// 7. 404 Route Interceptor with Blue Team Warning Log
app.use((req, res, next) => {
  auditLogger.log({
    level: 'INFO',
    type: 'ENDPOINT_NOT_FOUND',
    message: `Attempted access to unmapped route: ${req.method} ${req.originalUrl}`,
    req
  });
  return notFoundHandlerMiddleware(req, res);
});

// 8. Global Error Handler Middleware
app.use(errorHandlerMiddleware);

// Initialize Database, Bloom Filters & Boot Server
initDatabase().then(() => {
  app.listen(config.port, () => {
    console.log(`🛡️ [BLUE TEAM ACTIVE] Backend running on http://localhost:${config.port} (${config.nodeEnv})`);
    console.log(`📡 [SOC MONITOR] Telemetry online. Threat posture: DEFCON 5 (Normal)`);
  });
});
