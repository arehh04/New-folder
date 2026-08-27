/**
 * Centralized Frontend Application Constants
 * Single source of truth for API endpoints, storage keys, promo codes, and brand metadata.
 */

export interface PromoCodeConfig {
  CODE: string;
  DISCOUNT_RATE: number;
  LABEL: string;
}

export interface AppConfig {
  NAME: string;
  FULL_NAME: string;
  TAGLINE: string;
  API_BASE_URL: string;
  API_TIMEOUT: number;
  STORAGE_KEYS: {
    AUTH_TOKEN: string;
    AUTH_USER: string;
    CART_ITEMS: string;
    WISHLIST_ITEMS: string;
  };
  PROMO_CODES: Record<string, PromoCodeConfig>;
  SHIPPING: {
    FREE_THRESHOLD: number;
    STANDARD_FEE: number;
    EXPRESS_FEE: number;
  };
  THEME: {
    NUDE: string;
    WINE: string;
    PURPLE: string;
    GOLD: string;
  };
}

export const APP_CONFIG: AppConfig = Object.freeze({
  NAME: 'Id10T',
  FULL_NAME: 'Id10T Maison de Haute Curations',
  TAGLINE: 'The Sovereign Sanctuary of Curated Luxury',
  API_BASE_URL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api',
  API_TIMEOUT: 10000,

  STORAGE_KEYS: {
    AUTH_TOKEN: 'id10t_auth_token',
    AUTH_USER: 'id10t_auth_user',
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
