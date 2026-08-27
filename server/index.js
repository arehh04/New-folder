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

// 5b. Interactive Swagger UI & OpenAPI Specification
app.get('/api/docs/openapi.json', async (req, res) => {
  const specPath = new URL('./docs/openapi.json', import.meta.url);
  const specContent = (await import('fs/promises')).readFile(specPath, 'utf-8');
  res.setHeader('Content-Type', 'application/json');
  return res.send(await specContent);
});

app.get('/api/docs', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>👑 Id10T Maison de Luxe — Interactive API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
  <style>
    body { margin: 0; background: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .topbar { display: none !important; }
    .swagger-ui .info .title { color: #2A173B !important; font-weight: 800; }
    .swagger-ui .opblock.opblock-get .opblock-summary { border-color: #6B1D2F; }
    .swagger-ui .btn.authorize { background-color: #6B1D2F !important; color: #fff !important; border-color: #D4AF37 !important; }
    .royal-banner { background: #2A173B; color: #D4AF37; padding: 18px 24px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; font-size: 13px; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #D4AF37; }
    .royal-banner a { color: #FAF7F2; text-decoration: none; font-size: 11px; padding: 6px 14px; background: rgba(255,255,255,0.1); border-radius: 20px; border: 1px solid #D4AF37; }
  </style>
</head>
<body>
  <div class="royal-banner">
    <span>⚜️ Id10T Maison de Luxe — Enterprise API Architecture (OpenAPI 3.0)</span>
    <a href="/">← Return to Store Vault</a>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: "/api/docs/openapi.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`);
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
