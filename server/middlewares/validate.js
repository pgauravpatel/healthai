import { z } from 'zod';

/**
 * Validation Middleware Factory
 * Creates middleware that validates request body against Zod schema
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    next(error);
  }
};

/**
 * Validation Schemas
 */

// User Registration Schema
export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
  email: z.string()
    .email('Please enter a valid email')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters')
});

// User Login Schema
export const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(1, 'Password is required')
});

// Update Profile Schema
export const updateProfileSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim()
    .optional(),
  bio: z.string()
    .max(500, 'Bio cannot exceed 500 characters')
    .optional(),
  avatar: z.string()
    .url('Please enter a valid URL')
    .optional()
    .nullable()
});

// Change Password Schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(6, 'New password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters')
});

// Blog Schema with Multilingual SEO Support
export const blogSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
  content: z.string()
    .min(1, 'Content is required'),
  excerpt: z.string()
    .max(500, 'Excerpt cannot exceed 500 characters')
    .optional(),
  category: z.enum(['Fitness', 'Mental Health', 'Diet', 'Diseases', 'Wellness', 'Prevention', 'Lifestyle']),
  medicalCategory: z.enum([
    'Digestive Health', 'Skin Care', 'Mental Wellness', 'Cardiovascular',
    'Respiratory', 'Musculoskeletal', 'Nutrition', 'Women Health',
    'Men Health', 'Child Health', 'General Wellness', 'Infectious Diseases', 'Other'
  ]).optional(),
  tags: z.array(z.string().trim().toLowerCase()).optional(),
  coverImage: z.string().url('Please enter a valid URL').optional(),
  isPublished: z.boolean().optional(),
  
  // Multilingual Intent Keywords (Vinmec-style SEO)
  intentKeywords: z.object({
    en: z.array(z.string()).optional(),
    hi: z.array(z.string()).optional(),
    hinglish: z.array(z.string()).optional()
  }).optional(),
  
  // Medical symptoms for search matching
  symptoms: z.array(z.string()).optional(),
  
  // SEO metadata with Hindi support
  seo: z.object({
    metaTitle: z.string().max(60, 'Meta title cannot exceed 60 characters').optional(),
    metaDescription: z.string().max(160, 'Meta description cannot exceed 160 characters').optional(),
    keywords: z.array(z.string()).optional(),
    // Hindi SEO metadata
    hindiMeta: z.object({
      title: z.string().max(70).optional(),
      description: z.string().max(200).optional(),
      keywords: z.array(z.string()).optional()
    }).optional()
  }).optional(),
  
  // Bilingual FAQ for rich results
  faq: z.array(z.object({
    question_en: z.string().min(1, 'English question is required'),
    answer_en: z.string().min(1, 'English answer is required'),
    question_hi: z.string().optional(),
    answer_hi: z.string().optional()
  })).optional(),
  
  // Medical trust signals (EEAT)
  medicalReviewed: z.boolean().optional(),
  reviewedBy: z.string().optional()
});

// Blog Update Schema (all fields optional)
export const blogUpdateSchema = blogSchema.partial();

// Comment Schema
export const commentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment cannot exceed 1000 characters')
    .trim(),
  parentComment: z.string().optional()
});

// Chat Message Schema
export const chatMessageSchema = z.object({
  message: z.string()
    .min(1, 'Message cannot be empty')
    .max(4000, 'Message cannot exceed 4000 characters')
    .trim(),
  chatId: z.string().optional()
});

export default validate;

