import { OrderDTO, OrderModel, OrderItemDTO, OrderItemModel, OrderStatus } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

const VALID_STATUSES: OrderStatus[] = [
  'Vault Consignment Placed',
  'Curator Inspection',
  'In Transit',
  'Delivered to Estate'
];

/**
 * Maps a raw OrderItem DTO to an OrderItemModel
 */
export function mapOrderItemDtoToModel(dto: OrderItemDTO): OrderItemModel {
  return {
    id: Number(dto.id),
    title: dto.title || 'Curated Artifact',
    price: Math.max(0, Number(dto.price) || 0),
    quantity: Math.max(1, Number(dto.quantity) || 1),
    thumbnail: dto.thumbnail || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&q=80'
  };
}

/**
 * Maps an Order DTO to a normalized, formatted OrderModel
 */
export function mapOrderDtoToModel(dto: OrderDTO): OrderModel {
  const subtotal = Math.max(0, Number(dto.subtotal) || 0);
  const discount = Math.max(0, Number(dto.discount) || 0);
  const total = Math.max(0, Number(dto.total) || 0);
  
  const status: OrderStatus = VALID_STATUSES.includes(dto.status as OrderStatus) 
    ? (dto.status as OrderStatus) 
    : 'Vault Consignment Placed';

  return {
    orderId: dto.orderId || `ROYAL-${Math.floor(100000 + Math.random() * 900000)}`,
    userId: dto.userId ?? null,
    customer: {
      fullName: dto.customer?.fullName || 'Anonymous Patron',
      email: dto.customer?.email || 'patron@royalvault.com'
    },
    shippingAddress: {
      street: dto.shippingAddress?.street || '100 Sovereign Boulevard',
      city: dto.shippingAddress?.city || 'London',
      postalCode: dto.shippingAddress?.postalCode || 'SW1A 1AA',
      country: dto.shippingAddress?.country || 'United Kingdom'
    },
    deliveryMethod: dto.deliveryMethod || 'Complimentary Royal Dispatch',
    paymentMethod: dto.paymentMethod || 'Vault-Encrypted Card',
    items: Array.isArray(dto.items) ? dto.items.map(mapOrderItemDtoToModel) : [],
    subtotal,
    discount,
    total,
    status,
    createdAt: dto.createdAt || new Date().toISOString(),
    formattedSubtotal: formatCurrency(subtotal),
    formattedDiscount: formatCurrency(discount),
    formattedTotal: formatCurrency(total),
    formattedDate: formatDate(dto.createdAt || new Date().toISOString())
  };
}
