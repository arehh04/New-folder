/**
 * Production-Grade Bloom Filter Implementation
 * Probabilistic data structure for fast O(k) set membership testing
 * Prevents Cache Penetration attacks on non-existent database queries
 */
export class BloomFilter {
  /**
   * @param {number} size - Number of bits in the bit array (default: 4096)
   */
  constructor(size = 4096) {
    this.size = size;
    // Uint8Array where each byte holds 8 bits
    this.bitArray = new Uint8Array(Math.ceil(size / 8));
  }

  /**
   * Hash Function 1: FNV-1a 32-bit
   */
  _fnv1a(str) {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash) % this.size;
  }

  /**
   * Hash Function 2: DJB2
   */
  _djb2(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % this.size;
  }

  /**
   * Hash Function 3: SDBM
   */
  _sdbm(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
      hash |= 0;
    }
    return Math.abs(hash) % this.size;
  }

  /**
   * Get the 3 bit indices for a given item
   */
  _getIndices(item) {
    const key = String(item).toLowerCase().trim();
    return [
      this._fnv1a(key),
      this._djb2(key),
      this._sdbm(key)
    ];
  }

  /**
   * Add an item to the Bloom Filter
   * @param {string|number} item 
   */
  add(item) {
    const indices = this._getIndices(item);
    for (const idx of indices) {
      const byteIdx = Math.floor(idx / 8);
      const bitOffset = idx % 8;
      this.bitArray[byteIdx] |= (1 << bitOffset);
    }
  }

  /**
   * Test whether an item might exist in the set
   * If false: The item DEFINITELY does NOT exist (100% certainty).
   * If true: The item PROBABLY exists (with small false-positive probability).
   * @param {string|number} item 
   * @returns {boolean}
   */
  has(item) {
    const indices = this._getIndices(item);
    for (const idx of indices) {
      const byteIdx = Math.floor(idx / 8);
      const bitOffset = idx % 8;
      if ((this.bitArray[byteIdx] & (1 << bitOffset)) === 0) {
        return false; // Definitely not present
      }
    }
    return true; // Likely present
  }
}

// Global Singleton Bloom Filters
export const productBloomFilter = new BloomFilter(8192);
export const usernameBloomFilter = new BloomFilter(4096);
