import { Helmet } from 'react-helmet-async'
import { useLanguage } from '@/context/LanguageContext'

/**
 * Blog SEO Component
 * Handles all SEO for blog pages including:
 * - Meta tags (title, description, keywords)
 * - Open Graph tags
 * - Twitter Card tags
 * - JSON-LD structured data (BlogPosting, MedicalWebPage, FAQPage, BreadcrumbList)
 */
export default function BlogSeo({ blog, faqs = [] }) {
  const { currentLanguage } = useLanguage()
  const siteUrl = 'https://healthai.vercel.app'
  
  if (!blog) return null

  // Generate SEO title (max 60 chars)
  const seoTitle = blog.seo?.metaTitle || 
    `${blog.title.substring(0, 50)} | HealthAI Health Blog`
  
  // Generate meta description (max 160 chars)
  const seoDescription = blog.seo?.metaDescription || 
    blog.excerpt?.substring(0, 157) + '...' ||
    `Read about ${blog.title} on HealthAI. Expert health information and advice.`
  
  // Generate keywords
  const keywords = blog.seo?.keywords?.join(', ') || 
    [blog.category, ...(blog.tags || []), 'health', 'wellness', 'medical information'].join(', ')
  
  // Canonical URL
  const canonicalUrl = `${siteUrl}/blogs/${blog.slug}`
  
  // Image URL
  const imageUrl = blog.coverImage?.startsWith('http') 
    ? blog.coverImage 
    : `${siteUrl}${blog.coverImage}`

  // Author info
  const authorName = blog.author?.name || 'HealthAI Team'
  
  // Dates
  const publishedDate = blog.publishedAt || blog.createdAt
  const modifiedDate = blog.updatedAt

  // BlogPosting Schema
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    "headline": blog.title,
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
      "name": "HealthAI",
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
    "keywords": keywords,
    "wordCount": blog.content?.split(/\s+/).length || 0,
    "timeRequired": `PT${blog.readingTime || 5}M`,
    "inLanguage": currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'es' ? 'es-ES' : 'en-US'
  }

  // MedicalWebPage Schema (for health content)
  const medicalWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${canonicalUrl}#webpage`,
    "name": blog.title,
    "description": seoDescription,
    "url": canonicalUrl,
    "specialty": {
      "@type": "MedicalSpecialty",
      "name": getMedicalSpecialty(blog.category)
    },
    "medicalAudience": {
      "@type": "MedicalAudience",
      "audienceType": "Patient"
    },
    "lastReviewed": modifiedDate,
    "datePublished": publishedDate,
    "mainContentOfPage": {
      "@type": "WebPageElement",
      "cssSelector": ".blog-content"
    },
    "reviewedBy": {
      "@type": "Organization",
      "name": "HealthAI Medical Content Team"
    },
    "about": getMedicalConditions(blog.tags, blog.category)
  }

  // FAQPage Schema (if FAQs exist)
  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null

  // BreadcrumbList Schema
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

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={currentLanguage} />
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Author */}
      <meta name="author" content={authorName} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={blog.title} />
      <meta property="og:site_name" content="HealthAI" />
      <meta property="og:locale" content={currentLanguage === 'hi' ? 'hi_IN' : currentLanguage === 'es' ? 'es_ES' : 'en_US'} />
      
      {/* Article specific OG tags */}
      <meta property="article:published_time" content={publishedDate} />
      <meta property="article:modified_time" content={modifiedDate} />
      <meta property="article:author" content={authorName} />
      <meta property="article:section" content={blog.category} />
      {blog.tags?.map((tag, i) => (
        <meta key={i} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:label1" content="Reading time" />
      <meta name="twitter:data1" content={`${blog.readingTime || 5} min read`} />
      <meta name="twitter:label2" content="Category" />
      <meta name="twitter:data2" content={blog.category} />
      
      {/* Language Alternates */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="hi" href={`${canonicalUrl}?lang=hi`} />
      <link rel="alternate" hrefLang="es" href={`${canonicalUrl}?lang=es`} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      
      {/* JSON-LD Structured Data */}
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
    'Lifestyle': 'Family Medicine'
  }
  return specialtyMap[category] || 'General Practice'
}

/**
 * Generate MedicalCondition schema from tags
 */
function getMedicalConditions(tags, category) {
  if (!tags || tags.length === 0) {
    return { "@type": "MedicalCondition", "name": category }
  }
  
  return tags.slice(0, 3).map(tag => ({
    "@type": "MedicalCondition",
    "name": tag
  }))
}

/**
 * Category Page SEO Component
 */
export function CategorySeo({ category, blogCount }) {
  const { currentLanguage } = useLanguage()
  const siteUrl = 'https://healthai.vercel.app'
  const slug = category.toLowerCase().replace(/\s+/g, '-')
  const canonicalUrl = `${siteUrl}/blogs/category/${slug}`
  
  const title = `${category} Health Articles | HealthAI Blog`
  const description = getCategoryDescription(category, blogCount)
  
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category} Health Articles`,
    "description": description,
    "url": canonicalUrl,
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
      <html lang={currentLanguage} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="index, follow" />
      
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
    'Fitness': `Explore ${count}+ expert fitness articles on HealthAI. Discover workout tips, exercise guides, strength training, cardio routines, and science-backed fitness advice for all levels.`,
    'Mental Health': `Read ${count}+ mental health articles on HealthAI. Expert guidance on stress management, anxiety, depression, mindfulness, therapy, and emotional wellness.`,
    'Diet': `Browse ${count}+ nutrition and diet articles on HealthAI. Evidence-based advice on healthy eating, meal planning, weight management, and dietary guidelines.`,
    'Diseases': `Learn about health conditions with ${count}+ disease information articles on HealthAI. Symptoms, causes, treatments, and prevention strategies explained.`,
    'Wellness': `Discover ${count}+ wellness articles on HealthAI. Holistic health tips, self-care practices, lifestyle improvements, and preventive health strategies.`,
    'Prevention': `Explore ${count}+ disease prevention articles on HealthAI. Learn about screening, vaccines, lifestyle factors, and proactive health measures.`,
    'Lifestyle': `Read ${count}+ lifestyle health articles on HealthAI. Tips for sleep, work-life balance, healthy habits, and overall wellbeing.`
  }
  return descriptions[category] || `Browse ${count}+ health articles about ${category} on HealthAI.`
}

