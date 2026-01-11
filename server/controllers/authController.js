import User from '../models/User.js';
import { generateToken, setTokenCookie, clearTokenCookie } from '../middlewares/auth.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered'
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  // Generate token and set cookie
  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check if account is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated. Please contact support.'
    });
  }

  // Verify password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Generate token and set cookie
  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res);

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('bookmarkedBlogs', 'title slug coverImage');

  res.json({
    success: true,
    user
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, bio, avatar },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user
  });
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Generate new token
  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

/**
 * @desc    Toggle blog bookmark
 * @route   POST /api/auth/bookmark/:blogId
 * @access  Private
 */
export const toggleBookmark = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const user = await User.findById(req.user._id);

  const isBookmarked = user.bookmarkedBlogs.includes(blogId);

  if (isBookmarked) {
    user.bookmarkedBlogs = user.bookmarkedBlogs.filter(
      id => id.toString() !== blogId
    );
  } else {
    user.bookmarkedBlogs.push(blogId);
  }

  await user.save();

  res.json({
    success: true,
    isBookmarked: !isBookmarked,
    message: isBookmarked ? 'Bookmark removed' : 'Blog bookmarked'
  });
});

/**
 * @desc    Get bookmarked blogs
 * @route   GET /api/auth/bookmarks
 * @access  Private
 */
export const getBookmarks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'bookmarkedBlogs',
      select: 'title slug excerpt coverImage category readingTime publishedAt',
      match: { isPublished: true }
    });

  res.json({
    success: true,
    bookmarks: user.bookmarkedBlogs
  });
});

/**
 * @desc    Update user language preference
 * @route   PUT /api/auth/language
 * @access  Private
 */
export const updateLanguage = asyncHandler(async (req, res) => {
  const { language } = req.body;
  const supportedLanguages = ['en', 'hi', 'es'];

  if (!language || !supportedLanguages.includes(language)) {
    return res.status(400).json({
      success: false,
      message: `Invalid language. Supported: ${supportedLanguages.join(', ')}`
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { language },
    { new: true }
  );

  res.json({
    success: true,
    message: 'Language preference updated',
    language: user.language
  });
});

