import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlistItems } = useWishlist();
  const { addToCart, showToast } = useCart();

  const handleMoveAllToCart = () => {
    if (wishlistItems.length === 0) return;
    wishlistItems.forEach(item => {
      addToCart(item, 1, false);
    });
    showToast(`👑 Moved ${wishlistItems.length} curations to your Royal Vault!`);
  };

  return (
    <div className="wishlist-page min-h-screen bg-royalty-nude flex flex-col font-sans selection:bg-royalty-yellow/30 selection:text-royalty-purple">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12 border-b border-royalty-nude-dark pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-royalty-wine/10 border border-royalty-wine/20 text-royalty-wine text-xs font-bold uppercase tracking-widest mb-3">
              <span>💖</span> Sovereign Desires
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-royalty-purple tracking-tight">
              Sovereign Wishlist
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Your preserved treasury of desired artifacts ({wishlistItems.length} items saved).
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <button
              onClick={handleMoveAllToCart}
              className="bg-gradient-to-r from-royalty-wine to-royalty-purple hover:brightness-110 text-white font-extrabold py-3 px-6 rounded-full shadow-md text-xs uppercase tracking-wider transition-all cursor-pointer border border-royalty-yellow/30"
            >
              👑 Move All to Vault
            </button>
          )}
        </div>

        {/* Content Grid */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-royalty-nude-dark shadow-sm">
            <span className="text-6xl mb-4 block">💖</span>
            <h3 className="text-2xl font-bold text-royalty-purple mb-2">No Saved Curations</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
              You haven't reserved any treasures in your sovereign wishlist yet. Click the heart icon on any artifact to save it here.
            </p>
            <Link
              to="/"
              className="inline-block bg-royalty-wine hover:bg-royalty-wine-hover text-white font-bold py-3.5 px-8 rounded-full text-xs uppercase tracking-widest transition-all shadow-md"
            >
              Explore Sovereign Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
