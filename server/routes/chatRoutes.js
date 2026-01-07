import express from 'express';
import {
  sendMessage,
  getChats,
  getChat,
  deleteChat,
  clearAllChats,
  createNewChat
} from '../controllers/chatController.js';
import { protect } from '../middlewares/auth.js';
import { validate, chatMessageSchema } from '../middlewares/validate.js';
import { aiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// All chat routes are protected
router.use(protect);

// Chat routes
router.post('/', aiLimiter, validate(chatMessageSchema), sendMessage);
router.get('/', getChats);
router.post('/new', createNewChat);
router.delete('/clear', clearAllChats);
router.get('/:id', getChat);
router.delete('/:id', deleteChat);

export default router;

