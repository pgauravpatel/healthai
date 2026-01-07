import Chat from '../models/Chat.js';
import aiService from '../services/aiService.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * @desc    Send message to AI and get response
 * @route   POST /api/chat
 * @access  Private
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { message, chatId } = req.body;
  const userId = req.user._id;

  let chat;

  // Find existing chat or create new one
  if (chatId) {
    chat = await Chat.findOne({ _id: chatId, userId, isActive: true });
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
  } else {
    // Create new chat
    chat = new Chat({
      userId,
      messages: []
    });
  }

  // Get conversation history (last 10 messages for context)
  const conversationHistory = chat.messages.slice(-10);

  // Generate AI response
  const aiResult = await aiService.generateResponse(message, conversationHistory);

  // Add user message
  chat.messages.push({
    role: 'user',
    content: message
  });

  // Add AI response
  chat.messages.push({
    role: 'assistant',
    content: aiResult.response
  });

  // Save chat
  await chat.save();

  res.json({
    success: true,
    chatId: chat._id,
    message: {
      role: 'assistant',
      content: aiResult.response,
      isEmergency: aiResult.isEmergency
    }
  });
});

/**
 * @desc    Get all chats for user
 * @route   GET /api/chat
 * @access  Private
 */
export const getChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ 
    userId: req.user._id, 
    isActive: true 
  })
    .select('title lastMessageAt createdAt')
    .sort({ lastMessageAt: -1 })
    .limit(50);

  res.json({
    success: true,
    chats
  });
});

/**
 * @desc    Get single chat with messages
 * @route   GET /api/chat/:id
 * @access  Private
 */
export const getChat = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({
    _id: req.params.id,
    userId: req.user._id,
    isActive: true
  });

  if (!chat) {
    return res.status(404).json({
      success: false,
      message: 'Chat not found'
    });
  }

  res.json({
    success: true,
    chat
  });
});

/**
 * @desc    Delete chat
 * @route   DELETE /api/chat/:id
 * @access  Private
 */
export const deleteChat = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!chat) {
    return res.status(404).json({
      success: false,
      message: 'Chat not found'
    });
  }

  // Soft delete
  chat.isActive = false;
  await chat.save();

  res.json({
    success: true,
    message: 'Chat deleted'
  });
});

/**
 * @desc    Clear all chats for user
 * @route   DELETE /api/chat
 * @access  Private
 */
export const clearAllChats = asyncHandler(async (req, res) => {
  await Chat.updateMany(
    { userId: req.user._id },
    { isActive: false }
  );

  res.json({
    success: true,
    message: 'All chats cleared'
  });
});

/**
 * @desc    Create new empty chat
 * @route   POST /api/chat/new
 * @access  Private
 */
export const createNewChat = asyncHandler(async (req, res) => {
  const chat = await Chat.create({
    userId: req.user._id,
    messages: []
  });

  res.status(201).json({
    success: true,
    chat: {
      _id: chat._id,
      title: chat.title,
      createdAt: chat.createdAt
    }
  });
});

