import { useState, useEffect, useRef, FC, ChangeEvent, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { formatCurrency } from '../utils/formatters';
import { ProductDTO } from '../types';

export interface FuzzySearchBarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSelectSuggestion?: (product: ProductDTO) => void;
  placeholder?: string;
}

export const FuzzySearchBar: FC<FuzzySearchBarProps> = ({ 
  searchQuery = '', 
  onSearchChange, 
  onSelectSuggestion,
  placeholder = "Search haute fragrances, beauty, crystals..." 
}) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState<string>(searchQuery || '');
  const [suggestions, setSuggestions] = useState<ProductDTO[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [didYouMean, setDidYouMean] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
        const data = await productService.getSearchSuggestions(inputValue.trim());
        setSuggestions(data.suggestions || []);
        setBrands(data.matchingBrands || []);
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
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    setInputValue(val);
    setSelectedIndex(-1);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectProduct(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelectProduct = (product: ProductDTO): void => {
    setIsOpen(false);
    if (onSelectSuggestion) {
      onSelectSuggestion(product);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const handleSelectCorrection = (correction: string): void => {
    setInputValue(correction);
    if (onSearchChange) onSearchChange(correction);
    setDidYouMean(null);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      {/* Search Input Container */}
      <div className="relative flex items-center">
        <span className="absolute left-4 text-slate-400 pointer-events-none text-base">
          🔍
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={() => {
            if (suggestions.length > 0 || didYouMean || brands.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3.5 bg-white/90 backdrop-blur-md border border-royalty-nude-dark rounded-2xl text-xs sm:text-sm font-medium text-royalty-purple placeholder:text-slate-400 focus:outline-none focus:border-royalty-yellow/80 focus:ring-2 focus:ring-royalty-yellow/20 shadow-xs transition-all"
        />
        {loading && (
          <span className="absolute right-4 w-4 h-4 border-2 border-royalty-yellow border-t-transparent rounded-full animate-spin"></span>
        )}
        {inputValue && !loading && (
          <button
            type="button"
            onClick={() => {
              setInputValue('');
              if (onSearchChange) onSearchChange('');
              setIsOpen(false);
            }}
            className="absolute right-3.5 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 text-xs transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Autocomplete & Typo-Tolerant Suggestions Dropdown */}
      {isOpen && (suggestions.length > 0 || didYouMean || brands.length > 0) && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-xl border border-royalty-nude-dark rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Did You Mean Suggestion Banner */}
          {didYouMean && (
            <div className="p-3.5 bg-royalty-wine/5 border-b border-royalty-wine/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-sm">✨</span>
                <span className="text-slate-600">Did you mean:</span>
                <button
                  type="button"
                  onClick={() => handleSelectCorrection(didYouMean)}
                  className="font-bold text-royalty-wine hover:underline cursor-pointer"
                >
                  "{didYouMean}"?
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleSelectCorrection(didYouMean)}
                className="px-2.5 py-1 bg-royalty-wine text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-xs hover:bg-royalty-wine-hover transition-colors"
              >
                Apply
              </button>
            </div>
          )}

          {/* Matching Brand Pills */}
          {brands.length > 0 && (
            <div className="p-3 border-b border-royalty-nude flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Brands:
              </span>
              {brands.map((b, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectCorrection(b)}
                  className="px-2.5 py-0.5 rounded-full bg-royalty-nude hover:bg-royalty-nude-dark text-royalty-purple text-[11px] font-bold transition-colors cursor-pointer border border-royalty-nude-dark"
                >
                  ⚜️ {b}
                </button>
              ))}
            </div>
          )}

          {/* Matching Product List */}
          {suggestions.length > 0 && (
            <div className="max-h-72 overflow-y-auto divide-y divide-royalty-nude/40">
              {suggestions.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectProduct(item)}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-royalty-nude/80' : 'hover:bg-royalty-nude/40'
                    }`}
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-10 h-10 object-contain rounded-lg bg-royalty-nude/30 p-1 border border-royalty-nude-dark/50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-royalty-purple truncate">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                        {item.brand || item.category}
                      </div>
                    </div>
                    <div className="font-mono text-xs font-black text-royalty-wine shrink-0">
                      {formatCurrency(item.price)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default FuzzySearchBar;
