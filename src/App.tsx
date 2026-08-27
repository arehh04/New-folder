import { FC, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartDrawer, AuthModal } from './components';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

// Route-Level Code Splitting: Lazy loaded route chunks for sub-second initial load times
const Home = lazy(() => import('./pages/Home'));
const Details = lazy(() => import('./pages/Details'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Orders = lazy(() => import('./pages/Orders'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Royal Page Loading Fallback Component
const PageLoadingFallback: FC = () => {
  return (
    <div className="min-h-screen bg-royalty-nude flex flex-col items-center justify-center p-6 text-center animate-pulse">
      <div className="w-16 h-16 rounded-2xl bg-royalty-purple text-royalty-yellow border-2 border-royalty-yellow/50 flex items-center justify-center text-3xl shadow-xl mb-4 animate-bounce">
        ⚜️
      </div>
      <h3 className="text-base font-extrabold uppercase tracking-widest text-royalty-purple mb-1">
        Unlocking Sovereign Sanctuary...
      </h3>
      <p className="text-xs text-slate-400 font-semibold">
        Fetching cryptographic vault archives and haute assets.
      </p>
      <div className="w-40 h-1 bg-royalty-nude-dark rounded-full overflow-hidden mt-4">
        <div className="h-full gold-shimmer rounded-full w-full"></div>
      </div>
    </div>
  );
};

// Global Toast Notification Banner
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
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Details />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
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
