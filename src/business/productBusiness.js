import { productService } from '../services/productService';
import { mapProductDtoToUI, mapProductModelToUI, mapProductDtoToModel } from '../mappers';

/**
 * Transforms a raw product DTO into a UI-ready model using Model Mapper
 */
export const transformProductForUI = (product) => {
  if (!product) return null;
  return mapProductDtoToUI(product);
};

export const productBusiness = {
  /**
   * Fetches all products and formats them for the UI via Model Mapper
   */
  getFormattedProducts: async (params = {}) => {
    try {
      const data = await productService.getProducts(params);
      return {
        products: (data.products || []).map(mapProductDtoToUI),
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
   * Fetches a single product and formats it for the UI via Model Mapper
   */
  getFormattedProductById: async (id) => {
    try {
      const data = await productService.getProductById(id);
      return mapProductDtoToUI(data);
    } catch (error) {
      console.error("Business Layer Error (getFormattedProductById):", error);
      throw error;
    }
  },

  /**
   * Creates a new product with Model Mapper normalization
   */
  createProduct: async (productData) => {
    try {
      const normalizedData = mapProductDtoToModel(productData);
      const data = await productService.createProduct(normalizedData);
      return mapProductDtoToUI(data);
    } catch (error) {
      console.error("Business Layer Error (createProduct):", error);
      throw error;
    }
  },

  /**
   * Updates an existing product
   */
  updateProduct: async (id, updateData) => {
    try {
      const data = await productService.updateProduct(id, updateData);
      return mapProductDtoToUI(data);
    } catch (error) {
      console.error("Business Layer Error (updateProduct):", error);
      throw error;
    }
  },

  /**
   * Deletes a product from the vault
   */
  deleteProduct: async (id) => {
    try {
      return await productService.deleteProduct(id);
    } catch (error) {
      console.error("Business Layer Error (deleteProduct):", error);
      throw error;
    }
  }
};
