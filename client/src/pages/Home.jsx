import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  MessageCircle, BookOpen, Heart, Shield, 
  Activity, Brain, Apple, Stethoscope, ArrowRight,
  CheckCircle, Sparkles, FileSearch
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import Seo, { organizationSchema, softwareSchema } from '@/components/seo/Seo'
import EverydayHealthProblems from '@/components/home/EverydayHealthProblems'

export default function Home() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()

  // Combined schema for homepage
  const homeSchema = [organizationSchema, softwareSchema]

  const features = [
    {
      icon: MessageCircle,
      title: t('home.feature1Title'),
      description: t('home.feature1Desc'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FileSearch,
      title: t('home.feature2Title'),
      description: t('home.feature2Desc'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: BookOpen,
      title: t('home.feature3Title'),
      description: t('home.feature3Desc'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: t('report.securityFeature'),
      description: t('report.securityDesc'),
      color: 'from-red-500 to-orange-500'
    }
  ]

  const categories = [
    { icon: Activity, label: t('blog.fitness'), color: 'bg-blue-500' },
    { icon: Brain, label: t('blog.mentalHealth'), color: 'bg-purple-500' },
    { icon: Apple, label: t('blog.diet'), color: 'bg-green-500' },
    { icon: Stethoscope, label: t('blog.lifestyle'), color: 'bg-teal-500' }
  ]

  const stats = [
    { value: '10K+', label: t('blog.title') },
    { value: '50K+', label: t('admin.totalUsers') },
    { value: '24/7', label: t('navbar.aiAssistant') },
    { value: '100%', label: 'Free' }
  ]

  return (
    <>
      <Seo
        title={t('seo.homeTitle')}
        description={t('seo.homeDescription')}
        keywords={t('seo.homeKeywords')}
        canonicalUrl="/"
        schema={homeSchema}
      />
      
      <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-health-500/10 via-transparent to-mint-500/10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-health-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-mint-500/20 rounded-full blur-3xl animate-pulse-slow" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Health Platform
              </span>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                {t('home.heroTitle')}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t('home.heroSubtitle')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="xl" variant="gradient" asChild>
                  <Link to="/chat">
                    <MessageCircle className="w-5 h-5" />
                    {t('home.getStarted')}
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <Link to="/blogs">
                    <BookOpen className="w-5 h-5" />
                    {t('home.exploreBlog')}
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {t('disclaimers.ai').substring(0, 50)}...
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('home.features')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('home.featuresSubtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="health-card p-6 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Everyday Health Problems Section */}
      <EverydayHealthProblems />

      {/* Categories Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('blog.categories')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('blog.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/blogs?category=${cat.label}`}
                  className="block p-8 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-lg transition-all text-center group"
                >
                  <div className={`w-16 h-16 mx-auto rounded-2xl ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <cat.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold">{cat.label}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center glass-card p-12"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-health-500 to-mint-500 flex items-center justify-center mb-6">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('home.ctaTitle')}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {t('home.ctaSubtitle')}
            </p>
            <Button size="xl" variant="gradient" asChild>
              <Link to={isAuthenticated ? '/chat' : '/register'}>
                {isAuthenticated ? t('home.getStarted') : t('home.ctaButton')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="py-8 bg-amber-50 dark:bg-amber-900/10 border-y border-amber-200 dark:border-amber-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            {t('disclaimers.medical')}
          </p>
        </div>
      </section>
    </div>
    </>
  )
}
