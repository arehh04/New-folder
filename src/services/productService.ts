import axiosInstance from '../api/axiosInstance';
import { ProductDTO, ApiResponse } from '../types';

export interface ProductQueryParams {
  search?: string;
  category?: string;
  sortBy?: string;
  limit?: number;
  skip?: number;
  fuzzy?: boolean;
}

export interface ProductsResponse {
  products: ProductDTO[];
  total: number;
  skip: number;
  limit: number;
}

export interface SearchSuggestionsResponse {
  query: string;
  suggestions: ProductDTO[];
  matchingBrands: string[];
  didYouMean: string | null;
}

/**
 * Product API Service Layer (Encapsulated Promise API)
 */
export const productService = {
  /**
   * Fetch all products from the catalog
   */
  getProducts: async (params: ProductQueryParams = {}): Promise<ProductsResponse> => {
    const res = await axiosInstance.get<ProductsResponse>('/products', { params });
    return res.data;
  },

  /**
   * Fetch live autocomplete and typo suggestions
   */
  getSearchSuggestions: async (q: string): Promise<SearchSuggestionsResponse> => {
    const res = await axiosInstance.get<SearchSuggestionsResponse>('/products/search/suggestions', { 
      params: { q } 
    });
    return res.data;
  },

  /**
   * Fetch a single product by ID
   */
  getProductById: async (id: string | number): Promise<ProductDTO> => {
    const res = await axiosInstance.get<ProductDTO>(`/products/${id}`);
    return res.data;
  },

  /**
   * Update an existing product inventory item
   */
  updateProduct: async (id: string | number, updateData: Partial<ProductDTO>): Promise<ProductDTO> => {
    const res = await axiosInstance.put<ProductDTO>(`/products/${id}`, updateData);
    return res.data;
  },

  /**
   * Delete / retire a product from the catalog
   */
  deleteProduct: async (id: string | number): Promise<{ message: string; id: string | number }> => {
    const res = await axiosInstance.delete<{ message: string; id: string | number }>(`/products/${id}`);
    return res.data;
  },

  /**
   * Add a new product to the catalog
   */
  createProduct: async (productData: Partial<ProductDTO>): Promise<ProductDTO> => {
    const res = await axiosInstance.post<ProductDTO>('/products', productData);
    return res.data;
  }
};

export default productService;
