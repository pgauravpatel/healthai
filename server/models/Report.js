import mongoose from 'mongoose';

/**
 * Report Schema Defination
 * Stores user health report analyses
 */
const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportType: {
    type: String,
    enum: ['blood_test', 'urine_test', 'lipid_panel', 'liver_function', 'kidney_function', 'thyroid', 'general', 'other'],
    default: 'general'
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'image'],
    required: true
  },
  rawExtractedText: {
    type: String,
    default: ''
  },
  userProfile: {
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    conditions: [String]
  },
  aiResponse: {
    summary: String,
    keyFindings: [{
      test: String,
      value: String,
      normalRange: String,
      status: {
        type: String,
        enum: ['normal', 'high', 'low', 'critical_high', 'critical_low']
      }
    }],
    explanations: [{
      test: String,
      meaning: String
    }],
    lifestyleSuggestions: [String],
    doctorConsultationAdvice: String,
    disclaimer: String
  },
  creditsUsed: {
    type: Number,
    default: 1
  },
  processingTime: {
    type: Number // in milliseconds
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  errorMessage: String
}, {
  timestamps: true
});

// Index for efficient queries
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ status: 1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;

