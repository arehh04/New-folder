import { useState, useEffect, useCallback } from 'react';
import { productBusiness } from '../business/productBusiness';

/**
 * Custom hook to manage fetching, filtering, and paginating products
 */
export function useProducts(initialLimit = 8) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);

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
    } catch (err) {
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

  const addProductLocally = useCallback((newProduct) => {
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
