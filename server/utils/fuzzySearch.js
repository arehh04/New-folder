/**
 * FUZZY SEARCH & TYPO-TOLERANT MATCHING ENGINE
 * Provides Levenshtein distance, N-gram token matching, and "Did You Mean?" corrections.
 */

/**
 * Compute the Levenshtein edit distance between two strings
 * @param {string} a 
 * @param {string} b 
 * @returns {number}
 */
export function levenshteinDistance(a, b) {
  if (!a || !b) return (a || b || '').length;
  const s1 = a.toLowerCase();
  const s2 = b.toLowerCase();

  const matrix = Array.from({ length: s1.length + 1 }, () => 
    new Array(s2.length + 1).fill(0)
  );

  for (let i = 0; i <= s1.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= s2.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[s1.length][s2.length];
}

/**
 * Calculate similarity ratio between 0.0 and 1.0 based on Levenshtein distance
 */
export function stringSimilarity(a, b) {
  if (!a || !b) return 0;
  const s1 = a.toLowerCase();
  const s2 = b.toLowerCase();
  if (s1 === s2) return 1.0;

  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1.0;

  const distance = levenshteinDistance(s1, s2);
  return Math.max(0, (maxLen - distance) / maxLen);
}

/**
 * Compute fuzzy relevance score of a query against a product object
 * @param {string} query 
 * @param {Object} product 
 * @returns {number} Score between 0 and 100
 */
export function computeProductRelevance(query, product) {
  if (!query || typeof query !== 'string') return 0;
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const title = (product.title || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const category = (product.category || '').toLowerCase();
  const description = (product.description || '').toLowerCase();

  // 1. Exact Substring Match (Highest Priority)
  if (title.includes(q)) return 100;
  if (brand.includes(q)) return 95;
  if (category.includes(q)) return 85;
  if (description.includes(q)) return 70;

  // 2. Tokenized Fuzzy Word Matching
  const queryTokens = q.split(/\s+/).filter(Boolean);
  const targetWords = `${title} ${brand} ${category}`.split(/\s+/).filter(Boolean);

  let totalTokenScore = 0;
  for (const qToken of queryTokens) {
    let bestWordSimilarity = 0;
    for (const tWord of targetWords) {
      // Direct prefix match bonus
      if (tWord.startsWith(qToken) || qToken.startsWith(tWord)) {
        bestWordSimilarity = Math.max(bestWordSimilarity, 0.9);
      } else {
        const dist = levenshteinDistance(qToken, tWord);
        // If within 1-2 edit distance (e.g. "diro" vs "dior", "chanell" vs "chanel")
        if (dist <= 2 && Math.abs(qToken.length - tWord.length) <= 2) {
          const sim = Math.max(0.65, stringSimilarity(qToken, tWord));
          bestWordSimilarity = Math.max(bestWordSimilarity, sim);
        } else {
          const sim = stringSimilarity(qToken, tWord);
          bestWordSimilarity = Math.max(bestWordSimilarity, sim);
        }
      }
    }
    totalTokenScore += bestWordSimilarity;
  }

  const avgTokenScore = queryTokens.length > 0 ? (totalTokenScore / queryTokens.length) : 0;
  return avgTokenScore >= 0.50 ? Math.round(avgTokenScore * 80) : 0;
}

/**
 * Find "Did you mean?" typo suggestion from the product dictionary
 * @param {string} query 
 * @param {Array<Object>} products 
 * @returns {string|null}
 */
export function getDidYouMeanSuggestion(query, products) {
  if (!query || typeof query !== 'string' || query.trim().length < 3) return null;
  const q = query.toLowerCase().trim();

  // If exact substring match exists in any product title/brand, no suggestion needed
  const exactMatchExists = products.some(p => 
    (p.title && p.title.toLowerCase().includes(q)) || 
    (p.brand && p.brand.toLowerCase().includes(q)) ||
    (p.category && p.category.toLowerCase().includes(q))
  );
  if (exactMatchExists) return null;

  // Collect candidate dictionary words (Brands, Categories, Unique Title Words)
  const dictionary = new Set();
  for (const p of products) {
    if (p.brand) dictionary.add(p.brand);
    if (p.category) dictionary.add(p.category);
    if (p.title) {
      p.title.split(/\s+/).forEach(word => {
        if (word.length >= 3) dictionary.add(word);
      });
    }
  }

  let bestSuggestion = null;
  let highestSimilarity = 0;

  for (const word of dictionary) {
    const dist = levenshteinDistance(q, word);
    const sim = stringSimilarity(q, word);

    // If edit distance <= 2, boost candidate consideration
    if ((dist <= 2 || sim >= 0.60) && sim > highestSimilarity) {
      highestSimilarity = sim;
      bestSuggestion = word;
    }
  }

  return bestSuggestion;
}
