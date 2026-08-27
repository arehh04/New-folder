import { useState, useEffect, useCallback } from 'react';
import { productBusiness } from '../business/productBusiness';
import { UIProduct } from '../types';

export interface UseProductsResult {
  products: UIProduct[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
  loadMoreProducts: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  addProductLocally: (newProduct: UIProduct) => void;
}

/**
 * Custom TypeScript hook to manage fetching, filtering, and paginating products
 */
export function useProducts(initialLimit: number = 12): UseProductsResult {
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [skip, setSkip] = useState<number>(0);

  const fetchInitialProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productBusiness.getFormattedProducts({
        limit: initialLimit,
        skip: 0
      });
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setSkip(data.products?.length || 0);
    } catch (err: any) {
      console.error("useProducts hook error:", err);
      setError(err.message || 'Failed to fetch sovereign products');
    } finally {
      setLoading(false);
    }
  }, [initialLimit]);

  useEffect(() => {
    fetchInitialProducts();
  }, [fetchInitialProducts]);

  const loadMoreProducts = useCallback(async () => {
    if (loadingMore || products.length >= total) return;

    setLoadingMore(true);
    try {
      const data = await productBusiness.getFormattedProducts({
        limit: initialLimit,
        skip: skip
      });

      if (data.products && data.products.length > 0) {
        setProducts(prev => [...prev, ...data.products]);
        setSkip(prev => prev + data.products.length);
      }
    } catch (err) {
      console.error("loadMore error:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, products.length, total, initialLimit, skip]);

  const addProductLocally = useCallback((newProduct: UIProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    setTotal(prev => prev + 1);
  }, []);

  return {
    products,
    loading,
    loadingMore,
    error,
    total,
    hasMore: products.length < total,
    loadMoreProducts,
    refreshProducts: fetchInitialProducts,
    addProductLocally
  };
}

export default useProducts;
