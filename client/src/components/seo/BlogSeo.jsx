import { Helmet } from 'react-helmet-async'
import { useLanguage } from '@/context/LanguageContext'

/**
 * Blog SEO Component - Multilingual Vinmec-style SEO
 * 
 * Features:
 * - Dynamic meta tags in English with Hindi synonyms
 * - hreflang tags for Google multilingual indexing
 * - JSON-LD schemas: BlogPosting, MedicalWebPage, FAQPage (bilingual)
 * - Support for Hindi intent keywords in meta
 * 
 * This enables Hindi searches to rank English content
 * (like Vinmec.com behavior)
 */
export default function BlogSeo({ blog, faqs = [] }) {
  const { currentLanguage } = useLanguage()
  const siteUrl = 'https://www.healthreportscan.info'
  
  if (!blog) return null

  // ========== SEO TITLE & DESCRIPTION ==========
  // English title (primary)
  const seoTitle = blog.seo?.metaTitle || 
    `${blog.title.substring(0, 50)} | Health Scan Blog`
  
  // Meta description with Hindi keywords for search matching
  const hindiKeywords = blog.seo?.hindiMeta?.keywords?.join(' ') || ''
  const baseDescription = blog.seo?.metaDescription || 
    blog.excerpt?.substring(0, 140) ||
    `Read about ${blog.title} on Health Scan.`
  
  // Combine English description with hidden Hindi keywords for SEO
  const seoDescription = hindiKeywords 
    ? `${baseDescription} ${hindiKeywords}`.substring(0, 160)
    : baseDescription.substring(0, 160)
  
  // Generate keywords combining English + Hindi
  const englishKeywords = blog.seo?.keywords || [blog.category, ...(blog.tags || [])]
  const hindiSeoKeywords = blog.seo?.hindiMeta?.keywords || []
  const hinglishKeywords = blog.intentKeywords?.hinglish || []
  
  const allKeywords = [
    ...englishKeywords,
    ...hindiSeoKeywords,
    ...hinglishKeywords,
    ...(blog.symptoms || []),
    'health', 'wellness', 'medical information'
  ].filter(Boolean).join(', ')
  
  // Canonical URL (always English slug)
  const canonicalUrl = `${siteUrl}/blogs/${blog.slug}`
  
  // Image URL
  const imageUrl = blog.coverImage?.startsWith('http') 
    ? blog.coverImage 
    : `${siteUrl}${blog.coverImage}`

  // Author info
  const authorName = blog.author?.name || 'Health Scan Team'
  
  // Dates
  const publishedDate = blog.publishedAt || blog.createdAt
  const modifiedDate = blog.updatedAt

  // ========== BILINGUAL FAQ SCHEMA ==========
  // Combines both English and Hindi FAQs for rich results
  const buildFaqSchema = () => {
    const faqItems = []
    
    // Add blog's own FAQs (bilingual)
    if (blog.faq && blog.faq.length > 0) {
      blog.faq.forEach(faq => {
        // English FAQ
        if (faq.question_en && faq.answer_en) {
          faqItems.push({
            "@type": "Question",
            "name": faq.question_en,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer_en
            }
          })
        }
        // Hindi FAQ (for Google Hindi search)
        if (faq.question_hi && faq.answer_hi) {
          faqItems.push({
            "@type": "Question",
            "name": faq.question_hi,
            "inLanguage": "hi",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer_hi,
              "inLanguage": "hi"
            }
          })
        }
      })
    }
    
    // Add auto-generated FAQs if provided
    faqs.forEach(faq => {
      faqItems.push({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      })
    })

    if (faqItems.length === 0) return null

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      "mainEntity": faqItems
    }
  }

  // ========== BLOG POSTING SCHEMA ==========
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    "headline": blog.title,
    "alternativeHeadline": blog.seo?.hindiMeta?.title || blog.title,
    "description": seoDescription,
    "image": {
      "@type": "ImageObject",
      "url": imageUrl,
      "width": 1200,
      "height": 630
    },
    "datePublished": publishedDate,
    "dateModified": modifiedDate,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": `${siteUrl}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Health Scan",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`,
        "width": 200,
        "height": 200
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "articleSection": blog.category,
    "keywords": allKeywords,
    "wordCount": blog.content?.split(/\s+/).length || 0,
    "timeRequired": `PT${blog.readingTime || 5}M`,
    "inLanguage": "en-US",
    // Add Hindi intent keywords as about topics
    "about": [
      ...(blog.intentKeywords?.hi || []).slice(0, 3).map(kw => ({
        "@type": "Thing",
        "name": kw,
        "inLanguage": "hi"
      })),
      ...(blog.symptoms || []).slice(0, 3).map(s => ({
        "@type": "MedicalSymptom",
        "name": s
      }))
    ]
  }

  // ========== MEDICAL WEB PAGE SCHEMA ==========
  const medicalWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${canonicalUrl}#webpage`,
    "name": blog.title,
    "description": seoDescription,
    "url": canonicalUrl,
    "inLanguage": ["en-US", "hi-IN"], // Indicates content serves both
    "specialty": {
      "@type": "MedicalSpecialty",
      "name": getMedicalSpecialty(blog.medicalCategory || blog.category)
    },
    "medicalAudience": {
      "@type": "MedicalAudience",
      "audienceType": "Patient"
    },
    "lastReviewed": blog.medicalReviewed ? modifiedDate : undefined,
    "reviewedBy": blog.medicalReviewed ? {
      "@type": "Organization",
      "name": blog.reviewedBy || "Health Scan Medical Content Team"
    } : undefined,
    "datePublished": publishedDate,
    "mainContentOfPage": {
      "@type": "WebPageElement",
      "cssSelector": ".blog-content"
    },
    "about": getMedicalConditions(blog.symptoms, blog.tags, blog.category),
    // Symptoms for medical search
    "mentions": (blog.symptoms || []).map(symptom => ({
      "@type": "MedicalSymptom",
      "name": symptom
    }))
  }

  // ========== BREADCRUMB SCHEMA ==========
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Health Blog",
        "item": `${siteUrl}/blogs`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.category,
        "item": `${siteUrl}/blogs/category/${encodeURIComponent(blog.category.toLowerCase().replace(/\s+/g, '-'))}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": blog.title,
        "item": canonicalUrl
      }
    ]
  }

  const faqSchema = buildFaqSchema()

  return (
    <Helmet>
      {/* ========== LANGUAGE & ENCODING ========== */}
      <html lang="en" />
      <meta charSet="UTF-8" />
      
      {/* ========== BASIC META TAGS ========== */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={allKeywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* ========== ROBOTS DIRECTIVES ========== */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* ========== AUTHOR & MEDICAL ATTRIBUTION ========== */}
      <meta name="author" content={authorName} />
      {blog.medicalReviewed && (
        <meta name="medical-reviewer" content={blog.reviewedBy || 'Health Scan Medical Team'} />
      )}
      
      {/* ========== OPEN GRAPH TAGS ========== */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={blog.title} />
      <meta property="og:site_name" content="Health Scan" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="hi_IN" />
      
      {/* Article-specific OG tags */}
      <meta property="article:published_time" content={publishedDate} />
      <meta property="article:modified_time" content={modifiedDate} />
      <meta property="article:author" content={authorName} />
      <meta property="article:section" content={blog.category} />
      {blog.tags?.map((tag, i) => (
        <meta key={i} property="article:tag" content={tag} />
      ))}
      
      {/* ========== TWITTER CARD TAGS ========== */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:label1" content="Reading time" />
      <meta name="twitter:data1" content={`${blog.readingTime || 5} min read`} />
      <meta name="twitter:label2" content="Category" />
      <meta name="twitter:data2" content={blog.category} />
      
      {/* ========== HREFLANG TAGS (CRITICAL FOR MULTILINGUAL SEO) ========== */}
      {/* English version (canonical) */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      {/* Hindi version - same URL, different hreflang signals Hindi relevance */}
      <link rel="alternate" hrefLang="hi" href={canonicalUrl} />
      {/* Spanish version */}
      <link rel="alternate" hrefLang="es" href={canonicalUrl} />
      {/* Default fallback */}
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      
      {/* ========== GOOGLE NEWS & DISCOVER ========== */}
      <meta name="news_keywords" content={allKeywords} />
      <meta name="syndication-source" content={canonicalUrl} />
      <meta name="original-source" content={canonicalUrl} />
      
      {/* ========== JSON-LD STRUCTURED DATA ========== */}
      <script type="application/ld+json">
        {JSON.stringify(blogPostingSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(medicalWebPageSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
    </Helmet>
  )
}

/**
 * Map blog category to medical specialty
 */
function getMedicalSpecialty(category) {
  const specialtyMap = {
    'Fitness': 'Sports Medicine',
    'Mental Health': 'Psychiatry',
    'Diet': 'Nutrition',
    'Diseases': 'Internal Medicine',
    'Wellness': 'Preventive Medicine',
    'Prevention': 'Preventive Medicine',
    'Lifestyle': 'Family Medicine',
    'Digestive Health': 'Gastroenterology',
    'Skin Care': 'Dermatology',
    'Mental Wellness': 'Psychiatry',
    'Cardiovascular': 'Cardiology',
    'Respiratory': 'Pulmonology',
    'Musculoskeletal': 'Orthopedics',
    'Nutrition': 'Nutrition',
    'Women Health': 'Gynecology',
    'Men Health': 'Urology',
    'Child Health': 'Pediatrics',
    'General Wellness': 'Family Medicine',
    'Infectious Diseases': 'Infectious Disease'
  }
  return specialtyMap[category] || 'General Practice'
}

/**
 * Generate MedicalCondition schema from symptoms and tags
 */
function getMedicalConditions(symptoms, tags, category) {
  const conditions = []
  
  // Add symptoms as medical conditions
  if (symptoms && symptoms.length > 0) {
    symptoms.slice(0, 5).forEach(symptom => {
      conditions.push({
        "@type": "MedicalCondition",
        "name": symptom
      })
    })
  }
  
  // Add tags as conditions
  if (tags && tags.length > 0 && conditions.length < 5) {
    tags.slice(0, 5 - conditions.length).forEach(tag => {
      conditions.push({
        "@type": "MedicalCondition",
        "name": tag
      })
    })
  }
  
  // Fallback to category
  if (conditions.length === 0) {
    return { "@type": "MedicalCondition", "name": category }
  }
  
  return conditions
}

/**
 * Category Page SEO Component
 */
export function CategorySeo({ category, blogCount }) {
  const { currentLanguage } = useLanguage()
  const siteUrl = 'https://www.healthreportscan.info'
  const slug = category.toLowerCase().replace(/\s+/g, '-')
  const canonicalUrl = `${siteUrl}/blogs/category/${slug}`
  
  const title = `${category} Health Articles | Health Scan Blog`
  const description = getCategoryDescription(category, blogCount)
  
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category} Health Articles`,
    "description": description,
    "url": canonicalUrl,
    "inLanguage": ["en-US", "hi-IN"],
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": blogCount,
      "itemListElement": []
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Health Blog",
          "item": `${siteUrl}/blogs`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": category,
          "item": canonicalUrl
        }
      ]
    }
  }
  
  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="index, follow" />
      
      {/* Hreflang for category pages */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="hi" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      <script type="application/ld+json">
        {JSON.stringify(collectionPageSchema)}
      </script>
    </Helmet>
  )
}

/**
 * Get category description for SEO
 */
function getCategoryDescription(category, count) {
  const descriptions = {
    'Fitness': `Explore ${count}+ expert fitness articles on Health Scan. Discover workout tips, exercise guides, strength training, cardio routines, and science-backed fitness advice for all levels.`,
    'Mental Health': `Read ${count}+ mental health articles on Health Scan. Expert guidance on stress management, anxiety, depression, mindfulness, therapy, and emotional wellness.`,
    'Diet': `Browse ${count}+ nutrition and diet articles on Health Scan. Evidence-based advice on healthy eating, meal planning, weight management, and dietary guidelines.`,
    'Diseases': `Learn about health conditions with ${count}+ disease information articles on Health Scan. Symptoms, causes, treatments, and prevention strategies explained.`,
    'Wellness': `Discover ${count}+ wellness articles on Health Scan. Holistic health tips, self-care practices, lifestyle improvements, and preventive health strategies.`,
    'Prevention': `Explore ${count}+ disease prevention articles on Health Scan. Learn about screening, vaccines, lifestyle factors, and proactive health measures.`,
    'Lifestyle': `Read ${count}+ lifestyle health articles on Health Scan. Tips for sleep, work-life balance, healthy habits, and overall wellbeing.`
  }
  return descriptions[category] || `Browse ${count}+ health articles about ${category} on Health Scan.`
}
