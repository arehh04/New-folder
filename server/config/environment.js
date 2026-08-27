/**
 * Centralized Server Configuration & Environment Manager
 * Single source of truth for all backend environment variables, secrets, and connection parameters.
 */

const env = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'royal_vault_sovereign_secret_key_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  cookie: {
    name: 'royal_session',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days in ms
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  },

  database: {
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/id10t_vault'
  },

  cache: {
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    defaultTtl: 300 // 5 minutes
  },

  cors: {
    allowedOrigins: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000'
    ],
    credentials: true
  }
};

export const config = Object.freeze(env);
export default config;
