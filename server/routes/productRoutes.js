import { Router } from 'express';
import { memoryDb } from '../config/db.js';
import { redisCache } from '../config/redis.js';
import { productBloomFilter } from '../utils/bloomFilter.js';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/authMiddleware.js';
import { sanitizeProduct } from '../utils/sanitizer.js';
import { computeProductRelevance, getDidYouMeanSuggestion } from '../utils/fuzzySearch.js';
import { ApiResponse } from '../utils/apiResponse.js';

const router = Router();

// GET /api/products/search/suggestions (Live Autocomplete & Did-You-Mean)
router.get('/search/suggestions', (req, res) => {
  const { q } = req.query;
  if (!q || typeof q !== 'string' || q.trim().length === 0) {
    return ApiResponse.success(res, { suggestions: [], brands: [], didYouMean: null });
  }

  const query = q.trim();
  const didYouMean = getDidYouMeanSuggestion(query, memoryDb.products);

  // Score products
  const scored = memoryDb.products
    .map(p => ({
      product: sanitizeProduct(p),
      score: computeProductRelevance(query, p)
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.product);

  // Extract matching brand candidates
  const matchingBrands = Array.from(new Set(
    memoryDb.products
      .filter(p => p.brand && computeProductRelevance(query, { title: '', brand: p.brand }) > 0)
      .map(p => p.brand)
  )).slice(0, 3);

  return ApiResponse.success(res, {
    suggestions: scored,
    brands: matchingBrands,
    didYouMean
  }, 'Search suggestions harvested');
});

// GET /api/products (Public cached catalog with Fuzzy Ranking)
router.get('/', async (req, res) => {
  const { search, category, sortBy, limit = 12, skip = 0, fuzzy = 'true' } = req.query;
  const cacheKey = `public:catalog:${search || ''}:${category || 'all'}:${sortBy || 'default'}:${limit}:${skip}:${fuzzy}`;

  // 1. Check Redis Cache
  const cached = await redisCache.get(cacheKey);
  if (cached) {
    res.setHeader('X-Cache-Status', 'HIT');
    return res.json(JSON.parse(cached));
  }

  // 2. Query Database / Store
  let result = [...memoryDb.products];
  let didYouMean = null;

  // Category filter
  if (typeof category === 'string' && category !== 'All') {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Search filter (with Fuzzy Ranking)
  if (typeof search === 'string' && search.trim() !== '') {
    const q = search.trim();
    didYouMean = getDidYouMeanSuggestion(q, memoryDb.products);

    if (fuzzy === 'true') {
      result = result
        .map(p => ({
          product: p,
          relevance: computeProductRelevance(q, p)
        }))
        .filter(item => item.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
        .map(item => item.product);
    } else {
      const lower = q.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        (p.brand && p.brand.toLowerCase().includes(lower))
      );
    }
  }

  // Sorting
  if (sortBy === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating-desc') {
    result.sort((a, b) => b.rating - a.rating);
  }

  const total = result.length;
  const paginated = result.slice(Number(skip), Number(skip) + Number(limit)).map(sanitizeProduct);

  const responsePayload = {
    products: paginated,
    total,
    skip: Number(skip),
    limit: Number(limit),
    didYouMean,
    data: {
      items: paginated,
      total,
      skip: Number(skip),
      limit: Number(limit),
      didYouMean
    }
  };

  // 3. Set Redis Cache with 5 minute TTL
  await redisCache.set(cacheKey, responsePayload, 300);
  res.setHeader('X-Cache-Status', 'MISS');

  res.json(responsePayload);
});

// GET /api/products/:id (Bloom Filter Guarded Lookup)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const productId = Number(id);

  // 1. Probabilistic Bloom Filter pre-check O(1)
  if (!productBloomFilter.has(productId)) {
    return res.status(404).json({
      bloomProtected: true,
      message: `Artifact #${id} does not exist in the royal registry (Bloom Filter Guard)`,
      error: {
        code: 'BLOOM_NOT_FOUND',
        details: 'Probabilistic filter prevented database lookup'
      }
    });
  }

  // 2. Query Redis Cache
  const cacheKey = `public:product:${productId}`;
  const cached = await redisCache.get(cacheKey);
  if (cached) {
    res.setHeader('X-Cache-Status', 'HIT');
    return res.json(JSON.parse(cached));
  }

  // 3. Query Database / Memory Store
  const product = memoryDb.products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({
      message: `Artifact #${id} was not found in the royal vault`,
      error: { code: 'PRODUCT_NOT_FOUND' }
    });
  }

  const sanitized = sanitizeProduct(product);
  const responsePayload = {
    ...sanitized,
    data: sanitized
  };

  // 4. Set Redis Cache with 10 minute TTL
  await redisCache.set(cacheKey, responsePayload, 600);
  res.setHeader('X-Cache-Status', 'MISS');

  res.json(responsePayload);
});

// POST /api/products (Admin Only: Enshrine new artifact)
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
  const { title, description, price, category, brand, stock = 10, thumbnail, images } = req.body;

  if (!title || !price || !category) {
    return ApiResponse.error(res, 'Title, price, and category are required to enshrine an artifact', 400, 'MISSING_ARTIFACT_FIELDS');
  }

  const newId = memoryDb.products.length > 0
    ? Math.max(...memoryDb.products.map(p => p.id)) + 1
    : 1;

  const newProduct = {
    id: newId,
    title,
    description: description || 'Exclusive royal artifact from the private collection.',
    price: Number(Number(price).toFixed(2)),
    discountPercentage: 0,
    rating: 5.0,
    stock: Number(stock),
    brand: brand || 'Id10T Maison',
    category,
    thumbnail: thumbnail || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
    images: images || [thumbnail || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80'],
    reviews: []
  };

  memoryDb.products.unshift(newProduct);
  productBloomFilter.add(newId);

  // Invalidate public catalog cache in Redis
  await redisCache.flushPattern('public:catalog:*');

  res.status(201).json({
    message: 'Artifact Enshrined in Royal Catalog',
    product: sanitizeProduct(newProduct),
    data: sanitizeProduct(newProduct)
  });
});

// PUT /api/products/:id (Admin Only: Update artifact)
router.put('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const productId = Number(id);

  const index = memoryDb.products.findIndex(p => p.id === productId);
  if (index === -1) {
    return ApiResponse.error(res, 'Artifact not found for modification', 404, 'PRODUCT_NOT_FOUND');
  }

  const existing = memoryDb.products[index];
  const updated = {
    ...existing,
    ...req.body,
    id: productId, // Immutable primary key
    price: req.body.price !== undefined ? Number(Number(req.body.price).toFixed(2)) : existing.price,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock
  };

  memoryDb.products[index] = updated;

  // Invalidate Redis caches
  await redisCache.del(`public:product:${productId}`);
  await redisCache.flushPattern('public:catalog:*');

  res.json({
    message: 'Artifact curation updated successfully',
    product: sanitizeProduct(updated),
    data: sanitizeProduct(updated)
  });
});

// DELETE /api/products/:id (Admin Only: Retire artifact)
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const productId = Number(id);

  const index = memoryDb.products.findIndex(p => p.id === productId);
  if (index === -1) {
    return ApiResponse.error(res, 'Artifact not found for retirement', 404, 'PRODUCT_NOT_FOUND');
  }

  const [removed] = memoryDb.products.splice(index, 1);

  // Invalidate caches
  await redisCache.del(`public:product:${productId}`);
  await redisCache.flushPattern('public:catalog:*');

  res.json({
    message: `Artifact #${id} retired from royal vault`,
    product: sanitizeProduct(removed)
  });
});

// POST /api/products/:id/reviews (Add customer review)
router.post('/:id/reviews', optionalAuth, async (req, res) => {
  const { id } = req.params;
  const productId = Number(id);
  const { rating, comment, reviewerName } = req.body;

  const product = memoryDb.products.find(p => p.id === productId);
  if (!product) {
    return ApiResponse.error(res, 'Artifact not found to append review', 404, 'PRODUCT_NOT_FOUND');
  }

  if (!rating || Number(rating) < 1 || Number(rating) > 5) {
    return ApiResponse.error(res, 'A rating between 1 and 5 is required', 400, 'INVALID_RATING');
  }

  const newReview = {
    rating: Number(rating),
    comment: typeof comment === 'string' ? comment.trim() : 'Exquisite craftsmanship.',
    date: new Date().toISOString(),
    reviewerName: (req.user ? `${req.user.firstName || req.user.username}` : (reviewerName || 'Anonymous Connoisseur')),
    reviewerEmail: req.user?.email || 'patron@royalvault.com'
  };

  if (!product.reviews) product.reviews = [];
  product.reviews.unshift(newReview);

  // Recalculate average rating
  const avg = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
  product.rating = Number(avg.toFixed(1));

  // Invalidate Redis product cache
  await redisCache.del(`public:product:${productId}`);
  await redisCache.flushPattern('public:catalog:*');

  res.status(201).json({
    message: 'Patron review affixed to artifact',
    review: newReview,
    newRating: product.rating,
    data: {
      review: newReview,
      newRating: product.rating
    }
  });
});

export default router;
