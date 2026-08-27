import { authService } from '../services/authService';

/**
 * Transforms raw user auth payload into a sovereign royal profile
 * @param {Object} rawUser - User payload from API
 * @returns {Object} Formatted user object with royal credentials
 */
const transformUserForUI = (rawUser) => {
  if (!rawUser) return null;

  return {
    ...rawUser,
    fullName: `${rawUser.firstName || ''} ${rawUser.lastName || ''}`.trim() || rawUser.username,
    displayRole: rawUser.role === 'admin' ? 'Royal Vault Custodian' : 'Sovereign Patron',
    sovereignRank: '👑 Sovereign Tier Member',
    avatarUrl: rawUser.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  };
};

export const authBusiness = {
  /**
   * Log in user and persist session token
   * @param {Object} credentials - { username, password }
   * @returns {Promise<Object>} Formatted user profile
   */
  authenticateUser: async (credentials) => {
    try {
      const data = await authService.login(credentials);
      if (data.accessToken) {
        localStorage.setItem('id10t_auth_token', data.accessToken);
        localStorage.setItem('id10t_auth_user', JSON.stringify(data));
      }
      return transformUserForUI(data);
    } catch (error) {
      console.error("Auth Business Error (authenticateUser):", error);
      throw new Error(error.response?.data?.message || 'Failed to authenticate royal patron credentials');
    }
  },

  /**
   * Register a new patron into the royal registry
   * @param {Object} userData - User registration payload
   * @returns {Promise<Object>} Formatted created user
   */
  registerNewPatron: async (userData) => {
    try {
      const data = await authService.register(userData);
      return transformUserForUI(data);
    } catch (error) {
      console.error("Auth Business Error (registerNewPatron):", error);
      throw new Error(error.response?.data?.message || 'Failed to register royal patron into vault records');
    }
  },

  /**
   * Retrieve active session user from storage or token
   */
  getStoredUser: () => {
    try {
      const raw = localStorage.getItem('id10t_auth_user');
      return raw ? transformUserForUI(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  },

  /**
   * Terminate active royal session
   */
  terminateSession: () => {
    localStorage.removeItem('id10t_auth_token');
    localStorage.removeItem('id10t_auth_user');
  }
};
