import axiosInstance from '../api/axiosInstance';

/**
 * Authentication Service Layer (Encapsulated Promise API)
 * Provides login, registration, and profile fetching functions returning standard Promises.
 */
export const authService = {
  /**
   * Authenticate a user with credentials
   * @param {Object} credentials - { username, password }
   * @returns {Promise<Object>} Authenticated user data with accessToken
   */
  login: async ({ username, password }) => {
    const res = await axiosInstance.post('/auth/login', {
      username,
      password,
      expiresInMins: 60,
    });
    return res.data;
  },

  /**
   * Register a new user
   * @param {Object} userData - { firstName, lastName, username, email, password }
   * @returns {Promise<Object>} Created user record
   */
  register: async (userData) => {
    const res = await axiosInstance.post('/users/add', userData);
    return res.data;
  },

  /**
   * Fetch current authenticated user profile using token
   * @param {string} token - Access token
   * @returns {Promise<Object>} User profile object
   */
  getCurrentUser: async (token) => {
    const res = await axiosInstance.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
};
