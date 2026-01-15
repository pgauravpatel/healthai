import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { UserAvatar } from '@/components/ui/Avatar'
import { Calendar, Clock, Shield, Award, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils'

/**
 * AuthorBio Component
 * Displays author information and E-E-A-T trust signals
 */
export default function AuthorBio({ author, publishedAt, updatedAt, readingTime }) {
  const { t } = useTranslation()
  
  const authorName = author?.name || 'Health Scan Team'
  const authorBio = author?.bio || 'Health content writer and researcher at Health Scan. Our team is dedicated to providing accurate, evidence-based health information to help you make informed decisions about your wellbeing.'
  
  return (
    <div className="mt-12 space-y-6">
      {/* Author Card */}
      <div className="p-6 bg-muted/50 rounded-2xl border">
        <div className="flex items-start gap-4">
          <UserAvatar user={author} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{authorName}</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-health-500/10 text-health-600 dark:text-health-400 text-xs rounded-full">
                <Award className="w-3 h-3" />
                Verified Author
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              {authorBio}
            </p>
          </div>
        </div>
      </div>

      {/* Publication Info & Trust Signals */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Published: {formatDate(publishedAt)}</span>
        </div>
        
        {updatedAt && updatedAt !== publishedAt && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Updated: {formatDate(updatedAt)}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{readingTime} min read</span>
        </div>
      </div>

      {/* E-E-A-T Trust Banner */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Editorial Standards
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This article was written by our health content team and reviewed for medical accuracy. 
              AI tools may have assisted in research and drafting. We strive to provide evidence-based 
              health information from reputable sources.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link 
                to="/about" 
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                About our team <ExternalLink className="w-3 h-3" />
              </Link>
              <Link 
                to="/disclaimer" 
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                Medical disclaimer <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Compact Medical Disclaimer for Blog Pages
 */
export function BlogDisclaimer() {
  return (
    <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
      <p className="text-sm text-amber-800 dark:text-amber-200">
        <strong>⚕️ Medical Disclaimer:</strong> This article is for informational purposes only 
        and does not constitute medical advice. The information provided should not be used for 
        diagnosing or treating health problems. Always consult a qualified healthcare provider 
        for medical concerns. If you're experiencing a medical emergency, call your local 
        emergency services immediately.
      </p>
    </div>
  )
}

/**
 * Internal Linking Component for Related Content
 */
export function RelatedContent({ category, currentBlogId }) {
  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-health-500/5 to-mint-500/5 rounded-2xl border">
      <h3 className="font-semibold mb-4">Explore More Health Tools</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link 
          to="/ai-health-report-analyzer"
          className="p-4 bg-card rounded-xl border hover:shadow-md transition-all group"
        >
          <h4 className="font-medium group-hover:text-health-500 transition-colors">
            🔬 AI Health Report Analyzer
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            Upload your lab reports and get AI-powered explanations
          </p>
        </Link>
        
        <Link 
          to={`/blogs/category/${category?.toLowerCase().replace(/\s+/g, '-')}`}
          className="p-4 bg-card rounded-xl border hover:shadow-md transition-all group"
        >
          <h4 className="font-medium group-hover:text-health-500 transition-colors">
            📚 More {category} Articles
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            Explore all articles in this category
          </p>
        </Link>
        
        <Link 
          to="/blood-test-analysis"
          className="p-4 bg-card rounded-xl border hover:shadow-md transition-all group"
        >
          <h4 className="font-medium group-hover:text-health-500 transition-colors">
            🩸 Blood Test Guide
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            Understand your blood test results
          </p>
        </Link>
        
        <Link 
          to="/chat"
          className="p-4 bg-card rounded-xl border hover:shadow-md transition-all group"
        >
          <h4 className="font-medium group-hover:text-health-500 transition-colors">
            💬 AI Health Assistant
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            Ask questions about your health
          </p>
        </Link>
      </div>
    </div>
  )
}

