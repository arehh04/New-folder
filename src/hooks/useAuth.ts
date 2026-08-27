import { useAuth as useAuthContext } from '../context/AuthContext';

/**
 * Custom hook to access authentication state and dispatch actions
 */
export function useAuth() {
  return useAuthContext();
}

export default useAuth;
