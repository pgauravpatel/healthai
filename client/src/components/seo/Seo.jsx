import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/context/LanguageContext'

/**
 * SEO Component
 * Handles all meta tags, Open Graph, Twitter Cards, and JSON-LD schema
 * 
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description (150-160 chars recommended)
 * @param {string} props.keywords - Comma-separated keywords
 * @param {string} props.canonicalUrl - Canonical URL for the page
 * @param {string} props.ogImage - Open Graph image URL
 * @param {string} props.ogType - Open Graph type (website, article, etc.)
 * @param {Object} props.schema - JSON-LD schema object
 * @param {boolean} props.noIndex - Whether to noindex the page
 */
export default function Seo({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = '/og-image.png',
  ogType = 'website',
  schema,
  noIndex = false,
  article = null
}) {
  const { currentLanguage } = useLanguage()
  const { t } = useTranslation()
  
  // Default values from translations
  const defaultTitle = t('seo.defaultTitle', 'Health Scan | Understand Your Health Reports')
  const defaultDescription = t('seo.defaultDescription', 'Understand your health reports easily. Get simple explanations of blood tests, lab reports, and medical documents.')
  
  const fullTitle = title ? `${title} | Health Scan` : defaultTitle
  const metaDescription = description || defaultDescription
  const siteUrl = 'https://www.healthreportscan.info'
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`

  // Language mapping for hreflang
  const languageUrls = {
    en: fullCanonicalUrl,
    hi: `${fullCanonicalUrl}?lang=hi`,
    es: `${fullCanonicalUrl}?lang=es`
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={currentLanguage} />
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Language Alternates (hreflang) */}
      <link rel="alternate" hrefLang="en" href={languageUrls.en} />
      <link rel="alternate" hrefLang="hi" href={languageUrls.hi} />
      <link rel="alternate" hrefLang="es" href={languageUrls.es} />
      <link rel="alternate" hrefLang="x-default" href={languageUrls.en} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Health Scan" />
      <meta property="og:locale" content={currentLanguage === 'hi' ? 'hi_IN' : currentLanguage === 'es' ? 'es_ES' : 'en_US'} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* Article specific (for blog posts) */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedAt} />
          <meta property="article:modified_time" content={article.updatedAt} />
          <meta property="article:author" content={article.author} />
          <meta property="article:section" content={article.category} />
        </>
      )}
      
      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  )
}

/**
 * Organization Schema - Use on homepage
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Health Scan",
  "url": "https://www.healthreportscan.info",
  "logo": "https://www.healthreportscan.info/favicon.svg",
  "description": "Health report analyzer providing easy-to-understand explanations of medical lab reports.",
  "sameAs": [],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "availableLanguage": ["English", "Hindi", "Spanish"]
  }
}

/**
 * Software Application Schema
 */
export const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Health Scan Report Analyzer",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Health report analyzer that helps you understand your medical lab reports in simple language.",
  "featureList": [
    "Blood test analysis",
    "PDF and image report upload",
    "Multi-language support",
    "Expert explanations",
    "Lifestyle recommendations"
  ]
}

/**
 * Generate MedicalWebPage schema
 */
export const getMedicalWebPageSchema = (title, description, url) => ({
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "name": title,
  "description": description,
  "url": url,
  "mainContentOfPage": {
    "@type": "WebPageElement",
    "cssSelector": "main"
  },
  "specialty": {
    "@type": "MedicalSpecialty",
    "name": "Laboratory Medicine"
  },
  "medicalAudience": {
    "@type": "MedicalAudience",
    "audienceType": "Patient"
  },
  "lastReviewed": new Date().toISOString().split('T')[0],
  "reviewedBy": {
    "@type": "Organization",
    "name": "Health Scan Medical Content Team"
  }
})

/**
 * Generate FAQ schema from Q&A array
 */
export const getFAQSchema = (faqs) => ({
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
})

/**
 * Generate Article schema for blog posts
 */
export const getArticleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.excerpt,
  "image": article.coverImage,
  "datePublished": article.publishedAt,
  "dateModified": article.updatedAt || article.publishedAt,
  "author": {
    "@type": "Person",
    "name": article.author
  },
  "publisher": {
    "@type": "Organization",
    "name": "Health Scan",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.healthreportscan.info/favicon.svg"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://www.healthreportscan.info/blogs/${article.slug}`
  }
})

/**
 * Generate BreadcrumbList schema
 */
export const getBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
})

