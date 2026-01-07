import Blog from '../models/Blog.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * @desc    Get all published blogs
 * @route   GET /api/blogs
 * @access  Public
 */
export const getBlogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    tag,
    search,
    sort = '-publishedAt'
  } = req.query;

  const query = { isPublished: true };

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by tag
  if (tag) {
    query.tags = { $in: [tag.toLowerCase()] };
  }

  // Search in title and content
  if (search) {
    query.$text = { $search: search };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .populate('author', 'name avatar')
      .select('-content')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    Blog.countDocuments(query)
  ]);

  res.json({
    success: true,
    blogs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * @desc    Get single blog by slug
 * @route   GET /api/blogs/:slug
 * @access  Public
 */
export const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ 
    slug: req.params.slug,
    isPublished: true 
  }).populate('author', 'name avatar bio');

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  // Increment views
  blog.views += 1;
  await blog.save();

  // Check if user has liked/bookmarked (if authenticated)
  let userInteraction = { liked: false, bookmarked: false };
  
  if (req.user) {
    userInteraction.liked = blog.likes.includes(req.user._id);
    // Bookmarked status comes from user model
  }

  res.json({
    success: true,
    blog,
    userInteraction
  });
});

/**
 * @desc    Get blog categories with counts
 * @route   GET /api/blogs/categories
 * @access  Public
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Blog.aggregate([
    { $match: { isPublished: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.json({
    success: true,
    categories: categories.map(c => ({
      name: c._id,
      count: c.count
    }))
  });
});

/**
 * @desc    Get popular tags
 * @route   GET /api/blogs/tags
 * @access  Public
 */
export const getTags = asyncHandler(async (req, res) => {
  const tags = await Blog.aggregate([
    { $match: { isPublished: true } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 }
  ]);

  res.json({
    success: true,
    tags: tags.map(t => ({
      name: t._id,
      count: t.count
    }))
  });
});

/**
 * @desc    Like/Unlike blog
 * @route   POST /api/blogs/:id/like
 * @access  Private
 */
export const toggleLike = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  const isLiked = blog.likes.includes(req.user._id);

  if (isLiked) {
    blog.likes = blog.likes.filter(
      id => id.toString() !== req.user._id.toString()
    );
  } else {
    blog.likes.push(req.user._id);
  }

  await blog.save();

  res.json({
    success: true,
    liked: !isLiked,
    likesCount: blog.likes.length
  });
});

/**
 * @desc    Get related blogs
 * @route   GET /api/blogs/:id/related
 * @access  Public
 */
export const getRelatedBlogs = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  const relatedBlogs = await Blog.find({
    _id: { $ne: blog._id },
    isPublished: true,
    $or: [
      { category: blog.category },
      { tags: { $in: blog.tags } }
    ]
  })
    .populate('author', 'name avatar')
    .select('title slug excerpt coverImage category readingTime publishedAt')
    .limit(4);

  res.json({
    success: true,
    blogs: relatedBlogs
  });
});

// ==================== ADMIN ROUTES ====================

/**
 * @desc    Get all blogs (admin)
 * @route   GET /api/blogs/admin
 * @access  Private/Admin
 */
export const getAdminBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = {};
  
  if (status === 'published') {
    query.isPublished = true;
  } else if (status === 'draft') {
    query.isPublished = false;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .populate('author', 'name')
      .select('-content')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit)),
    Blog.countDocuments(query)
  ]);

  res.json({
    success: true,
    blogs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * @desc    Get single blog for editing (admin)
 * @route   GET /api/blogs/admin/:id
 * @access  Private/Admin
 */
export const getAdminBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
    .populate('author', 'name');

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  res.json({
    success: true,
    blog
  });
});

/**
 * @desc    Create blog
 * @route   POST /api/blogs/admin
 * @access  Private/Admin
 */
export const createBlog = asyncHandler(async (req, res) => {
  const blogData = {
    ...req.body,
    author: req.user._id
  };

  const blog = await Blog.create(blogData);

  res.status(201).json({
    success: true,
    message: 'Blog created successfully',
    blog
  });
});

/**
 * @desc    Update blog
 * @route   PUT /api/blogs/admin/:id
 * @access  Private/Admin
 */
export const updateBlog = asyncHandler(async (req, res) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  blog = await Blog.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Blog updated successfully',
    blog
  });
});

/**
 * @desc    Delete blog
 * @route   DELETE /api/blogs/admin/:id
 * @access  Private/Admin
 */
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  await blog.deleteOne();

  res.json({
    success: true,
    message: 'Blog deleted successfully'
  });
});

/**
 * @desc    Toggle publish status
 * @route   PATCH /api/blogs/admin/:id/publish
 * @access  Private/Admin
 */
export const togglePublish = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  blog.isPublished = !blog.isPublished;
  
  if (blog.isPublished && !blog.publishedAt) {
    blog.publishedAt = new Date();
  }

  await blog.save();

  res.json({
    success: true,
    message: blog.isPublished ? 'Blog published' : 'Blog unpublished',
    isPublished: blog.isPublished
  });
});

