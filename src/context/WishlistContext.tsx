import { createContext, useContext, useState, useEffect, useCallback, ReactNode, FC } from 'react';
import { useCart } from './CartContext';
import { UIProduct } from '../types';

export interface WishlistContextType {
  wishlistItems: UIProduct[];
  isInWishlist: (productId: number | string) => boolean;
  toggleWishlist: (product: UIProduct) => void;
  removeFromWishlist: (productId: number | string) => void;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<UIProduct[]>(() => {
    try {
      const saved = localStorage.getItem('id10t_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useCart();

  useEffect(() => {
    try {
      localStorage.setItem('id10t_wishlist', JSON.stringify(wishlistItems));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  }, [wishlistItems]);

  const isInWishlist = useCallback((productId: number | string): boolean => {
    const idNum = Number(productId);
    return wishlistItems.some(item => item.id === idNum);
  }, [wishlistItems]);

  const toggleWishlist = useCallback((product: UIProduct): void => {
    if (!product) return;

    setWishlistItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast(`💔 Removed ${product.displayName || product.title} from Wishlist`);
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(`💖 Added ${product.displayName || product.title} to Sovereign Wishlist`);
        return [...prev, product];
      }
    });
  }, [showToast]);

  const removeFromWishlist = useCallback((productId: number | string): void => {
    const idNum = Number(productId);
    setWishlistItems(prev => prev.filter(item => item.id !== idNum));
  }, []);

  const getWishlistCount = useCallback((): number => {
    return wishlistItems.length;
  }, [wishlistItems]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        getWishlistCount
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

export default WishlistContext;
