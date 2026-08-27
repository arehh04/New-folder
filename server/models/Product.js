import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
  reviewerName: { type: String, required: true },
  reviewerEmail: { type: String, default: 'patron@royalvault.com' }
});

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 },
  rating: { type: Number, default: 5 },
  stock: { type: Number, required: true, default: 0 },
  brand: { type: String, default: 'Id10T Maison' },
  thumbnail: { type: String, required: true },
  images: [{ type: String }],
  reviews: [reviewSchema]
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
