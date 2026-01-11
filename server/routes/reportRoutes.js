import express from 'express';
import {
  analyzeReport,
  getReports,
  getReport,
  deleteReport,
  reanalyzeReport
} from '../controllers/reportController.js';
import { protect } from '../middlewares/auth.js';
import { checkCredits } from '../middlewares/creditCheck.js';
import { uploadReport, handleUploadError } from '../middlewares/upload.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

/**
 * Rate limiter specifically for report analysis
 * More restrictive than general API limit
 */
const reportAnalysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 reports per hour
  message: {
    success: false,
    message: 'Too many report analysis requests. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?._id?.toString() || req.ip
});

// All routes require authentication
router.use(protect);

/**
 * @route   POST /api/reports/analyze
 * @desc    Upload and analyze a health report
 * @access  Private
 */
router.post(
  '/analyze',
  reportAnalysisLimiter,
  uploadReport,
  handleUploadError,
  checkCredits(1),
  analyzeReport
);

/**
 * @route   GET /api/reports
 * @desc    Get user's report history
 * @access  Private
 */
router.get('/', getReports);

/**
 * @route   GET /api/reports/:id
 * @desc    Get single report details
 * @access  Private
 */
router.get('/:id', getReport);

/**
 * @route   DELETE /api/reports/:id
 * @desc    Delete a report
 * @access  Private
 */
router.delete('/:id', deleteReport);

/**
 * @route   POST /api/reports/:id/reanalyze
 * @desc    Re-analyze an existing report
 * @access  Private
 */
router.post(
  '/:id/reanalyze',
  reportAnalysisLimiter,
  checkCredits(1),
  reanalyzeReport
);

export default router;

