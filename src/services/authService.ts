import axiosInstance from '../api/axiosInstance';
import { UserDTO } from '../types';
import { APP_CONFIG } from '../config/constants';

export interface LoginCredentials {
  username: string;
  password?: string;
  expiresInMins?: number;
}

export interface AuthLoginResponse extends UserDTO {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  message?: string;
}

export interface RegisterUserData {
  username: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

/**
 * Authentication Service Layer (Encapsulated Promise API)
 */
export const authService = {
  /**
   * Authenticate a user with credentials and store JWT token
   */
  login: async (credentials: LoginCredentials): Promise<AuthLoginResponse> => {
    const res = await axiosInstance.post<AuthLoginResponse>('/auth/login', {
      ...credentials,
      expiresInMins: credentials.expiresInMins || 60
    });
    const data = res.data;
    const token = data.accessToken || data.token;
    if (token) {
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_USER, JSON.stringify(data));
    }
    return data;
  },

  /**
   * Register a new patron into the vault
   */
  register: async (userData: RegisterUserData): Promise<AuthLoginResponse> => {
    const res = await axiosInstance.post<AuthLoginResponse>('/auth/register', userData);
    const data = res.data;
    const token = data.accessToken || data.token;
    if (token) {
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_USER, JSON.stringify(data));
    }
    return data;
  },

  /**
   * Fetch current authenticated user profile using token
   */
  getCurrentUser: async (token?: string): Promise<UserDTO> => {
    const activeToken = token || localStorage.getItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    const config = activeToken 
      ? { headers: { Authorization: `Bearer ${activeToken}` } } 
      : undefined;
    const res = await axiosInstance.get<UserDTO>('/auth/me', config);
    return res.data;
  },

  /**
   * Terminate active session and clear token storage
   */
  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      console.warn("Backend logout notification failed (clearing local state anyway):", err);
    } finally {
      localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_USER);
    }
  }
};

export default authService;
