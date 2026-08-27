import { useAuth as useAuthContext } from '../context/AuthContext';

/**
 * Custom hook to access authentication state and dispatch actions
 * @returns {Object} Auth state and functions
 */
export function useAuth() {
  return useAuthContext();
}
