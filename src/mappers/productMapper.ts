import { ProductDTO, ProductModel, UIProduct, ReviewDTO, ReviewModel } from '../types';
import { formatCurrency } from '../utils/formatters';

/**
 * Maps a raw Review DTO to a strictly typed ReviewModel
 */
export function mapReviewDtoToModel(dto?: ReviewDTO): ReviewModel {
  return {
    rating: Number(dto?.rating) || 5,
    comment: dto?.comment || 'Exceptional craftsmanship and provenance.',
    date: dto?.date || new Date().toISOString(),
    reviewerName: dto?.reviewerName || 'Anonymous Connoisseur',
    reviewerEmail: dto?.reviewerEmail || ''
  };
}

/**
 * Maps a raw Product DTO to a normalized ProductModel
 */
export function mapProductDtoToModel(dto: ProductDTO): ProductModel {
  return {
    id: Number(dto.id),
    title: dto.title || 'Untitled Sovereign Artifact',
    description: dto.description || 'Curated exclusively for Id10T Maison de Luxe.',
    category: dto.category || 'luxury',
    price: Math.max(0, Number(dto.price) || 0),
    discountPercentage: Math.max(0, Number(dto.discountPercentage) || 0),
    rating: Math.max(0, Number(dto.rating) || 5),
    stock: Math.max(0, Number(dto.stock) || 0),
    brand: dto.brand || 'Id10T Maison',
    tags: Array.isArray(dto.tags) ? dto.tags : [],
    sku: dto.sku || `ID10T-SKU-${dto.id}`,
    thumbnail: dto.thumbnail || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
    images: Array.isArray(dto.images) && dto.images.length > 0 ? dto.images : [dto.thumbnail || ''],
    reviews: Array.isArray(dto.reviews) ? dto.reviews.map(mapReviewDtoToModel) : [],
    returnPolicy: dto.returnPolicy || '30-Day Royal Vault Guarantee',
    shippingInformation: dto.shippingInformation || 'Complimentary White-Glove Dispatch'
  };
}

/**
 * Maps a ProductModel to a rich UIProduct ViewModel for presentation
 */
export function mapProductModelToUI(model: ProductModel): UIProduct {
  const hasDiscount = model.discountPercentage > 0;
  const isAvailable = model.stock > 0;

  return {
    ...model,
    formattedPrice: formatCurrency(model.price),
    stockStatus: isAvailable ? 'In the Vault' : 'Depleted',
    stockColor: isAvailable ? 'text-emerald-600' : 'text-red-500',
    hasDiscount,
    formattedDiscount: hasDiscount ? `Save ${model.discountPercentage}%` : null,
    displayName: model.title,
    displayBrand: model.brand
  };
}

/**
 * Convenience pipeline to map a raw DTO directly to UIProduct ViewModel
 */
export function mapProductDtoToUI(dto: ProductDTO): UIProduct {
  const model = mapProductDtoToModel(dto);
  return mapProductModelToUI(model);
}
