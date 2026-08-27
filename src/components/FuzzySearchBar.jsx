import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { formatCurrency } from '../utils/formatters';

export default function FuzzySearchBar({ 
  searchQuery, 
  onSearchChange, 
  onSelectSuggestion,
  placeholder = "Search haute fragrances, beauty, crystals..." 
}) {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(searchQuery || '');
  const [suggestions, setSuggestions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [didYouMean, setDidYouMean] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);

  // Sync external search query
  useEffect(() => {
    setInputValue(searchQuery || '');
  }, [searchQuery]);

  // Debounced suggestion fetching
  useEffect(() => {
    if (!inputValue || inputValue.trim().length < 2) {
      setSuggestions([]);
      setBrands([]);
      setDidYouMean(null);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await productService.getSearchSuggestions(inputValue.trim());
        const data = res.data || res;
        setSuggestions(data.suggestions || []);
        setBrands(data.brands || []);
        setDidYouMean(data.didYouMean || null);
        setIsOpen(true);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    onSearchChange(val);
  };

  const handleClear = () => {
    setInputValue('');
    onSearchChange('');
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleSelectProduct = (product) => {
    setIsOpen(false);
    navigate(`/product/${product.id}`);
  };

  const handleApplyDidYouMean = (suggestion) => {
    setInputValue(suggestion);
    onSearchChange(suggestion);
    if (onSelectSuggestion) onSelectSuggestion(suggestion);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        handleSelectProduct(suggestions[selectedIndex]);
      } else if (didYouMean && selectedIndex === -1) {
        // Submit search
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Search Input Container */}
      <div className="relative flex items-center">
        <span className="absolute left-4 text-royalty-yellow pointer-events-none text-base">
          🔍
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0 || didYouMean) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-white/90 backdrop-blur-sm border border-royalty-nude-dark focus:border-royalty-yellow focus:ring-2 focus:ring-royalty-yellow/20 rounded-2xl pl-12 pr-10 py-3 text-sm text-royalty-purple placeholder:text-slate-400 shadow-sm transition-all duration-200 outline-none"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-slate-400 hover:text-royalty-purple p-1 text-xs transition-colors"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Live Suggestions & Typo-Tolerance Dropdown */}
      {isOpen && (suggestions.length > 0 || didYouMean || brands.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-royalty-nude-dark overflow-hidden z-50 animate-fadeIn text-left">
          {/* Did You Mean Typo Suggestion */}
          {didYouMean && (
            <div className="bg-royalty-yellow/10 border-b border-royalty-yellow/20 px-4 py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                Did you mean: <strong className="text-royalty-wine font-serif italic text-sm">{didYouMean}</strong>?
              </span>
              <button
                type="button"
                onClick={() => handleApplyDidYouMean(didYouMean)}
                className="bg-royalty-wine hover:bg-royalty-purple text-royalty-yellow px-3 py-1 rounded-full text-xs font-medium transition-colors"
              >
                Search "{didYouMean}"
              </button>
            </div>
          )}

          {/* Matching Brand Pills */}
          {brands.length > 0 && (
            <div className="px-4 pt-3 pb-2 border-b border-slate-100 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Brands:</span>
              {brands.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleApplyDidYouMean(b)}
                  className="bg-royalty-nude hover:bg-royalty-wine hover:text-royalty-yellow text-royalty-purple text-xs px-2.5 py-1 rounded-lg font-medium transition-all"
                >
                  ⚜️ {b}
                </button>
              ))}
            </div>
          )}

          {/* Suggested Matching Products */}
          {suggestions.length > 0 && (
            <div className="py-2 max-h-72 overflow-y-auto divide-y divide-slate-50">
              <div className="px-4 py-1 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Catalog Curations ({suggestions.length})
              </div>
              {suggestions.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProduct(p)}
                  className={`px-4 py-2.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    idx === selectedIndex ? 'bg-royalty-yellow/15' : 'hover:bg-royalty-nude/60'
                  }`}
                >
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="w-10 h-10 object-cover rounded-lg border border-slate-100 bg-white shadow-xs"
                  />
                  <div className="flex-grow min-w-0">
                    <h4 className="text-xs font-semibold text-slate-800 truncate font-serif">
                      {p.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{p.brand || 'Maison de Luxe'}</span>
                      <span>•</span>
                      <span className="capitalize">{p.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-royalty-wine font-mono">
                      {formatCurrency(p.price)}
                    </span>
                    <div className="text-[10px] text-amber-500 font-medium">
                      ★ {p.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer note */}
          <div className="bg-slate-50 px-4 py-2 text-[11px] text-slate-400 text-right flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400">⚡ Typo-Tolerant Sovereign Engine</span>
            <span>Press <kbd className="bg-white border rounded px-1 text-[9px] font-mono">Enter</kbd> to inspect</span>
          </div>
        </div>
      )}
    </div>
  );
}
