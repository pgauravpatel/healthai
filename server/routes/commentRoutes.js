import express from 'express';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike
} from '../controllers/commentController.js';
import { protect } from '../middlewares/auth.js';
import { validate, commentSchema } from '../middlewares/validate.js';

const router = express.Router();

// Public routes
router.get('/:blogId', getComments);

// Protected routes
router.post('/:blogId', protect, validate(commentSchema), createComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, toggleCommentLike);

export default router;

