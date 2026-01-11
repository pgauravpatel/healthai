import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, ChevronDown, ChevronUp } from 'lucide-react'

export default function MedicalDisclaimer({ variant = 'default' }) {
  const { t } = useTranslation()
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('disclaimer-dismissed') === 'true'
  })
  const [expanded, setExpanded] = useState(false)

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('disclaimer-dismissed', 'true')
  }

  // Compact variant for pages
  if (variant === 'compact') {
    return (
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            {t('disclaimers.medical')}
          </p>
        </div>
      </div>
    )
  }

  if (dismissed) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-16 left-0 right-0 z-40 bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          
          <div className="flex-1">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {t('disclaimers.ai')}
            </p>
            
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2"
                >
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {t('disclaimers.medical')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-amber-600 dark:text-amber-400 hover:underline mt-1 flex items-center gap-1"
            >
              {expanded ? (
                <>{t('common.close')} <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>{t('common.readMore')} <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          </div>
          
          <button
            onClick={handleDismiss}
            className="p-1 rounded hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
            aria-label="Dismiss disclaimer"
          >
            <X className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Inline disclaimer for chat/responses
export function InlineDisclaimer({ variant = 'default' }) {
  const { t } = useTranslation()
  
  if (variant === 'emergency') {
    return (
      <div className="emergency-banner text-sm">
        {t('disclaimers.emergency')}
      </div>
    )
  }

  return (
    <div className="disclaimer-banner text-sm">
      {t('disclaimers.ai')}
    </div>
  )
}
