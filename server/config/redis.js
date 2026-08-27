import Redis from 'ioredis';

/**
 * High-Performance In-Memory Cache Fallback Adapter
 */
class MemoryCacheAdapter {
  constructor() {
    this.store = new Map();
    this.ttls = new Map();
    console.log('⚡ [CACHE ENGINE] Running high-speed In-Memory Cache (Redis Fallback Active)');
  }

  async get(key) {
    if (this.ttls.has(key) && Date.now() > this.ttls.get(key)) {
      this.store.delete(key);
      this.ttls.delete(key);
      return null;
    }
    const val = this.store.get(key);
    return val !== undefined ? JSON.stringify(val) : null;
  }

  async set(key, value, mode, durationSeconds) {
    let parsedValue;
    try {
      parsedValue = typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      parsedValue = value;
    }
    this.store.set(key, parsedValue);
    if (durationSeconds) {
      this.ttls.set(key, Date.now() + (durationSeconds * 1000));
    }
    return 'OK';
  }

  async del(key) {
    this.ttls.delete(key);
    return this.store.delete(key) ? 1 : 0;
  }

  async flushPattern(pattern) {
    const regex = new RegExp(`^${pattern.replace('*', '.*')}$`);
    let count = 0;
    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
        this.ttls.delete(key);
        count++;
      }
    }
    return count;
  }
}

/**
 * Universal Redis Cache Manager with automatic graceful fallback
 */
class RedisCacheManager {
  constructor() {
    this.client = null;
    this.isRedisConnected = false;
    this.fallback = new MemoryCacheAdapter();

    const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
    try {
      this.client = new Redis(REDIS_URL, {
        lazyConnect: true,
        connectTimeout: 1000,
        maxRetriesPerRequest: 1,
        retryStrategy: () => null // Don't hang on connection failure
      });

      this.client.connect()
        .then(() => {
          this.isRedisConnected = true;
          console.log('⚡ [REDIS ENGINE] Connected to live Redis Server on', REDIS_URL);
        })
        .catch(() => {
          this.isRedisConnected = false;
        });
    } catch {
      this.isRedisConnected = false;
    }
  }

  async get(key) {
    if (this.isRedisConnected && this.client) {
      try {
        return await this.client.get(key);
      } catch {
        return this.fallback.get(key);
      }
    }
    return this.fallback.get(key);
  }

  async set(key, value, ttlSeconds = 300) {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    if (this.isRedisConnected && this.client) {
      try {
        return await this.client.set(key, stringValue, 'EX', ttlSeconds);
      } catch {
        return this.fallback.set(key, stringValue, 'EX', ttlSeconds);
      }
    }
    return this.fallback.set(key, stringValue, 'EX', ttlSeconds);
  }

  async del(key) {
    if (this.isRedisConnected && this.client) {
      try {
        return await this.client.del(key);
      } catch {
        return this.fallback.del(key);
      }
    }
    return this.fallback.del(key);
  }

  async flushPattern(pattern) {
    if (this.isRedisConnected && this.client) {
      try {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          return await this.client.del(...keys);
        }
        return 0;
      } catch {
        return this.fallback.flushPattern(pattern);
      }
    }
    return this.fallback.flushPattern(pattern);
  }
}

export const redisCache = new RedisCacheManager();
