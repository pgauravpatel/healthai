import rateLimit from 'express-rate-limit';

/**
 * General API Rate Limiter
 * Applies to all API routes
 */
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(req.rateLimit.resetTime - Date.now()) / 1000
    });
  }
});

/**
 * AI Chat Rate Limiter
 * Stricter limits for AI endpoints to control costs
 */
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AI_RATE_LIMIT_MAX_REQUESTS) || 20, // 20 AI requests per window
  message: {
    success: false,
    message: 'AI request limit reached. Please wait before sending more messages.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise IP
    return req.user ? req.user._id.toString() : req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'You\'ve reached the AI chat limit. Please wait 15 minutes before sending more messages.',
      retryAfter: Math.ceil(req.rateLimit.resetTime - Date.now()) / 1000
    });
  }
});

/**
 * Auth Rate Limiter
 * Prevents brute force attacks on login/register
 */
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful logins
});

