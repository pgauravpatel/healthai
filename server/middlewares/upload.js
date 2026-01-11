import multer from 'multer';

/**
 * File Upload Middleware Configuration
 * Handles multipart/form-data for report uploads
 */

// Allowed MIME types for reports
const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp'
];

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Configure multer storage (memory storage for processing)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: PDF, PNG, JPG, JPEG, WEBP`), false);
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1 // Only allow one file per request
  }
});

/**
 * Middleware for single report file upload
 */
export const uploadReport = upload.single('report');

/**
 * Error handler for multer errors
 */
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Please upload one file at a time.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

export default { uploadReport, handleUploadError };

