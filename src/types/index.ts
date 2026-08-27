/**
 * Centralized TypeScript Domain Types & Interfaces
 * Id10T Maison de Luxe
 */

// ==========================================
// 1. Product & Catalog Models
// ==========================================

export interface ReviewDTO {
  rating?: number;
  comment?: string;
  date?: string;
  reviewerName?: string;
  reviewerEmail?: string;
}

export interface ReviewModel {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDTO {
  id: number | string;
  title: string;
  description: string;
  category: string;
  price: number | string;
  discountPercentage?: number | string;
  rating?: number | string;
  stock?: number | string;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ReviewDTO[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: {
    createdAt?: string;
    updatedAt?: string;
    barcode?: string;
    qrCode?: string;
  };
  images?: string[];
  thumbnail?: string;
}

export interface ProductModel {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  tags: string[];
  sku: string;
  thumbnail: string;
  images: string[];
  reviews: ReviewModel[];
  returnPolicy: string;
  shippingInformation: string;
}

export interface UIProduct extends ProductModel {
  formattedPrice: string;
  stockStatus: 'In the Vault' | 'Depleted';
  stockColor: string;
  hasDiscount: boolean;
  formattedDiscount: string | null;
  displayName: string;
  displayBrand: string;
}

// ==========================================
// 2. User & Authentication Models
// ==========================================

export type UserRole = 'patron' | 'admin';

export interface UserDTO {
  id: number;
  username: string;
  email?: string;
  role?: string;
  fullName?: string;
  avatar?: string;
}

export interface UserModel {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  avatar: string;
}

export interface AuthSession {
  user: UserModel;
  isAuthenticated: boolean;
}

// ==========================================
// 3. Cart & Order Models
// ==========================================

export interface CartItem extends UIProduct {
  quantity: number;
}

export interface OrderItemDTO {
  id: number | string;
  title?: string;
  price: number | string;
  quantity: number | string;
  thumbnail?: string;
}

export interface OrderItemModel {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

export interface OrderCustomerDTO {
  fullName?: string;
  email?: string;
}

export interface OrderShippingAddressDTO {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export type OrderStatus = 
  | 'Vault Consignment Placed' 
  | 'Curator Inspection' 
  | 'In Transit' 
  | 'Delivered to Estate';

export interface OrderDTO {
  orderId: string;
  userId?: number | null;
  customer?: OrderCustomerDTO;
  shippingAddress?: OrderShippingAddressDTO;
  deliveryMethod?: string;
  paymentMethod?: string;
  items: OrderItemDTO[];
  subtotal: number | string;
  discount?: number | string;
  total: number | string;
  status?: string;
  createdAt?: string;
}

export interface OrderModel {
  orderId: string;
  userId: number | null;
  customer: {
    fullName: string;
    email: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  deliveryMethod: string;
  paymentMethod: string;
  items: OrderItemModel[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  formattedSubtotal: string;
  formattedDiscount: string;
  formattedTotal: string;
  formattedDate: string;
}

// ==========================================
// 4. Analytics & API Envelope Types
// ==========================================

export interface CategoryDistribution {
  category: string;
  revenue: number;
  percentage: number;
  formattedRevenue: string;
}

export interface TopSellingArtifact {
  title: string;
  unitsSold: number;
  revenue: number;
  formattedRevenue: string;
}

export interface SalesVelocityMetrics {
  totalInventoryValuation: number;
  formattedValuation: string;
  totalVaultUnits: number;
  distinctArtifactCount: number;
  categoryDistribution: CategoryDistribution[];
  topSellingArtifacts: TopSellingArtifact[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
}
