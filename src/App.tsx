import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Details, Checkout, Wishlist, Orders, AdminDashboard } from './pages';
import { CartDrawer, AuthModal } from './components';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

// Global Toast Banner
const GlobalToast: FC = () => {
  const { toast } = useCart();
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-royalty-purple text-white border border-royalty-yellow/60 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <span className="text-xl text-royalty-yellow">⚜️</span>
      <span className="text-xs font-bold uppercase tracking-wider text-royalty-nude">
        {toast}
      </span>
    </div>
  );
};

const AppContent: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Details />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <CartDrawer />
      <AuthModal />
      <GlobalToast />
    </BrowserRouter>
  );
};

export const App: FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
