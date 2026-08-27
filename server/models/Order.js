import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  thumbnail: { type: String }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customer: {
    fullName: { type: String, required: true },
    email: { type: String, required: true }
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  deliveryMethod: { type: String, default: 'Complimentary Royal Dispatch' },
  paymentMethod: { type: String, default: 'Vault-Encrypted Card' },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, default: 'Dispatched via Sovereign Courier' },
  estimatedDelivery: { type: String }
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
