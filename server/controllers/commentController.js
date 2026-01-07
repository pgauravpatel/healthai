import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * @desc    Get comments for a blog
 * @route   GET /api/comments/:blogId
 * @access  Public
 */
export const getComments = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  // Verify blog exists
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get top-level comments (no parent)
  const [comments, total] = await Promise.all([
    Comment.find({ 
      blog: blogId, 
      parentComment: null,
      isDeleted: false 
    })
      .populate('author', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit)),
    Comment.countDocuments({ 
      blog: blogId, 
      parentComment: null,
      isDeleted: false 
    })
  ]);

  // Get replies for each comment
  const commentsWithReplies = await Promise.all(
    comments.map(async (comment) => {
      const replies = await Comment.find({
        parentComment: comment._id,
        isDeleted: false
      })
        .populate('author', 'name avatar')
        .sort('createdAt')
        .limit(5);

      return {
        ...comment.toObject(),
        replies,
        likesCount: comment.likes.length
      };
    })
  );

  res.json({
    success: true,
    comments: commentsWithReplies,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * @desc    Create comment
 * @route   POST /api/comments/:blogId
 * @access  Private
 */
export const createComment = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { content, parentComment } = req.body;

  // Verify blog exists and is published
  const blog = await Blog.findOne({ _id: blogId, isPublished: true });
  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  // If replying, verify parent comment exists
  if (parentComment) {
    const parent = await Comment.findOne({ 
      _id: parentComment, 
      blog: blogId,
      isDeleted: false 
    });
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent comment not found'
      });
    }
  }

  const comment = await Comment.create({
    content,
    blog: blogId,
    author: req.user._id,
    parentComment: parentComment || null
  });

  // Populate author info
  await comment.populate('author', 'name avatar');

  res.status(201).json({
    success: true,
    message: 'Comment added',
    comment: {
      ...comment.toObject(),
      likesCount: 0,
      replies: []
    }
  });
});

/**
 * @desc    Update comment
 * @route   PUT /api/comments/:id
 * @access  Private
 */
export const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  // Check ownership
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to edit this comment'
    });
  }

  comment.content = content;
  comment.isEdited = true;
  await comment.save();

  await comment.populate('author', 'name avatar');

  res.json({
    success: true,
    message: 'Comment updated',
    comment
  });
});

/**
 * @desc    Delete comment
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  // Check ownership or admin
  if (
    comment.author.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this comment'
    });
  }

  // Soft delete
  comment.isDeleted = true;
  comment.content = '[Comment deleted]';
  await comment.save();

  res.json({
    success: true,
    message: 'Comment deleted'
  });
});

/**
 * @desc    Like/Unlike comment
 * @route   POST /api/comments/:id/like
 * @access  Private
 */
export const toggleCommentLike = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment || comment.isDeleted) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  const isLiked = comment.likes.includes(req.user._id);

  if (isLiked) {
    comment.likes = comment.likes.filter(
      id => id.toString() !== req.user._id.toString()
    );
  } else {
    comment.likes.push(req.user._id);
  }

  await comment.save();

  res.json({
    success: true,
    liked: !isLiked,
    likesCount: comment.likes.length
  });
});

