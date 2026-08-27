import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authBusiness } from '../business/authBusiness';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  /**
   * useEffect callback to restore authenticated session on mount
   */
  const restoreSession = useCallback(() => {
    try {
      const stored = authBusiness.getStoredUser();
      if (stored) {
        setCurrentUser(stored);
      }
    } catch (err) {
      console.error("Session restore error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  /**
   * Login Promise callback function
   */
  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const user = await authBusiness.authenticateUser(credentials);
      setCurrentUser(user);
      setIsAuthModalOpen(false);
      return user;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Register Promise callback function
   */
  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      const newUser = await authBusiness.registerNewPatron(userData);
      setCurrentUser(newUser);
      setIsAuthModalOpen(false);
      return newUser;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout callback function
   */
  const logout = useCallback(() => {
    authBusiness.terminateSession();
    setCurrentUser(null);
  }, []);

  const openLoginModal = useCallback(() => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  }, []);

  const openRegisterModal = useCallback(() => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loading,
        isAuthModalOpen,
        authMode,
        setAuthMode,
        openLoginModal,
        openRegisterModal,
        closeAuthModal,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
