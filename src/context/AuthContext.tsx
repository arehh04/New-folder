import { createContext, useContext, useState, useEffect, useCallback, ReactNode, FC } from 'react';
import { authBusiness, UIUserProfile } from '../business/authBusiness';
import { LoginCredentials, RegisterUserData } from '../services/authService';

export interface AuthContextType {
  currentUser: UIUserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeAuthModal: () => void;
  login: (credentials: LoginCredentials) => Promise<UIUserProfile | null>;
  register: (userData: RegisterUserData) => Promise<UIUserProfile | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UIUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const restoreSession = useCallback((): void => {
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

  const login = useCallback(async (credentials: LoginCredentials): Promise<UIUserProfile | null> => {
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

  const register = useCallback(async (userData: RegisterUserData): Promise<UIUserProfile | null> => {
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

  const logout = useCallback((): void => {
    authBusiness.logoutPatron();
    setCurrentUser(null);
  }, []);

  const openLoginModal = useCallback((): void => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  }, []);

  const openRegisterModal = useCallback((): void => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback((): void => {
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
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
