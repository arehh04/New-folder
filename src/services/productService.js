import axiosInstance from '../api/axiosInstance';

/**
 * Product Service Layer (Encapsulated Promise API)
 * All API interactions are wrapped into callable functions returning Promises.
 */
export const productService = {
  /**
   * Fetch all products from the catalog
   * @param {Object} params - Query parameters (search, category, sortBy, limit, skip)
   * @returns {Promise<Object>} Response data with products array
   */
  getProducts: async (params = {}) => {
    const res = await axiosInstance.get('/products', { params });
    return res.data;
  },

  /**
   * Fetch live autocomplete and typo suggestions
   * @param {string} q - Search query term
   * @returns {Promise<Object>} Suggestions, brands, and didYouMean
   */
  getSearchSuggestions: async (q) => {
    const res = await axiosInstance.get('/products/search/suggestions', { params: { q } });
    return res.data;
  },

  /**
   * Fetch a single product by ID
   * @param {string|number} id - Product identifier
   * @returns {Promise<Object>} Product details
   */
  getProductById: async (id) => {
    const res = await axiosInstance.get(`/products/${id}`);
    return res.data;
  },

  /**
   * Update an existing product inventory item
   * @param {string|number} id - Product identifier
   * @param {Object} updateData - Updated fields (title, price, stock, etc.)
   * @returns {Promise<Object>} Updated product response
   */
  updateProduct: async (id, updateData) => {
    const res = await axiosInstance.put(`/products/${id}`, updateData);
    return res.data;
  },

  /**
   * Delete / retire a product from the catalog
   * @param {string|number} id - Product identifier
   * @returns {Promise<Object>} Deletion confirmation status
   */
  deleteProduct: async (id) => {
    const res = await axiosInstance.delete(`/products/${id}`);
    return res.data;
  },

  /**
   * Add a new product to the catalog
   * @param {Object} productData - New product payload
   * @returns {Promise<Object>} Created product response
   */
  addProduct: async (productData) => {
    const res = await axiosInstance.post('/products', productData);
    return res.data;
  },

  /**
   * Submit a verified patron review for a product
   * @param {string|number} id - Product identifier
   * @param {Object} reviewData - { rating, comment, reviewerName, reviewerEmail }
   * @returns {Promise<Object>} Review submission response
   */
  submitProductReview: async (id, reviewData) => {
    const res = await axiosInstance.post(`/products/${id}/reviews`, reviewData);
    return res.data;
  }
};
