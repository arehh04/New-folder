/**
 * BLUE TEAM HTTP SECURITY HEADERS MIDDLEWARE
 * Hardens HTTP response headers against Clickjacking, MIME-Sniffing, and Cross-Site Scripting.
 */

export function securityHeadersMiddleware(req, res, next) {
  // 1. Prevent Clickjacking (disallow embedding in iframes)
  res.setHeader('X-Frame-Options', 'DENY');

  // 2. Prevent MIME-type Sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // 3. Enable Cross-Site Scripting (XSS) Filter in older browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // 4. Referrer Policy: Send full URL for same-origin, domain-only for cross-origin
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 5. Restrict dangerous browser features (Microphone, Camera, Geolocation)
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');

  // 6. Content Security Policy (CSP)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com data:; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' http://localhost:5000 http://localhost:5173 https://dummyjson.com;"
  );

  next();
}
