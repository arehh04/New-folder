import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorite = isInWishlist(product.id);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-royalty-nude-dark/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-royalty-yellow/60 flex flex-col h-full relative group">
      
      {/* Image Showcase */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-b from-royalty-nude/40 to-white flex items-center justify-center p-6 border-b border-royalty-nude">
        <img 
          src={product.thumbnail} 
          alt={product.displayName} 
          className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />
        
        {/* Category Pill */}
        <div className="absolute top-3.5 right-3.5 bg-royalty-purple/95 backdrop-blur-md text-royalty-yellow border border-royalty-yellow/30 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">
          {product.displayBrand}
        </div>

        {/* Discount Badge */}
        {product.hasDiscount && (
          <div className="absolute top-3.5 left-3.5 bg-royalty-wine text-white px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
            {product.formattedDiscount}
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute bottom-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer ${
            isFavorite 
              ? 'bg-royalty-wine text-white scale-110' 
              : 'bg-white/90 hover:bg-white text-slate-400 hover:text-royalty-wine'
          }`}
          title={isFavorite ? "Remove from Sovereign Wishlist" : "Add to Sovereign Wishlist"}
          aria-label="Wishlist toggle"
        >
          <span className="text-base">{isFavorite ? '❤️' : '🤍'}</span>
        </button>
      </div>
      
      {/* Content Body */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline mb-2 gap-3">
          <Link 
            to={`/product/${product.id}`}
            className="text-base font-bold text-royalty-purple line-clamp-1 hover:text-royalty-wine transition-colors"
          >
            {product.displayName}
          </Link>
          <span className="text-base font-extrabold text-royalty-wine shrink-0">
            {product.formattedPrice}
          </span>
        </div>
        
        <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        {/* Card Footer */}
        <div className="pt-4 border-t border-royalty-nude flex items-center justify-between mt-auto">
          {/* Rating */}
          <div className="flex items-center gap-1 bg-royalty-nude px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 border border-royalty-nude-dark">
            <span className="text-royalty-yellow text-sm">★</span>
            <span>{product.rating}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => addToCart(product, 1)}
              className="bg-royalty-wine hover:bg-royalty-wine-hover text-white text-xs font-bold py-2 px-3.5 rounded-full shadow-xs hover:shadow-md transition-all duration-200 uppercase tracking-wider cursor-pointer"
              title="Add to Vault"
            >
              + Vault
            </button>
            <Link 
              to={`/product/${product.id}`} 
              className="bg-white hover:bg-royalty-nude text-royalty-purple border border-royalty-nude-dark hover:border-royalty-yellow text-xs font-bold py-1.5 px-3 rounded-full transition-all duration-200 no-underline uppercase tracking-wider"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
