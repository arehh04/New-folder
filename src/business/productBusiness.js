import { productService } from '../services/productService';
import { formatCurrency } from '../utils/formatters';

/**
 * Transforms a raw product DTO into a UI-ready model
 * @param {Object} product - The raw product data from the API
 * @returns {Object} The formatted product ready for the UI
 */
export const transformProductForUI = (product) => {
  if (!product) return null;
  
  return {
    ...product,
    // Business Logic: Format currency using centralized formatter
    formattedPrice: formatCurrency(product.price),
    
    // Business Logic: Stock status strings and associated UI colors
    stockStatus: Number(product.stock || 0) > 0 ? 'In the Vault' : 'Depleted',
    stockColor: Number(product.stock || 0) > 0 ? 'text-emerald-600' : 'text-red-500',
    
    // Business Logic: Discount messaging
    hasDiscount: Number(product.discountPercentage || 0) > 0,
    formattedDiscount: Number(product.discountPercentage || 0) > 0 
      ? `Save ${product.discountPercentage}%` 
      : null,
      
    // Defaulting missing data
    displayName: product.title || 'Unknown Item',
    displayBrand: product.brand || product.category || 'Id10T Exclusive',
    reviews: product.reviews || []
  };
};

export const productBusiness = {
  /**
   * Fetches all products and formats them for the UI
   */
  getFormattedProducts: async (params = {}) => {
    try {
      const data = await productService.getProducts(params);
      return {
        products: (data.products || []).map(transformProductForUI),
        total: data.total || 0,
        skip: data.skip || 0,
        limit: data.limit || 12
      };
    } catch (error) {
      console.error("Business Layer Error (getFormattedProducts):", error);
      throw error;
    }
  },

  /**
   * Fetches a single product and formats it for the UI
   */
  getFormattedProductById: async (id) => {
    try {
      const data = await productService.getProductById(id);
      return transformProductForUI(data);
    } catch (error) {
      console.error("Business Layer Error (getFormattedProductById):", error);
      throw error;
    }
  },

  /**
   * Updates an existing product in the inventory
   */
  updateProductInventory: async (id, updateData) => {
    try {
      const data = await productService.updateProduct(id, updateData);
      return transformProductForUI(data);
    } catch (error) {
      console.error("Business Layer Error (updateProductInventory):", error);
      throw error;
    }
  },

  /**
   * Retires/Deletes a product from the inventory
   */
  deleteProductFromVault: async (id) => {
    try {
      const data = await productService.deleteProduct(id);
      return {
        success: true,
        id: data.id,
        isDeleted: data.isDeleted || true
      };
    } catch (error) {
      console.error("Business Layer Error (deleteProductFromVault):", error);
      throw error;
    }
  },

  /**
   * Adds a new product to the vault
   */
  addNewProductToVault: async (productData) => {
    try {
      const data = await productService.addProduct(productData);
      return transformProductForUI(data);
    } catch (error) {
      console.error("Business Layer Error (addNewProductToVault):", error);
      throw error;
    }
  },

  /**
   * Submits a patron review for a product
   */
  postProductReview: async (id, reviewData) => {
    try {
      const data = await productService.submitProductReview(id, reviewData);
      return {
        message: data.message,
        review: data.review,
        updatedRating: data.updatedRating,
        reviews: data.reviews
      };
    } catch (error) {
      console.error("Business Layer Error (postProductReview):", error);
      throw error;
    }
  }
};
