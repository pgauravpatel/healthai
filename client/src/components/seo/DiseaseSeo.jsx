import { Helmet } from 'react-helmet-async'
import { useLanguage } from '@/context/LanguageContext'

/**
 * Disease Page SEO Component
 * Optimized for health condition searches with medical schemas
 */
export default function DiseaseSeo({ disease }) {
  const { currentLanguage } = useLanguage()
  const siteUrl = 'https://www.healthreportscan.info'
  
  if (!disease) return null

  const canonicalUrl = `${siteUrl}/diseases/${disease.slug}`
  
  // SEO title (optimized for search)
  const title = `${disease.name}: Causes, Symptoms & Home Remedies | Health Scan`
  
  // Meta description (155 chars max)
  const description = `Learn about ${disease.name.toLowerCase()}: common causes, symptoms, home care tips, and when to see a doctor. Safe, evidence-based health information.`
  
  // Keywords
  const keywords = [
    disease.name.toLowerCase(),
    ...disease.searchTerms,
    'symptoms',
    'causes',
    'home remedies',
    'treatment',
    'health information'
  ].join(', ')

  // MedicalWebPage Schema
  const medicalWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${canonicalUrl}#webpage`,
    "name": disease.name,
    "description": disease.overview,
    "url": canonicalUrl,
    "mainContentOfPage": {
      "@type": "WebPageElement",
      "cssSelector": "main"
    },
    "specialty": {
      "@type": "MedicalSpecialty",
      "name": getSpecialty(disease.category)
    },
    "medicalAudience": {
      "@type": "MedicalAudience",
      "audienceType": "Patient"
    },
    "lastReviewed": new Date().toISOString().split('T')[0],
    "reviewedBy": {
      "@type": "Organization",
      "name": "Health Scan Medical Content Team"
    },
    "about": {
      "@type": "MedicalCondition",
      "name": disease.name,
      "associatedAnatomy": {
        "@type": "AnatomicalStructure",
        "name": getAnatomyFromCategory(disease.category)
      }
    }
  }

  // FAQPage Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": disease.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

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
        "name": "Health Conditions",
        "item": `${siteUrl}/diseases`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": disease.name,
        "item": canonicalUrl
      }
    ]
  }

  // HowTo Schema for home care
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Manage ${disease.name} at Home`,
    "description": `Home care tips and remedies for ${disease.name.toLowerCase()}`,
    "step": disease.homeCare.map((step, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "text": step
    }))
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={currentLanguage} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={`${siteUrl}/og-disease.png`} />
      <meta property="og:site_name" content="Health Scan" />
      <meta property="og:locale" content={currentLanguage === 'hi' ? 'hi_IN' : currentLanguage === 'es' ? 'es_ES' : 'en_US'} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Language Alternates */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="hi" href={`${canonicalUrl}?lang=hi`} />
      <link rel="alternate" hrefLang="es" href={`${canonicalUrl}?lang=es`} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(medicalWebPageSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(howToSchema)}
      </script>
    </Helmet>
  )
}

function getSpecialty(category) {
  const map = {
    'Skin & Hair': 'Dermatology',
    'Oral Health': 'Dentistry',
    'Digestive Health': 'Gastroenterology',
    'General Health': 'Internal Medicine',
    'Respiratory Health': 'Pulmonology'
  }
  return map[category] || 'General Practice'
}

function getAnatomyFromCategory(category) {
  const map = {
    'Skin & Hair': 'Skin',
    'Oral Health': 'Mouth',
    'Digestive Health': 'Digestive System',
    'General Health': 'Body',
    'Respiratory Health': 'Respiratory System'
  }
  return map[category] || 'Body'
}

