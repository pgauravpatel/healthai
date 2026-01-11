import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import BlogCard from '@/components/blog/BlogCard'
import BlogFilter from '@/components/blog/BlogFilter'
import { BlogCardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import Seo from '@/components/seo/Seo'
import { blogAPI } from '@/services/api'
import { debounce } from '@/lib/utils'

export default function Blogs() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''

  useEffect(() => {
    loadBlogs(1, true)
  }, [search, category])

  const loadBlogs = async (page = 1, reset = false) => {
    if (reset) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const response = await blogAPI.getBlogs({
        page,
        limit: 9,
        search,
        category
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

  const handleSearchChange = debounce((value) => {
    setSearchParams(prev => {
      if (value) {
        prev.set('search', value)
      } else {
        prev.delete('search')
      }
      return prev
    })
  }, 500)

  const handleCategoryChange = (value) => {
    setSearchParams(prev => {
      if (value) {
        prev.set('category', value)
      } else {
        prev.delete('category')
      }
      return prev
    })
  }

  const handleClear = () => {
    setSearchParams({})
  }

  const handleLoadMore = () => {
    loadBlogs(pagination.page + 1)
  }

  return (
    <>
      <Seo
        title={t('seo.blogTitle')}
        description={t('seo.blogDescription')}
        keywords={t('seo.blogKeywords')}
        canonicalUrl="/blogs"
      />
      <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Health <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Expert articles on fitness, nutrition, mental health, and wellness 
            to help you live your healthiest life.
          </p>
          
          {/* Category Quick Links - SEO Internal Linking */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { slug: 'fitness', label: '💪 Fitness', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
              { slug: 'mental-health', label: '🧠 Mental Health', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
              { slug: 'diet', label: '🥗 Diet', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
              { slug: 'diseases', label: '🏥 Diseases', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
              { slug: 'wellness', label: '✨ Wellness', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400' },
              { slug: 'prevention', label: '🛡️ Prevention', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
              { slug: 'lifestyle', label: '🌟 Lifestyle', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400' },
            ].map(cat => (
              <Link
                key={cat.slug}
                to={`/blogs/category/${cat.slug}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-opacity hover:opacity-80 ${cat.color}`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <BlogFilter
            search={search}
            onSearchChange={(value) => {
              // Update input immediately but debounce the URL change
              handleSearchChange(value)
            }}
            category={category}
            onCategoryChange={handleCategoryChange}
            onClear={handleClear}
          />
        </motion.div>

        {/* Results Count */}
        {!loading && (
          <p className="text-muted-foreground mb-6">
            {pagination.total} article{pagination.total !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Blog Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold mb-2">No articles found</h2>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={handleClear}>Clear Filters</Button>
          </motion.div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, index) => (
                <BlogCard key={blog._id} blog={blog} index={index} />
              ))}
            </div>

            {/* Load More */}
            {pagination.page < pagination.pages && (
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  size="lg"
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
    </div>
    </>
  )
}

