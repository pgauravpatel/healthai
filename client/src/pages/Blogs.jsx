import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, X, Languages } from 'lucide-react'
import BlogCard from '@/components/blog/BlogCard'
import BlogFilter from '@/components/blog/BlogFilter'
import { BlogCardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import Seo from '@/components/seo/Seo'
import { blogAPI } from '@/services/api'
import { debounce } from '@/lib/utils'

/**
 * Blogs Page with Multilingual Search (Vinmec-style SEO)
 * 
 * Features:
 * - Hindi search matches English blogs via intent keywords
 * - Translation banner for non-English searches
 * - Semantic search with language detection
 */
export default function Blogs() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  
  // Multilingual search state
  const [searchLanguage, setSearchLanguage] = useState('en')
  const [showTranslationBanner, setShowTranslationBanner] = useState(false)
  const [searchConfidence, setSearchConfidence] = useState(0)

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
      let response

      // Use semantic search for search queries
      if (search && search.trim().length >= 2) {
        response = await blogAPI.semanticSearch(search, {
          page,
          limit: 9
        })
        
        // Update language detection state
        setSearchLanguage(response.data.matchedIntentLanguage || 'en')
        setSearchConfidence(response.data.confidenceScore || 0)
        setShowTranslationBanner(response.data.showTranslationBanner || false)
      } else {
        // Standard listing with optional category filter
        response = await blogAPI.getBlogs({
          page,
          limit: 9,
          category
        })
        
        // Reset language state for non-search queries
        setSearchLanguage('en')
        setShowTranslationBanner(false)
      }

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

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchParams(prev => {
        if (value) {
          prev.set('search', value)
        } else {
          prev.delete('search')
        }
        return prev
      })
    }, 500),
    []
  )

  const handleSearchChange = (value) => {
    debouncedSearch(value)
  }

  const handleCategoryChange = (value) => {
    setSearchParams(prev => {
      if (value) {
        prev.set('category', value)
      } else {
        prev.delete('category')
      }
      // Clear search when changing category
      prev.delete('search')
      return prev
    })
  }

  const handleClear = () => {
    setSearchParams({})
    setShowTranslationBanner(false)
    setSearchLanguage('en')
  }

  const handleLoadMore = () => {
    loadBlogs(pagination.page + 1)
  }

  const dismissTranslationBanner = () => {
    setShowTranslationBanner(false)
  }

  // Language display names
  const languageDisplayNames = {
    hi: 'Hindi (हिंदी)',
    hinglish: 'Hinglish',
    en: 'English'
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
              <span className="block text-sm mt-2">
                🌐 Search in English, हिंदी, or Hinglish
              </span>
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

          {/* Translation Banner (Vinmec-style) */}
          <AnimatePresence>
            {showTranslationBanner && searchLanguage !== 'en' && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Languages className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        {searchLanguage === 'hi' 
                          ? 'आपने हिंदी में खोजा है' 
                          : 'You searched in Hinglish'}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        These articles are in English. You can use your browser's translate feature 
                        (Right-click → Translate to {searchLanguage === 'hi' ? 'Hindi' : 'your language'}) 
                        to read in your preferred language.
                      </p>
                      {searchLanguage === 'hi' && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2" lang="hi">
                          ये लेख अंग्रेजी में हैं। आप इन्हें हिंदी में पढ़ने के लिए ब्राउज़र के अनुवाद फीचर का उपयोग कर सकते हैं।
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={dismissTranslationBanner}
                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full shrink-0"
                    aria-label="Dismiss"
                  >
                    <X className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <BlogFilter
              search={search}
              onSearchChange={handleSearchChange}
              category={category}
              onCategoryChange={handleCategoryChange}
              onClear={handleClear}
              searchLanguage={searchLanguage}
              showLanguageHint={search && searchLanguage !== 'en'}
            />
          </motion.div>

          {/* Results Count with Language Info */}
          {!loading && (
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <p>
                {pagination.total} article{pagination.total !== 1 ? 's' : ''} found
              </p>
              {search && searchLanguage !== 'en' && searchConfidence > 0.5 && (
                <span className="flex items-center gap-1 text-sm bg-muted px-2 py-0.5 rounded-full">
                  <Globe className="w-3 h-3" />
                  {languageDisplayNames[searchLanguage]}
                </span>
              )}
            </div>
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
              <p className="text-muted-foreground mb-4">
                {searchLanguage !== 'en' ? (
                  <>
                    No results for your {languageDisplayNames[searchLanguage]} search.
                    <br />
                    Try different keywords or search in English.
                  </>
                ) : (
                  'Try adjusting your filters or search terms'
                )}
              </p>
              {searchLanguage === 'hi' && (
                <p className="text-sm text-muted-foreground mb-6" lang="hi">
                  कोई परिणाम नहीं मिला। कृपया अलग शब्दों से खोजें।
                </p>
              )}
              <Button onClick={handleClear}>Clear Filters</Button>
            </motion.div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog, index) => (
                  <BlogCard 
                    key={blog._id} 
                    blog={blog} 
                    index={index}
                    showRelevance={search && searchLanguage !== 'en' && blog.relevanceScore}
                  />
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

          {/* Hindi Search Tips Section */}
          {!loading && !search && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-16 p-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/30"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">🇮🇳</span>
                हिंदी में खोजें (Search in Hindi)
              </h2>
              <p className="text-muted-foreground mb-4">
                You can search for health topics in Hindi or Hinglish. Our semantic search will find relevant English articles for you.
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { query: 'पेट दर्द', label: 'Stomach Pain' },
                  { query: 'सिर दर्द', label: 'Headache' },
                  { query: 'खुजली', label: 'Itching' },
                  { query: 'बुखार', label: 'Fever' },
                  { query: 'pet mein gas', label: 'Gas Problem' },
                  { query: 'neend nahi aati', label: 'Sleep Issues' }
                ].map((item) => (
                  <button
                    key={item.query}
                    onClick={() => {
                      setSearchParams({ search: item.query })
                    }}
                    className="text-left p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow border"
                  >
                    <span className="block font-medium" lang="hi">{item.query}</span>
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </>
  )
}
