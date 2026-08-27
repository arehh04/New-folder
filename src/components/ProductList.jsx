import { useState, useMemo } from 'react';
import { useProducts, useDebounce } from '../hooks';
import ProductCard from './ProductCard';
import CardSkeleton from './CardSkeleton';
import FuzzySearchBar from './FuzzySearchBar';

export default function ProductList({ _onOpenCreateModal }) {
  const { 
    products, 
    loading, 
    loadingMore, 
    error, 
    total, 
    hasMore, 
    loadMoreProducts, 
    refreshProducts 
  } = useProducts(12);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  
  // Debounce search query by 300ms to eliminate continuous re-renders and re-filtering during typing
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Feature 5: Multi-Facet Filters
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Extract unique categories dynamically from products
  const categories = useMemo(() => {
    if (!products || products.length === 0) return ['All'];
    const unique = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    return ['All', ...unique];
  }, [products]);

  // Filter and sort products across all facets using debounced search
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    const query = debouncedSearchQuery.trim().toLowerCase();

    return products
      .filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category?.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = query === '' || 
          product.title?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          (product.brand && product.brand.toLowerCase().includes(query));
        
        const matchesPrice = Number(product.price) <= maxPrice;
        const matchesRating = Number(product.rating || 0) >= minRating;
        const matchesStock = !inStockOnly || (Number(product.stock) > 0);

        return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating-desc') return b.rating - a.rating;
        return 0; // 'featured' or default
      });
  }, [products, selectedCategory, debouncedSearchQuery, sortBy, maxPrice, minRating, inStockOnly]);

  const hasActiveFacets = selectedCategory !== 'All' || searchQuery !== '' || sortBy !== 'featured' || maxPrice < 500 || minRating > 0 || inStockOnly;

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
    setMaxPrice(500);
    setMinRating(0);
    setInStockOnly(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-royalty-wine">The Royal Vault</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-royalty-purple mt-1 mb-3">
            Exquisite Curations
          </h2>
          <div className="w-16 h-1 gold-shimmer mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto p-8 bg-white border border-red-200 rounded-3xl shadow-lg">
          <span className="text-5xl mb-4 block">⚠️</span>
          <h2 className="text-xl font-bold text-royalty-wine mb-2">Vault Connection Disrupted</h2>
          <p className="text-slate-600 text-sm mb-6">{error}</p>
          <button 
            onClick={refreshProducts}
            className="bg-royalty-wine hover:bg-royalty-wine-hover text-white text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-full transition-all shadow-sm cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Section Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-royalty-wine/10 border border-royalty-wine/20 text-royalty-wine text-xs font-bold uppercase tracking-widest mb-3">
          <span>👑</span> Sovereign Selection
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-royalty-purple tracking-tight">
          The Vault Collection
        </h2>
        <p className="text-slate-500 text-base max-w-2xl mx-auto mt-3 font-medium">
          Handcrafted luxury and premium essentials, curated exclusively for Id10T patrons.
        </p>
        <div className="w-20 h-1 gold-shimmer mx-auto mt-6 rounded-full"></div>
      </div>

      {/* Interactive Controls (Search, Multi-Facet Filters & Sorting) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-royalty-nude-dark shadow-sm mb-12 space-y-6">
        
        {/* Top Row: Search Bar + Sort + Filter Drawer Trigger */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Live Fuzzy Search Bar with Auto-Suggestions */}
          <div className="w-full md:max-w-md">
            <FuzzySearchBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Search royal curations (e.g. Chanel, Essence, Mascara)..."
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            
            {/* Multi-Facet Filter Toggle Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                isFilterDrawerOpen || maxPrice < 500 || minRating > 0 || inStockOnly
                  ? 'bg-royalty-purple text-royalty-yellow border-royalty-yellow shadow-xs'
                  : 'bg-royalty-nude/60 hover:bg-royalty-nude text-royalty-purple border-royalty-nude-dark'
              }`}
            >
              <span>🎛️</span>
              <span>Filters</span>
              {(maxPrice < 500 || minRating > 0 || inStockOnly) && (
                <span className="w-2 h-2 rounded-full bg-royalty-yellow animate-pulse"></span>
              )}
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-royalty-nude/50 border border-royalty-nude-dark text-royalty-purple font-semibold text-xs py-2.5 px-4 rounded-xl outline-none focus:border-royalty-yellow cursor-pointer transition-colors"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
            </div>

          </div>
        </div>

        {/* Feature 5: Expandable Multi-Facet Filter Drawer */}
        {isFilterDrawerOpen && (
          <div className="p-6 bg-royalty-nude/40 border border-royalty-nude-dark rounded-2xl space-y-6 animate-in slide-in-from-top-3 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Max Price Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Max Price
                  </label>
                  <span className="font-black text-xs text-royalty-wine">
                    ${maxPrice} {maxPrice >= 500 && '+'}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="500" 
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-royalty-purple cursor-pointer"
                />
              </div>

              {/* Minimum Rating Threshold */}
              <div className="space-y-2">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  Minimum Rating
                </label>
                <div className="flex gap-2">
                  {[
                    { label: 'All', val: 0 },
                    { label: '★ 4.0+', val: 4.0 },
                    { label: '★ 4.5+', val: 4.5 }
                  ].map(r => (
                    <button
                      key={r.val}
                      onClick={() => setMinRating(r.val)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        minRating === r.val
                          ? 'bg-royalty-purple text-royalty-yellow border-royalty-yellow'
                          : 'bg-white text-slate-600 border-royalty-nude-dark hover:border-slate-400'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* In-Stock Only Toggle */}
              <div className="space-y-2 flex flex-col justify-between">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  Vault Availability
                </label>
                <label className="flex items-center gap-3 cursor-pointer select-none bg-white p-2.5 rounded-xl border border-royalty-nude-dark hover:border-royalty-yellow/60 transition-colors">
                  <input 
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-royalty-wine rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700">In-Stock Only</span>
                </label>
              </div>

            </div>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="pt-2 border-t border-royalty-nude flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2 shrink-0">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-royalty-purple text-royalty-yellow border border-royalty-yellow/50 shadow-sm scale-105'
                  : 'bg-royalty-nude/60 hover:bg-royalty-nude text-slate-600 border border-royalty-nude-dark'
              }`}
            >
              {cat === 'All' ? '⚜️ All Curations' : cat}
            </button>
          ))}
        </div>

        {/* Active Filter Chips & Summary */}
        <div className="flex flex-wrap justify-between items-center gap-3 text-xs text-slate-500 pt-2 font-medium">
          <div className="flex flex-wrap items-center gap-2">
            <span>
              Displaying <strong className="text-royalty-purple font-bold">{filteredProducts.length}</strong> of <strong className="text-royalty-purple font-bold">{total}</strong> pieces
            </span>

            {/* Active Chips */}
            {maxPrice < 500 && (
              <span className="bg-royalty-nude border border-royalty-nude-dark text-royalty-purple px-2 py-0.5 rounded-md font-bold text-[10px]">
                Under ${maxPrice} ✕
              </span>
            )}
            {minRating > 0 && (
              <span className="bg-royalty-nude border border-royalty-nude-dark text-royalty-purple px-2 py-0.5 rounded-md font-bold text-[10px]">
                ★ {minRating}+ ✕
              </span>
            )}
            {inStockOnly && (
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-md font-bold text-[10px]">
                In Stock Only ✕
              </span>
            )}
          </div>

          {hasActiveFacets && (
            <button
              onClick={resetAllFilters}
              className="text-royalty-wine hover:underline font-bold transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>

      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-royalty-nude-dark shadow-sm">
          <span className="text-6xl mb-4 block">🔍</span>
          <h3 className="text-2xl font-bold text-royalty-purple mb-2">No Matching Treasures Found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
            We couldn't find any curations matching your search criteria. Try adjusting your price range or clearing active filters.
          </p>
          <button
            onClick={resetAllFilters}
            className="bg-royalty-wine hover:bg-royalty-wine-hover text-white font-bold py-3 px-8 rounded-full text-xs uppercase tracking-widest shadow-sm transition-all cursor-pointer"
          >
            Show All Curations
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More Pagination Button */}
          {hasMore && selectedCategory === 'All' && !searchQuery && maxPrice === 500 && minRating === 0 && (
            <div className="text-center pt-8">
              <button
                onClick={loadMoreProducts}
                disabled={loadingMore}
                className="bg-white hover:bg-royalty-nude border-2 border-royalty-yellow/70 text-royalty-purple hover:text-royalty-wine font-extrabold py-4 px-10 rounded-full shadow-md hover:shadow-xl uppercase tracking-widest text-xs transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-3"
              >
                {loadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-royalty-purple border-t-transparent rounded-full animate-spin"></div>
                    <span>Unveiling More Treasures...</span>
                  </>
                ) : (
                  <>
                    <span>⚜️ Load More Sovereign Curations</span>
                    <span className="text-royalty-yellow">({products.length} / {total})</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

    </section>
  );
}
