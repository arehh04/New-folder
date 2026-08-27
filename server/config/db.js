import mongoose from 'mongoose';
import { initialProducts } from '../data/products.js';
import { productBloomFilter, usernameBloomFilter } from '../utils/bloomFilter.js';
import { hashPassword } from '../utils/security.js';

let isMongoConnected = false;

// In-memory data store cache for fallback
export const memoryDb = {
  products: [...initialProducts],
  users: [],
  orders: []
};

/**
 * Initialize MongoDB connection and seed stores & Bloom Filters
 */
export async function initDatabase() {
  // 1. Seed Bloom Filters immediately
  for (const product of initialProducts) {
    productBloomFilter.add(product.id);
  }

  // Pre-seed default users
  const adminHash = await hashPassword('emilyspass');
  const patronHash = await hashPassword('michaelwpass');

  memoryDb.users = [
    {
      id: 1,
      username: 'emilys',
      passwordHash: adminHash,
      firstName: 'Emily',
      lastName: 'Sterling',
      email: 'emily.sterling@royalvault.com',
      role: 'admin',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      username: 'michaelw',
      passwordHash: patronHash,
      firstName: 'Michael',
      lastName: 'Windsor',
      email: 'michael.windsor@royalvault.com',
      role: 'patron',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    }
  ];

  for (const user of memoryDb.users) {
    usernameBloomFilter.add(user.username);
  }

  console.log('🌸 [BLOOM FILTER] Seeded Bloom Filter with', initialProducts.length, 'product IDs and', memoryDb.users.length, 'usernames');

  // 2. Attempt MongoDB Connection
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/id10t_vault';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 1500
    });
    isMongoConnected = true;
    console.log('🍃 [MONGODB] Connected successfully to MongoDB on', MONGO_URI);
  } catch {
    isMongoConnected = false;
    console.log('🍃 [DATABASE] Running High-Speed In-Memory Document Store (MongoDB Fallback Active)');
  }
}

export function isDbConnected() {
  return isMongoConnected;
}
