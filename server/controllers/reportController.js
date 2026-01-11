import Report from '../models/Report.js';
import ocrService from '../services/ocrService.js';
import reportAnalysisService from '../services/reportAnalysisService.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { deductCredits } from '../middlewares/creditCheck.js';

/**
 * @desc    Analyze a health report (PDF or image)
 * @route   POST /api/reports/analyze
 * @access  Private
 */
export const analyzeReport = asyncHandler(async (req, res) => {
  const startTime = Date.now();

  // Validate file upload
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a report file (PDF or image)'
    });
  }

  const { buffer, mimetype, originalname } = req.file;
  const userId = req.user._id;

  // Parse optional user profile from form data
  let userProfile = null;
  try {
    if (req.body.userProfile) {
      userProfile = JSON.parse(req.body.userProfile);
    } else {
      // Build from individual fields
      userProfile = {};
      if (req.body.age) userProfile.age = parseInt(req.body.age);
      if (req.body.gender) userProfile.gender = req.body.gender;
      if (req.body.conditions) {
        userProfile.conditions = typeof req.body.conditions === 'string' 
          ? req.body.conditions.split(',').map(c => c.trim())
          : req.body.conditions;
      }
    }
  } catch (e) {
    console.log('Could not parse user profile, continuing without it');
  }

  // Create initial report record
  let report = await Report.create({
    userId,
    fileName: originalname,
    fileType: mimetype === 'application/pdf' ? 'pdf' : 'image',
    rawExtractedText: '', // Will be updated
    userProfile,
    status: 'processing'
  });

  try {
    // Step 1: Extract text using OCR
    console.log(`Processing report: ${originalname}`);
    const { text, fileType } = await ocrService.extractText(buffer, mimetype);
    
    // Update report with extracted text
    report.rawExtractedText = text;
    report.fileType = fileType;
    
    // Detect report type
    report.reportType = ocrService.detectReportType(text);
    
    // Step 2: Analyze with AI
    const analysisResult = await reportAnalysisService.analyzeReport(text, userProfile);
    
    // Step 3: Update report with analysis
    report.aiResponse = analysisResult.analysis;
    report.processingTime = Date.now() - startTime;
    report.status = 'completed';
    await report.save();

    // Deduct credits (placeholder)
    await deductCredits(userId, 1);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Report analyzed successfully',
      data: {
        reportId: report._id,
        reportType: report.reportType,
        analysis: report.aiResponse,
        processingTime: report.processingTime,
        creditsUsed: 1,
        creditsRemaining: req.creditInfo?.remaining || 'N/A'
      }
    });

  } catch (error) {
    // Update report with error status
    report.status = 'failed';
    report.errorMessage = error.message;
    await report.save();

    throw error;
  }
});

/**
 * @desc    Get user's report history
 * @route   GET /api/reports
 * @access  Private
 */
export const getReports = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const userId = req.user._id;

  const query = { userId };
  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [reports, total] = await Promise.all([
    Report.find(query)
      .select('-rawExtractedText') // Exclude large text field
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Report.countDocuments(query)
  ]);

  res.json({
    success: true,
    reports,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * @desc    Get single report details
 * @route   GET /api/reports/:id
 * @access  Private
 */
export const getReport = asyncHandler(async (req, res) => {
  const report = await Report.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found'
    });
  }

  res.json({
    success: true,
    report
  });
});

/**
 * @desc    Delete a report
 * @route   DELETE /api/reports/:id
 * @access  Private
 */
export const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found'
    });
  }

  await report.deleteOne();

  res.json({
    success: true,
    message: 'Report deleted successfully'
  });
});

/**
 * @desc    Re-analyze an existing report
 * @route   POST /api/reports/:id/reanalyze
 * @access  Private
 */
export const reanalyzeReport = asyncHandler(async (req, res) => {
  const report = await Report.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found'
    });
  }

  if (!report.rawExtractedText) {
    return res.status(400).json({
      success: false,
      message: 'No extracted text available for re-analysis'
    });
  }

  const startTime = Date.now();

  try {
    // Re-analyze with AI
    const analysisResult = await reportAnalysisService.analyzeReport(
      report.rawExtractedText,
      report.userProfile
    );

    // Update report
    report.aiResponse = analysisResult.analysis;
    report.processingTime = Date.now() - startTime;
    report.status = 'completed';
    report.errorMessage = undefined;
    await report.save();

    // Deduct credits
    await deductCredits(req.user._id, 1);

    res.json({
      success: true,
      message: 'Report re-analyzed successfully',
      data: {
        reportId: report._id,
        analysis: report.aiResponse,
        processingTime: report.processingTime
      }
    });

  } catch (error) {
    report.status = 'failed';
    report.errorMessage = error.message;
    await report.save();
    throw error;
  }
});

