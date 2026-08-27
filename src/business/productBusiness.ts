import { productService, ProductQueryParams } from '../services/productService';
import { mapProductDtoToUI, mapProductDtoToModel } from '../mappers';
import { UIProduct, ProductDTO } from '../types';

export interface FormattedProductsResult {
  products: UIProduct[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Transforms a raw product DTO into a UI-ready model using Model Mapper
 */
export const transformProductForUI = (product?: ProductDTO | null): UIProduct | null => {
  if (!product) return null;
  return mapProductDtoToUI(product);
};

export const productBusiness = {
  /**
   * Fetches all products and formats them for the UI via Model Mapper
   */
  getFormattedProducts: async (params: ProductQueryParams = {}): Promise<FormattedProductsResult> => {
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
  getFormattedProductById: async (id: string | number): Promise<UIProduct> => {
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
  createProduct: async (productData: Partial<ProductDTO>): Promise<UIProduct> => {
    try {
      const normalizedData = mapProductDtoToModel(productData as ProductDTO);
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
  updateProduct: async (id: string | number, updateData: Partial<ProductDTO>): Promise<UIProduct> => {
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
  deleteProduct: async (id: string | number): Promise<{ message: string; id: string | number }> => {
    try {
      return await productService.deleteProduct(id);
    } catch (error) {
      console.error("Business Layer Error (deleteProduct):", error);
      throw error;
    }
  }
};

export default productBusiness;
