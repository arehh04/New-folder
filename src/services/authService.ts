import axiosInstance from '../api/axiosInstance';
import { UserDTO } from '../types';

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
   * Authenticate a user with credentials
   */
  login: async (credentials: LoginCredentials): Promise<AuthLoginResponse> => {
    const res = await axiosInstance.post<AuthLoginResponse>('/auth/login', {
      ...credentials,
      expiresInMins: credentials.expiresInMins || 60
    });
    return res.data;
  },

  /**
   * Register a new user
   */
  register: async (userData: RegisterUserData): Promise<UserDTO> => {
    const res = await axiosInstance.post<UserDTO>('/users/add', userData);
    return res.data;
  },

  /**
   * Fetch current authenticated user profile using token
   */
  getCurrentUser: async (token?: string): Promise<UserDTO> => {
    const config = token 
      ? { headers: { Authorization: `Bearer ${token}` } } 
      : undefined;
    const res = await axiosInstance.get<UserDTO>('/auth/me', config);
    return res.data;
  }
};

export default authService;
