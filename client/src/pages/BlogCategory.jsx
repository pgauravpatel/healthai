import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ChevronRight, Loader2, Tag, BookOpen, FileSearch } from 'lucide-react'
import BlogCard from '@/components/blog/BlogCard'
import { BlogCardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { CategorySeo } from '@/components/seo/BlogSeo'
import { blogAPI } from '@/services/api'

// Category metadata for SEO intro text
const categoryInfo = {
  'fitness': {
    name: 'Fitness',
    icon: '💪',
    intro: 'Physical fitness is a state of health and well-being achieved through exercise, proper nutrition, and adequate rest. Our fitness articles cover workout routines, exercise science, strength training, cardio, flexibility, and recovery strategies.',
    benefits: ['Improved cardiovascular health', 'Better mental wellbeing', 'Increased energy levels', 'Stronger muscles and bones'],
    relatedTopics: ['Exercise', 'Workout', 'Strength Training', 'Cardio', 'Recovery']
  },
  'mental-health': {
    name: 'Mental Health',
    icon: '🧠',
    intro: 'Mental health encompasses our emotional, psychological, and social well-being. It affects how we think, feel, and act. Our mental health articles provide evidence-based information on managing stress, anxiety, depression, and building emotional resilience.',
    benefits: ['Better stress management', 'Improved relationships', 'Enhanced productivity', 'Greater life satisfaction'],
    relatedTopics: ['Anxiety', 'Depression', 'Stress', 'Mindfulness', 'Therapy']
  },
  'diet': {
    name: 'Diet',
    icon: '🥗',
    intro: 'Proper nutrition is fundamental to health and disease prevention. Our diet and nutrition articles cover healthy eating patterns, meal planning, nutritional science, weight management, and special dietary needs.',
    benefits: ['Better energy levels', 'Disease prevention', 'Healthy weight management', 'Improved digestion'],
    relatedTopics: ['Nutrition', 'Healthy Eating', 'Weight Loss', 'Meal Planning', 'Vitamins']
  },
  'diseases': {
    name: 'Diseases',
    icon: '🏥',
    intro: 'Understanding health conditions is crucial for prevention, early detection, and effective management. Our disease articles provide educational information about symptoms, causes, treatments, and living with various health conditions.',
    benefits: ['Better health awareness', 'Early symptom recognition', 'Informed healthcare decisions', 'Improved disease management'],
    relatedTopics: ['Symptoms', 'Treatment', 'Prevention', 'Chronic Conditions', 'Health Conditions']
  },
  'wellness': {
    name: 'Wellness',
    icon: '✨',
    intro: 'Wellness is a holistic approach to health that goes beyond the absence of illness. It encompasses physical, mental, emotional, and social well-being. Our wellness articles help you create a balanced, fulfilling lifestyle.',
    benefits: ['Holistic health improvement', 'Better work-life balance', 'Enhanced quality of life', 'Preventive health focus'],
    relatedTopics: ['Self-Care', 'Balance', 'Holistic Health', 'Wellbeing', 'Lifestyle']
  },
  'prevention': {
    name: 'Prevention',
    icon: '🛡️',
    intro: 'Prevention is better than cure. Our prevention articles focus on strategies, screenings, and lifestyle choices that can help you avoid health problems before they start and maintain optimal health throughout your life.',
    benefits: ['Reduced disease risk', 'Lower healthcare costs', 'Longer healthy life', 'Better quality of life'],
    relatedTopics: ['Screening', 'Vaccines', 'Risk Factors', 'Health Checkups', 'Early Detection']
  },
  'lifestyle': {
    name: 'Lifestyle',
    icon: '🌟',
    intro: 'Your daily habits and choices significantly impact your health outcomes. Our lifestyle articles cover sleep, work-life balance, healthy habits, productivity, and making sustainable changes for long-term health.',
    benefits: ['Sustainable health habits', 'Improved sleep quality', 'Better productivity', 'Enhanced daily wellbeing'],
    relatedTopics: ['Sleep', 'Habits', 'Work-Life Balance', 'Healthy Living', 'Daily Routine']
  }
}

export default function BlogCategory() {
  const { t } = useTranslation()
  const { category } = useParams()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })

  // Normalize category from URL
  const categorySlug = category?.toLowerCase() || ''
  const categoryData = categoryInfo[categorySlug] || {
    name: category?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Health',
    icon: '📚',
    intro: `Explore our collection of health articles about ${category?.replace(/-/g, ' ')}.`,
    benefits: [],
    relatedTopics: []
  }

  useEffect(() => {
    loadBlogs(1, true)
  }, [category])

  const loadBlogs = async (page = 1, reset = false) => {
    if (reset) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const response = await blogAPI.getBlogs({
        category: categoryData.name,
        page,
        limit: 12
      })

      if (reset) {
        setBlogs(response.data.blogs)
      } else {
        setBlogs(prev => [...prev, ...response.data.blogs])
      }
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Failed to load blogs:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    loadBlogs(pagination.page + 1)
  }

  return (
    <>
      {/* SEO Component */}
      <CategorySeo category={categoryData.name} blogCount={pagination.total} />

      <div className="min-h-screen">
        {/* Hero Section with SEO Content */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-12">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav 
              className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
              aria-label="Breadcrumb"
            >
              <Link to="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/blogs" className="hover:text-foreground">Health Blog</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{categoryData.name}</span>
            </nav>

            {/* Category Header */}
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{categoryData.icon}</span>
                <h1 className="text-4xl md:text-5xl font-bold">
                  {categoryData.name} <span className="gradient-text">Articles</span>
                </h1>
              </div>
              
              {/* SEO Intro Text */}
              <p className="text-lg text-muted-foreground mb-6">
                {categoryData.intro}
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full">
                  <BookOpen className="w-4 h-4" />
                  {pagination.total} articles
                </span>
                {categoryData.relatedTopics.slice(0, 3).map(topic => (
                  <Link
                    key={topic}
                    to={`/blogs?tag=${encodeURIComponent(topic.toLowerCase())}`}
                    className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                  >
                    <Tag className="w-3 h-3" />
                    {topic}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SEO Benefits Section */}
        {categoryData.benefits.length > 0 && (
          <section className="py-8 border-b">
            <div className="container mx-auto px-4">
              <h2 className="text-xl font-semibold mb-4">
                Why Read About {categoryData.name}?
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {categoryData.benefits.map((benefit, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="text-health-500">✓</span>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Blog Listing */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">
              Latest {categoryData.name} Articles
            </h2>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No articles yet</h3>
                <p className="text-muted-foreground mb-6">
                  We're working on adding more content in this category.
                </p>
                <Button asChild>
                  <Link to="/blogs">Browse All Articles</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((blog, i) => (
                    <motion.div
                      key={blog._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <BlogCard blog={blog} index={i} />
                    </motion.div>
                  ))}
                </div>

                {/* Load More */}
                {pagination.page < pagination.pages && (
                  <div className="text-center mt-12">
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      loading={loadingMore}
                    >
                      {loadingMore ? 'Loading...' : 'Load More Articles'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Internal Linking Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Explore More Health Content</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Other Categories */}
              {Object.entries(categoryInfo)
                .filter(([slug]) => slug !== categorySlug)
                .slice(0, 3)
                .map(([slug, info]) => (
                  <Link
                    key={slug}
                    to={`/blogs/category/${slug}`}
                    className="p-4 bg-card rounded-xl border hover:shadow-md transition-all"
                  >
                    <span className="text-2xl mb-2 block">{info.icon}</span>
                    <h3 className="font-semibold">{info.name} Articles</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {info.intro.substring(0, 80)}...
                    </p>
                  </Link>
                ))}
              
              {/* AI Tools Link */}
              <Link
                to="/ai-health-report-analyzer"
                className="p-4 bg-gradient-to-br from-health-500/10 to-mint-500/10 rounded-xl border hover:shadow-md transition-all"
              >
                <FileSearch className="w-8 h-8 text-health-500 mb-2" />
                <h3 className="font-semibold">AI Report Analyzer</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload and analyze your health reports with AI
                </p>
              </Link>
            </div>

            {/* All Categories Link */}
            <div className="text-center">
              <Link to="/blogs" className="text-primary hover:underline">
                View all health articles →
              </Link>
            </div>
          </div>
        </section>

        {/* Medical Disclaimer */}
        <section className="py-8 bg-amber-50 dark:bg-amber-900/10 border-y border-amber-200 dark:border-amber-800">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>⚕️ Medical Disclaimer:</strong> The articles in this category are for informational 
              purposes only and do not constitute medical advice. Always consult a qualified healthcare 
              provider for medical concerns.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

