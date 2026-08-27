import { useState, useEffect } from 'react';
import { productBusiness } from '../business/productBusiness';

/**
 * Custom hook to manage fetching and formatting a single product
 * @param {string|number} id - Product ID to fetch
 * @returns {Object} { product, loading, error }
 */
export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
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
      .catch(err => {
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
