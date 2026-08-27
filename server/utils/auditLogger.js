/**
 * BLUE TEAM SIEM & AUDIT LOGGING ENGINE
 * Emits structured security events for real-time threat monitoring and incident response.
 */

class AuditLogger {
  constructor() {
    this.eventBuffer = [];
    this.maxBufferSize = 200;
  }

  /**
   * Log a security incident or access event
   * @param {Object} event
   * @param {'INFO'|'WARN'|'ALERT'|'CRITICAL'} event.level - Threat severity
   * @param {string} event.type - Event category (e.g. AUTH_FAILURE, IDOR_ATTEMPT, RATE_LIMITED)
   * @param {string} event.message - Human-readable description
   * @param {Object} event.req - Express request object for IP & headers
   * @param {Object} event.meta - Custom payload metadata
   */
  log({ level = 'INFO', type, message, req = null, meta = {} }) {
    const timestamp = new Date().toISOString();
    const clientIp = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';
    const userAgent = req?.headers['user-agent'] || 'Unknown Agent';

    const logEntry = {
      timestamp,
      level,
      type,
      message,
      clientIp,
      userAgent,
      path: req ? `${req.method} ${req.originalUrl || req.url}` : 'INTERNAL',
      meta
    };

    // Keep fixed-size in-memory SIEM buffer for SOC inspection
    this.eventBuffer.unshift(logEntry);
    if (this.eventBuffer.length > this.maxBufferSize) {
      this.eventBuffer.pop();
    }

    // Formatted SOC Console Output
    const colorMap = {
      INFO: '\x1b[36mℹ️ [INFO]\x1b[0m',
      WARN: '\x1b[33m⚠️ [WARN]\x1b[0m',
      ALERT: '\x1b[35m🚨 [ALERT]\x1b[0m',
      CRITICAL: '\x1b[31m💥 [CRITICAL]\x1b[0m'
    };

    console.log(`${colorMap[level] || level} [${type}] ${message} | IP: ${clientIp}`);
  }

  /**
   * Retrieve recent security events for the SOC Dashboard
   */
  getRecentEvents(limit = 50) {
    return this.eventBuffer.slice(0, limit);
  }

  /**
   * Compute live SOC security metrics
   */
  getMetrics() {
    const totalEvents = this.eventBuffer.length;
    const criticalCount = this.eventBuffer.filter(e => e.level === 'CRITICAL' || e.level === 'ALERT').length;
    const warningCount = this.eventBuffer.filter(e => e.level === 'WARN').length;
    const recentAttacks = this.eventBuffer.slice(0, 10);

    return {
      threatLevel: criticalCount > 5 ? 'DEFCON 2 (Elevated Threat)' : criticalCount > 0 ? 'DEFCON 4 (Guarded)' : 'DEFCON 5 (Normal)',
      totalEvents,
      criticalCount,
      warningCount,
      recentAttacks
    };
  }
}

export const auditLogger = new AuditLogger();
export default auditLogger;
