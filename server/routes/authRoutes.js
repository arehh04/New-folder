import { Router } from 'express';
import { memoryDb } from '../config/db.js';
import { hashPassword, comparePassword, generateToken, verifyToken } from '../utils/security.js';
import { usernameBloomFilter } from '../utils/bloomFilter.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { auditLogger } from '../utils/auditLogger.js';
import { ApiResponse } from '../utils/apiResponse.js';

const router = Router();

// Apply Rate Limiter to Auth Endpoints
router.use(authRateLimiter);

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // 1. Strict Type Sanitization against NoSQL Object Injection
  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return ApiResponse.error(res, 'Sovereign credentials must be valid plain text strings', 400, 'INVALID_INPUT_TYPE');
  }

  const cleanUsername = username.trim();
  const cleanPassword = password;

  // 2. Fast Bloom Filter pre-check
  if (!usernameBloomFilter.has(cleanUsername)) {
    auditLogger.log({
      level: 'WARN',
      type: 'AUTH_PROBE_NONEXISTENT_USER',
      message: `Failed authentication probe for non-existent username: "${cleanUsername}" (Caught by Bloom Filter)`,
      req,
      meta: { username: cleanUsername }
    });
    return ApiResponse.error(res, 'Invalid sovereign credentials provided', 401, 'INVALID_CREDENTIALS');
  }

  // 3. Find user in repository (Safe case-insensitive lookup)
  const user = memoryDb.users.find(u => u.username.toLowerCase() === cleanUsername.toLowerCase());
  if (!user) {
    auditLogger.log({
      level: 'WARN',
      type: 'AUTH_USER_NOT_FOUND',
      message: `User lookup failed for username: "${cleanUsername}"`,
      req,
      meta: { username: cleanUsername }
    });
    return ApiResponse.error(res, 'Invalid sovereign credentials provided', 401, 'INVALID_CREDENTIALS');
  }

  // 4. Verify bcrypt password hash
  const isMatch = await comparePassword(cleanPassword, user.passwordHash);
  if (!isMatch) {
    auditLogger.log({
      level: 'ALERT',
      type: 'AUTH_FAILED_PASSWORD',
      message: `Failed password attempt for user: "${cleanUsername}" (ID: ${user.id})`,
      req,
      meta: { username: cleanUsername, userId: user.id }
    });
    return ApiResponse.error(res, 'Invalid sovereign credentials provided (Incorrect passkey)', 401, 'INCORRECT_PASSKEY');
  }

  // 5. Generate signed JWT token
  const token = generateToken({
    id: user.id,
    username: user.username,
    role: user.role
  });

  // 6. Set HTTP-Only Cookie
  res.cookie('royal_session', token, {
    httpOnly: true,
    secure: false, // Set to true in production HTTPS
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days
  });

  // Log successful authentication event to SIEM
  auditLogger.log({
    level: 'INFO',
    type: 'AUTH_LOGIN_SUCCESS',
    message: `Patron "${user.username}" (${user.role}) authenticated successfully.`,
    req,
    meta: { userId: user.id, username: user.username, role: user.role }
  });

  // 7. Return sanitized user profile
  const userPayload = {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    image: user.image,
    accessToken: token
  };

  return res.json({
    ...userPayload,
    success: true,
    data: userPayload
  });
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  // 1. Strict Type Sanitization against NoSQL Object Injection
  if (
    !username || !email || !password ||
    typeof username !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return ApiResponse.error(res, 'Registration fields must be valid plain text strings', 400, 'INVALID_INPUT_TYPE');
  }

  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();

  // 2. Check username collision
  const existingUser = memoryDb.users.find(
    u => u.username.toLowerCase() === cleanUsername.toLowerCase() ||
         u.email.toLowerCase() === cleanEmail
  );

  if (existingUser) {
    auditLogger.log({
      level: 'WARN',
      type: 'REGISTRATION_COLLISION',
      message: `Registration conflict for username: "${cleanUsername}" or email: "${cleanEmail}"`,
      req
    });
    return ApiResponse.error(res, 'Username or email is already registered in the Royal Archives', 409, 'USER_EXISTS');
  }

  // Hash password with bcrypt (10 rounds)
  const passwordHash = await hashPassword(password);
  const newId = memoryDb.users.length + 1;

  const newUser = {
    id: newId,
    username: cleanUsername,
    email: cleanEmail,
    firstName: typeof firstName === 'string' ? firstName.trim() : 'Sovereign',
    lastName: typeof lastName === 'string' ? lastName.trim() : 'Patron',
    role: 'patron',
    passwordHash,
    image: `https://dummyjson.com/icon/${cleanUsername}/128`
  };

  memoryDb.users.push(newUser);
  usernameBloomFilter.add(newUser.username);

  // Generate session token
  const token = generateToken({
    id: newUser.id,
    username: newUser.username,
    role: newUser.role
  });

  res.cookie('royal_session', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  auditLogger.log({
    level: 'INFO',
    type: 'USER_REGISTERED',
    message: `New house registered: "${newUser.username}" (${newUser.email})`,
    req,
    meta: { userId: newUser.id }
  });

  const responseData = {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    role: newUser.role,
    image: newUser.image,
    accessToken: token
  };

  return res.status(201).json({
    ...responseData,
    success: true,
    message: 'Royal House Registered & Enlisted',
    data: responseData
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('royal_session');
  auditLogger.log({
    level: 'INFO',
    type: 'AUTH_LOGOUT',
    message: 'Patron session terminated & cookie cleared',
    req
  });
  return ApiResponse.success(res, null, 'Royal Session Terminated Successfully');
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const token = req.cookies?.royal_session || req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return ApiResponse.error(res, 'No active sovereign session detected', 401, 'NO_SESSION');
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return ApiResponse.error(res, 'Sovereign session token expired or invalid', 401, 'INVALID_TOKEN');
  }

  const user = memoryDb.users.find(u => u.id === decoded.id);
  if (!user) {
    return ApiResponse.error(res, 'User record not found in royal archives', 404, 'USER_NOT_FOUND');
  }

  const userPayload = {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    image: user.image
  };

  return res.json({
    ...userPayload,
    success: true,
    data: userPayload
  });
});

export default router;
