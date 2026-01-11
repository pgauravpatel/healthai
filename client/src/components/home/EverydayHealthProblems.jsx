import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getAllDiseases } from '@/data/diseases'

/**
 * Everyday Health Problems Section
 * Featured section for homepage highlighting common health conditions
 */
export default function EverydayHealthProblems() {
  const { t } = useTranslation()
  const diseases = getAllDiseases()
  
  // Featured conditions for homepage (most searched)
  const featuredConditions = [
    'fungal-infection',
    'mouth-ulcer', 
    'acidity',
    'gas-bloating',
    'piles',
    'fever',
    'cold-cough',
    'dandruff'
  ]
  
  const featured = featuredConditions
    .map(slug => diseases.find(d => d.slug === slug))
    .filter(Boolean)

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            {t('diseases.featuredBadge', 'Everyday Health Problems')}
          </span>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('diseases.sectionTitle', 'Common Health Conditions')}
          </h2>
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('diseases.sectionDesc', 'Get trusted information about everyday health issues. Learn about symptoms, causes, home remedies, and when to see a doctor.')}
          </p>
        </motion.div>

        {/* Conditions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {featured.map((disease, i) => (
            <motion.div
              key={disease.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/diseases/${disease.slug}`}
                className="group block p-5 bg-card rounded-2xl border hover:shadow-xl hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <span className="text-4xl md:text-5xl mb-3 group-hover:scale-110 transition-transform">
                    {disease.emoji}
                  </span>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {disease.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {disease.shortDesc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button variant="outline" size="lg" asChild>
            <Link to="/diseases">
              {t('diseases.viewAll', 'View All Health Conditions')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Trust Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl text-center"
        >
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>✓ Trusted Information:</strong> All content is written for educational purposes and reviewed for accuracy. 
            Always consult a healthcare provider for medical concerns.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/**
 * Compact Disease Card for use in other pages
 */
export function DiseaseCard({ disease, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/diseases/${disease.slug}`}
        className="group flex items-center gap-3 p-4 bg-card rounded-xl border hover:shadow-md hover:border-primary/50 transition-all"
      >
        <span className="text-2xl">{disease.emoji}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium group-hover:text-primary transition-colors truncate">
            {disease.name}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {disease.shortDesc}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </Link>
    </motion.div>
  )
}

