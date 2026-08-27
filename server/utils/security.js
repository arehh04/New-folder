import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'royal_vault_sovereign_secret_key_2026';

/**
 * Hash a plain password using bcrypt with salt rounds
 * @param {string} plainPassword 
 * @returns {Promise<string>} Password hash
 */
export async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

/**
 * Compare plain password against hash
 * @param {string} plainPassword 
 * @param {string} passwordHash 
 * @returns {Promise<boolean>} True if match
 */
export async function comparePassword(plainPassword, passwordHash) {
  if (!passwordHash) return false;
  return bcrypt.compare(plainPassword, passwordHash);
}

/**
 * Generate a signed JWT token
 * @param {Object} payload 
 * @returns {string} Signed JWT token
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify and decode a JWT token
 * @param {string} token 
 * @returns {Object|null} Decoded payload or null
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
