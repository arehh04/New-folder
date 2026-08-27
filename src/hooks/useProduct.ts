import { useState, useEffect } from 'react';
import { productBusiness } from '../business/productBusiness';
import { UIProduct } from '../types';

export interface UseProductResult {
  product: UIProduct | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to manage fetching and formatting a single product
 */
export function useProduct(id?: string | number): UseProductResult {
  const [product, setProduct] = useState<UIProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    if (!id) {
      setLoading(false);
      return;
    }

    if (id === 'error') {
      throw new Error('This is a simulated render error for testing the Error Boundary.');
    }

    setLoading(true);
    productBusiness.getFormattedProductById(id)
      .then(formattedData => {
        if (isMounted) {
          setProduct(formattedData);
          setLoading(false);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { product, loading, error };
}

export default useProduct;
