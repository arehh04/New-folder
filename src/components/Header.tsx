import { useState, FC } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export const Header: FC = () => {
  const { getCartCount, getCartSubtotal, toggleCart } = useCart();
  const { currentUser, isAuthenticated, openLoginModal, logout } = useAuth();
  const { getWishlistCount } = useWishlist();
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();
  const subtotal = getCartSubtotal();

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-royalty-purple-dark text-royalty-yellow py-2 px-4 text-center text-xs font-semibold tracking-widest uppercase border-b border-royalty-purple flex items-center justify-center gap-2">
        <span>👑</span>
        <span>Complimentary Royal Dispatch On Orders Over $150</span>
        <span className="hidden sm:inline opacity-60">•</span>
        <span className="hidden sm:inline opacity-80">Authenticity Insured</span>
      </div>

      {/* Main Luxury Header */}
      <header className="sticky top-0 z-40 luxury-dark-glass border-b border-royalty-yellow/20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 text-decoration-none group">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-royalty-purple to-royalty-wine border border-royalty-yellow/50 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform duration-300">
              ⚜️
            </span>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gold-gradient tracking-widest uppercase">
                Id10T
              </span>
              <span className="text-[10px] text-royalty-nude/70 tracking-widest font-semibold uppercase -mt-1">
                Haute E-Commerce
              </span>
            </div>
          </Link>

          {/* Navigation & Controls */}
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link 
              to="/" 
              className="text-royalty-nude/90 hover:text-royalty-yellow font-semibold text-xs uppercase tracking-widest transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-royalty-yellow hover:after:w-full after:transition-all hidden md:inline"
            >
              Curations
            </Link>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative flex items-center gap-1.5 text-royalty-nude/90 hover:text-royalty-yellow font-semibold text-xs uppercase tracking-wider py-2 px-3 rounded-full hover:bg-white/10 transition-colors"
              title="Sovereign Wishlist"
            >
              <span>💖</span>
              <span className="hidden sm:inline">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-royalty-wine text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-royalty-yellow/50">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Orders Link */}
            <Link
              to="/orders"
              className="text-royalty-nude/90 hover:text-royalty-yellow font-semibold text-xs uppercase tracking-wider py-2 px-3 rounded-full hover:bg-white/10 transition-colors hidden sm:flex items-center gap-1.5"
              title="Sovereign Ledger & Orders"
            >
              <span>📜</span>
              <span>Ledger</span>
            </Link>

            {/* Auth / Profile Button */}
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(prev => !prev)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-royalty-yellow/40 hover:border-royalty-yellow text-royalty-yellow text-xs font-bold py-1.5 px-3 rounded-full transition-all cursor-pointer shadow-xs"
                >
                  <img 
                    src={currentUser.avatarUrl || currentUser.avatar} 
                    alt={currentUser.fullName}
                    className="w-5 h-5 rounded-full object-cover border border-royalty-yellow/50" 
                  />
                  <span className="max-w-[100px] truncate hidden sm:inline">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px]">▼</span>
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-royalty-nude-dark py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-royalty-nude">
                      <p className="text-xs font-bold text-royalty-purple truncate">
                        {currentUser.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {currentUser.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-royalty-yellow-light text-royalty-purple text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                        {currentUser.displayRole || currentUser.role}
                      </span>
                    </div>

                    <Link
                      to="/orders"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-royalty-nude transition-colors flex items-center gap-2.5"
                    >
                      <span>📜</span> Order History & Ledger
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-royalty-nude transition-colors flex items-center gap-2.5"
                    >
                      <span>💖</span> Sovereign Wishlist
                    </Link>

                    {/* Admin Dashboard Link (Conditional) */}
                    {currentUser.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-royalty-wine hover:bg-royalty-wine/10 transition-colors flex items-center gap-2.5"
                      >
                        <span>📊</span> Admin Analytics Sanctuary
                      </Link>
                    )}

                    <div className="border-t border-royalty-nude my-1"></div>

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>🚪</span> Terminate Royal Session
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={openLoginModal}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-royalty-yellow/40 hover:border-royalty-yellow text-royalty-yellow text-xs font-bold uppercase tracking-wider py-2 px-3.5 sm:px-4 rounded-full transition-all cursor-pointer shadow-xs"
              >
                <span>👑</span>
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={toggleCart}
              className="flex items-center gap-2 sm:gap-3 bg-white/10 hover:bg-white/15 border border-royalty-yellow/40 hover:border-royalty-yellow px-3 sm:px-4 py-2 rounded-full transition-all duration-300 cursor-pointer shadow-sm group"
              aria-label="Open cart drawer"
            >
              <div className="relative flex items-center">
                <span className="text-lg sm:text-xl">🛍️</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-royalty-wine text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-royalty-purple animate-pulse shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-royalty-nude group-hover:text-royalty-yellow tracking-wider hidden sm:inline">
                {cartCount > 0 ? subtotal.formatted : 'Vault'}
              </span>
            </button>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
