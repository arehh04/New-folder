import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  firstName: { type: String, default: 'Sovereign' },
  lastName: { type: String, default: 'Patron' },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'patron'], default: 'patron' },
  image: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
