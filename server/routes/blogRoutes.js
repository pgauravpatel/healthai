import express from 'express';
import {
  getBlogs,
  getBlog,
  getCategories,
  getTags,
  toggleLike,
  getRelatedBlogs,
  getAdminBlogs,
  getAdminBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublish
} from '../controllers/blogController.js';
import { protect, adminOnly, optionalAuth } from '../middlewares/auth.js';
import { validate, blogSchema, blogUpdateSchema } from '../middlewares/validate.js';

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/categories', getCategories);
router.get('/tags', getTags);
router.get('/:slug', optionalAuth, getBlog);
router.get('/:id/related', getRelatedBlogs);

// Protected routes
router.post('/:id/like', protect, toggleLike);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAdminBlogs);
router.get('/admin/:id', protect, adminOnly, getAdminBlog);
router.post('/admin', protect, adminOnly, validate(blogSchema), createBlog);
router.put('/admin/:id', protect, adminOnly, validate(blogUpdateSchema), updateBlog);
router.delete('/admin/:id', protect, adminOnly, deleteBlog);
router.patch('/admin/:id/publish', protect, adminOnly, togglePublish);

export default router;

