import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import { CartItem, UIProduct } from '../types';
import { formatCurrency } from '../utils/formatters';

export interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  toast: string | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: UIProduct, quantity?: number, shouldOpenDrawer?: boolean) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, newQuantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartSubtotal: () => { raw: number; formatted: string };
  showToast: (message: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('id10t_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('id10t_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Could not save cart to localStorage", e);
    }
  }, [cartItems]);

  const showToast = (message: string): void => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const openCart = (): void => setIsCartOpen(true);
  const closeCart = (): void => setIsCartOpen(false);
  const toggleCart = (): void => setIsCartOpen(prev => !prev);

  const addToCart = (product: UIProduct, quantity: number = 1, shouldOpenDrawer: boolean = true): void => {
    if (!product) return;
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });

    showToast(`👑 Added ${product.displayName || product.title} (${quantity}x) to your Vault`);
    
    if (shouldOpenDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId: number | string): void => {
    setCartItems(prev => prev.filter(item => item.id !== Number(productId)));
  };

  const updateQuantity = (productId: number | string, newQuantity: number): void => {
    const idNum = Number(productId);
    if (newQuantity <= 0) {
      removeFromCart(idNum);
      return;
    }
    setCartItems(prev =>
      prev.map(item => item.id === idNum ? { ...item, quantity: newQuantity } : item)
    );
  };

  const clearCart = (): void => {
    setCartItems([]);
  };

  const getCartCount = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartSubtotal = (): { raw: number; formatted: string } => {
    const rawTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    return {
      raw: rawTotal,
      formatted: formatCurrency(rawTotal)
    };
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        toast,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartSubtotal,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
