import Blog from '../models/Blog.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { detectLanguage, buildMultilingualSearchQuery } from '../utils/languageDetector.js';
import { writeSitemapToFile } from '../utils/sitemapGenerator.js';

/**
 * Regenerate sitemap in background (non-blocking)
 */
const regenerateSitemap = () => {
  setImmediate(async () => {
    try {
      await writeSitemapToFile();
      console.log('🗺️ Sitemap regenerated after blog change');
    } catch (error) {
      console.error('Failed to regenerate sitemap:', error.message);
    }
  });
};

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
 * @desc    Semantic search for blogs (Multilingual - Hindi/Hinglish/English)
 * @route   GET /api/blogs/search
 * @access  Public
 * 
 * This endpoint enables Vinmec-style SEO behavior:
 * - Hindi queries match English blogs via intentKeywords.hi
 * - Hinglish queries match via intentKeywords.hinglish
 * - Returns matchedIntentLanguage and confidenceScore
 */
export const semanticSearch = asyncHandler(async (req, res) => {
  const { q, limit = 10, page = 1 } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Search query must be at least 2 characters'
    });
  }

  const searchQuery = q.trim();
  
  // Detect language of the search query
  const languageDetection = detectLanguage(searchQuery);
  const { language: detectedLanguage, confidence } = languageDetection;

  // Build search query based on detected language
  const mongoQuery = buildMultilingualSearchQuery(searchQuery, detectedLanguage);
  
  // Add published filter
  mongoQuery.isPublished = true;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    // First try with text search scoring
    let blogs = [];
    let total = 0;

    if (detectedLanguage === 'hi' || detectedLanguage === 'hinglish') {
      // For Hindi/Hinglish, use regex-based search for better matching
      const searchRegex = new RegExp(searchQuery, 'i');
      
      const orConditions = [
        { 'intentKeywords.hi': searchRegex },
        { 'intentKeywords.hinglish': searchRegex },
        { symptoms: searchRegex },
        { 'seo.hindiMeta.keywords': searchRegex },
        { 'faq.question_hi': searchRegex }
      ];

      // Add text search as fallback
      try {
        orConditions.push({ $text: { $search: searchQuery } });
      } catch (e) {
        // Text search may fail on special characters
      }

      const query = {
        isPublished: true,
        $or: orConditions
      };

      [blogs, total] = await Promise.all([
        Blog.find(query)
          .populate('author', 'name avatar')
          .select('title slug excerpt coverImage category medicalCategory readingTime publishedAt intentKeywords symptoms')
          .sort({ views: -1, publishedAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Blog.countDocuments(query)
      ]);
    } else {
      // English search - use text index
      try {
        [blogs, total] = await Promise.all([
          Blog.find(
            { 
              isPublished: true,
              $text: { $search: searchQuery } 
            },
            { score: { $meta: 'textScore' } }
          )
            .populate('author', 'name avatar')
            .select('title slug excerpt coverImage category medicalCategory readingTime publishedAt')
            .sort({ score: { $meta: 'textScore' }, publishedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
          Blog.countDocuments({ 
            isPublished: true,
            $text: { $search: searchQuery } 
          })
        ]);
      } catch (e) {
        // Fallback to regex search if text search fails
        const searchRegex = new RegExp(searchQuery, 'i');
        const query = {
          isPublished: true,
          $or: [
            { title: searchRegex },
            { 'intentKeywords.en': searchRegex },
            { symptoms: searchRegex },
            { tags: searchRegex }
          ]
        };

        [blogs, total] = await Promise.all([
          Blog.find(query)
            .populate('author', 'name avatar')
            .select('title slug excerpt coverImage category medicalCategory readingTime publishedAt')
            .sort({ views: -1, publishedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
          Blog.countDocuments(query)
        ]);
      }
    }

    // Calculate relevance scores
    const results = blogs.map(blog => {
      let relevanceScore = 0.5; // Base score
      
      // Boost for exact intent keyword match
      if (detectedLanguage === 'hi' && blog.intentKeywords?.hi?.length > 0) {
        const hasMatch = blog.intentKeywords.hi.some(kw => 
          kw.toLowerCase().includes(searchQuery.toLowerCase()) ||
          searchQuery.toLowerCase().includes(kw.toLowerCase())
        );
        if (hasMatch) relevanceScore += 0.3;
      }
      
      // Boost for symptom match
      if (blog.symptoms?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) {
        relevanceScore += 0.2;
      }

      return {
        ...blog.toObject(),
        relevanceScore: Math.min(relevanceScore, 1)
      };
    });

    // Sort by relevance
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.json({
      success: true,
      query: searchQuery,
      matchedIntentLanguage: detectedLanguage,
      confidenceScore: confidence,
      blogs: results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      // Hint for frontend to show translation banner
      showTranslationBanner: detectedLanguage !== 'en' && results.length > 0
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
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

  // Regenerate sitemap if blog is published
  if (blog.isPublished) {
    regenerateSitemap();
  }

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

  const wasPublished = blog.isPublished;
  
  blog = await Blog.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  // Regenerate sitemap if blog is published or was published
  if (blog.isPublished || wasPublished) {
    regenerateSitemap();
  }

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

  const wasPublished = blog.isPublished;
  await blog.deleteOne();

  // Regenerate sitemap if deleted blog was published
  if (wasPublished) {
    regenerateSitemap();
  }

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

  // Always regenerate sitemap on publish/unpublish
  regenerateSitemap();

  res.json({
    success: true,
    message: blog.isPublished ? 'Blog published' : 'Blog unpublished',
    isPublished: blog.isPublished
  });
});

