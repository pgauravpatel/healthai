import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  toggleBookmark,
  getBookmarks
} from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { validate, registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from '../middlewares/validate.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Public routes with rate limiting
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);
router.put('/password', protect, validate(changePasswordSchema), changePassword);

// Bookmarks
router.post('/bookmark/:blogId', protect, toggleBookmark);
router.get('/bookmarks', protect, getBookmarks);

export default router;

