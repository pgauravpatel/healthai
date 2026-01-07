import mongoose from 'mongoose';

/**
 * Message Schema (embedded)
 * Individual message in a chat conversation
 */
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

/**
 * Chat Schema
 * Stores chat conversation history for users
 */
const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Conversation',
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  messages: [messageSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastMessageAt when messages are added
chatSchema.pre('save', function(next) {
  if (this.isModified('messages') && this.messages.length > 0) {
    this.lastMessageAt = new Date();
    
    // Auto-generate title from first user message if still default
    if (this.title === 'New Conversation' && this.messages.length >= 1) {
      const firstUserMessage = this.messages.find(m => m.role === 'user');
      if (firstUserMessage) {
        // Take first 50 characters of user's message as title
        this.title = firstUserMessage.content.substring(0, 50) + 
          (firstUserMessage.content.length > 50 ? '...' : '');
      }
    }
  }
  next();
});

// Index for efficient queries
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ userId: 1, isActive: 1 });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;

