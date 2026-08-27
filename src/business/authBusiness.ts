import { authService, LoginCredentials, RegisterUserData, AuthLoginResponse } from '../services/authService';
import { mapUserDtoToModel } from '../mappers';
import { UserModel, UserDTO } from '../types';

export interface UIUserProfile extends UserModel {
  displayRole: string;
  sovereignRank: string;
  avatarUrl: string;
}

/**
 * Transforms raw user auth payload into a sovereign royal profile
 */
export const transformUserForUI = (rawUser?: UserDTO | null): UIUserProfile | null => {
  if (!rawUser) return null;
  const user = mapUserDtoToModel(rawUser);
  if (!user) return null;

  return {
    ...user,
    displayRole: user.role === 'admin' ? 'Royal Vault Custodian' : 'Sovereign Patron',
    sovereignRank: '👑 Sovereign Tier Member',
    avatarUrl: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  };
};

export const authBusiness = {
  /**
   * Log in user and persist session token
   */
  authenticateUser: async (credentials: LoginCredentials): Promise<UIUserProfile | null> => {
    try {
      const data = await authService.login(credentials);
      if (data.accessToken) {
        localStorage.setItem('id10t_auth_token', data.accessToken);
        localStorage.setItem('id10t_auth_user', JSON.stringify(data));
      }
      return transformUserForUI(data);
    } catch (error: any) {
      console.error("Auth Business Error (authenticateUser):", error);
      throw new Error(error.response?.data?.message || 'Failed to authenticate royal patron credentials');
    }
  },

  /**
   * Register a new patron into the royal registry
   */
  registerNewPatron: async (userData: RegisterUserData): Promise<UIUserProfile | null> => {
    try {
      const data = await authService.register(userData);
      return transformUserForUI(data);
    } catch (error: any) {
      console.error("Auth Business Error (registerNewPatron):", error);
      throw new Error(error.response?.data?.message || 'Failed to register royal patron into vault records');
    }
  },

  /**
   * Retrieve active session user from storage or token
   */
  getStoredUser: (): UIUserProfile | null => {
    try {
      const raw = localStorage.getItem('id10t_auth_user');
      return raw ? transformUserForUI(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  },

  /**
   * Log out patron and clear storage
   */
  logoutPatron: (): void => {
    localStorage.removeItem('id10t_auth_token');
    localStorage.removeItem('id10t_auth_user');
  }
};

export default authBusiness;
