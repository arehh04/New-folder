import { useWishlist as useWishlistContext } from '../context/WishlistContext';

/**
 * Custom hook to consume sovereign wishlist state and callbacks
 */
export function useWishlist() {
  return useWishlistContext();
}

export default useWishlist;
