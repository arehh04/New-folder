import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useCart } from './CartContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
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

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  const toggleWishlist = useCallback((product) => {
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

  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  }, []);

  const getWishlistCount = useCallback(() => {
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
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
