/**
 * Centralized Frontend Application Constants
 * Single source of truth for API endpoints, storage keys, promo codes, and brand metadata.
 */

export const APP_CONFIG = Object.freeze({
  NAME: 'Id10T',
  FULL_NAME: 'Id10T Maison de Haute Curations',
  TAGLINE: 'The Sovereign Sanctuary of Curated Luxury',
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  API_TIMEOUT: 10000,

  STORAGE_KEYS: {
    AUTH_TOKEN: 'id10t_auth_token',
    CART_ITEMS: 'id10t_vault_cart',
    WISHLIST_ITEMS: 'id10t_sovereign_wishlist'
  },

  PROMO_CODES: {
    ROYAL10: {
      CODE: 'ROYAL10',
      DISCOUNT_RATE: 0.10,
      LABEL: '10% Sovereign Privilege Discount'
    }
  },

  SHIPPING: {
    FREE_THRESHOLD: 150.00,
    STANDARD_FEE: 15.00,
    EXPRESS_FEE: 35.00
  },

  THEME: {
    NUDE: '#FAF7F2',
    WINE: '#6B1D2F',
    PURPLE: '#2A173B',
    GOLD: '#D4AF37'
  }
});

export default APP_CONFIG;
