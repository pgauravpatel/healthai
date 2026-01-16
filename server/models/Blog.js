import mongoose from 'mongoose';
import slugify from 'slugify';

/**
 * Blog Schema
 * Enhanced for Multilingual SEO (Vinmec-style)
 * - Supports Hindi/English/Hinglish intent-based search
 * - Medical SEO optimized for Google EEAT signals
 */
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  // SEO-friendly URL slug (English, keyword-rich)
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  
  // Primary language of content
  primaryLanguage: {
    type: String,
    default: 'en',
    enum: ['en', 'hi', 'es']
  },
  
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Fitness', 'Mental Health', 'Diet', 'Diseases', 'Wellness', 'Prevention', 'Lifestyle']
  },
  
  // Medical category for structured data
  medicalCategory: {
    type: String,
    enum: [
      'Digestive Health',
      'Skin Care',
      'Mental Wellness',
      'Cardiovascular',
      'Respiratory',
      'Musculoskeletal',
      'Nutrition',
      'Women Health',
      'Men Health',
      'Child Health',
      'General Wellness',
      'Infectious Diseases',
      'Other'
    ],
    default: 'General Wellness'
  },
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // ========== MULTILINGUAL INTENT KEYWORDS (CRITICAL FOR HINDI SEO) ==========
  // These keywords help match Hindi searches to English content
  intentKeywords: {
    en: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    hi: [{
      type: String,
      trim: true
    }],
    hinglish: [{
      type: String,
      trim: true,
      lowercase: true
    }]
  },
  
  // Symptoms list for medical search matching
  symptoms: [{
    type: String,
    trim: true
  }],
  
  // ========== MULTILINGUAL SEO METADATA ==========
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      trim: true
    }],
    // Hindi SEO meta (for Google Hindi search ranking)
    hindiMeta: {
      title: {
        type: String,
        maxlength: [70, 'Hindi meta title cannot exceed 70 characters']
      },
      description: {
        type: String,
        maxlength: [200, 'Hindi meta description cannot exceed 200 characters']
      },
      keywords: [{
        type: String,
        trim: true
      }]
    }
  },
  
  // ========== MULTILINGUAL FAQ (FOR RICH RESULTS) ==========
  faq: [{
    question_en: {
      type: String,
      required: true
    },
    question_hi: {
      type: String
    },
    answer_en: {
      type: String,
      required: true
    },
    answer_hi: {
      type: String
    }
  }],
  
  // ========== MEDICAL TRUST SIGNALS (EEAT) ==========
  medicalReviewed: {
    type: Boolean,
    default: false
  },
  
  reviewedBy: {
    type: String,
    default: ''
  },
  
  reviewedAt: {
    type: Date
  },
  
  // Medical references/sources
  medicalSources: [{
    title: String,
    url: String
  }],
  
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800'
  },
  
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  isPublished: {
    type: Boolean,
    default: false
  },
  
  publishedAt: {
    type: Date,
    default: null
  },
  
  readingTime: {
    type: Number, // in minutes
    default: 1
  },
  
  views: {
    type: Number,
    default: 0
  },
  
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// ========== SLUG GENERATION ==========
// Generate SEO-friendly slug (English, keyword-rich, no timestamp for clean URLs)
blogSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    // Generate clean, SEO-friendly slug without timestamp
    this.slug = slugify(this.title, { 
      lower: true, 
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }
  next();
});

// Calculate reading time before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // Average reading speed: 200 words per minute
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  next();
});

// Generate excerpt if not provided
blogSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.excerpt) {
    // Strip HTML tags and get first 200 characters
    const plainText = this.content.replace(/<[^>]*>/g, '');
    this.excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
  }
  next();
});

// Set publishedAt when publishing
blogSchema.pre('save', function(next) {
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// ========== TEXT INDEXES FOR MULTILINGUAL SEARCH ==========
// Compound text index for semantic search across languages
blogSchema.index({
  title: 'text',
  content: 'text',
  'intentKeywords.en': 'text',
  'intentKeywords.hi': 'text',
  'intentKeywords.hinglish': 'text',
  symptoms: 'text',
  tags: 'text'
}, {
  weights: {
    title: 10,
    'intentKeywords.hi': 8,
    'intentKeywords.hinglish': 7,
    'intentKeywords.en': 6,
    symptoms: 5,
    tags: 3,
    content: 1
  },
  name: 'multilingual_search_index',
  default_language: 'none' // Allows Hindi/Hinglish text
});

// Additional indexes for performance
blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1, isPublished: 1 });
blogSchema.index({ medicalCategory: 1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ 'intentKeywords.hi': 1 });
blogSchema.index({ symptoms: 1 });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
