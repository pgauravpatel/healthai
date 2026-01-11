import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Heart, Eye } from 'lucide-react'
import { UserAvatar } from '@/components/ui/Avatar'
import { formatDate } from '@/lib/utils'

/**
 * BlogCard Component
 * SEO-optimized blog card with lazy loading images
 */
export default function BlogCard({ blog, index = 0, priority = false }) {
  const categorySlug = blog.category?.toLowerCase().replace(/\s+/g, '-')
  
  const categoryColors = {
    'Fitness': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'Mental Health': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'Diet': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Diseases': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'Wellness': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
    'Prevention': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    'Lifestyle': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400'
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="health-card overflow-hidden group"
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      {/* Hidden meta for SEO */}
      <meta itemProp="headline" content={blog.title} />
      <meta itemProp="datePublished" content={blog.publishedAt || blog.createdAt} />
      {blog.author?.name && <meta itemProp="author" content={blog.author.name} />}
      
      <Link to={`/blogs/${blog.slug}`}>
        {/* Cover Image - Lazy loaded with dimensions for CLS prevention */}
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={blog.coverImage}
            alt={`${blog.title} - ${blog.category} article on HealthAI`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            width="400"
            height="192"
            itemProp="image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Category Badge - Internal Link */}
          <div className="absolute top-4 left-4">
            <Link 
              to={`/blogs/category/${categorySlug}`}
              onClick={(e) => e.stopPropagation()}
              className={`px-3 py-1 rounded-full text-xs font-medium hover:opacity-80 transition-opacity ${categoryColors[blog.category] || 'bg-gray-100 text-gray-800'}`}
            >
              {blog.category}
            </Link>
          </div>

          {/* Reading Time */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1 text-white text-sm">
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>{blog.readingTime} min read</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title - H3 for proper heading hierarchy */}
          <h3 
            className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2"
            itemProp="name"
          >
            {blog.title}
          </h3>
          
          {/* Excerpt */}
          <p 
            className="text-sm text-muted-foreground line-clamp-2 mb-4"
            itemProp="description"
          >
            {blog.excerpt}
          </p>

          {/* Tags - Internal Links */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag}
                  to={`/blogs?tag=${encodeURIComponent(tag)}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                  rel="tag"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Author & Stats */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div 
              className="flex items-center gap-2"
              itemProp="author"
              itemScope
              itemType="https://schema.org/Person"
            >
              <UserAvatar user={blog.author} size="sm" />
              <div className="text-sm">
                <p className="font-medium" itemProp="name">
                  {blog.author?.name || 'HealthAI Team'}
                </p>
                <time 
                  className="text-xs text-muted-foreground"
                  dateTime={blog.publishedAt || blog.createdAt}
                  itemProp="datePublished"
                >
                  {formatDate(blog.publishedAt)}
                </time>
              </div>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="flex items-center gap-1 text-xs" aria-label={`${blog.views || 0} views`}>
                <Eye className="w-4 h-4" aria-hidden="true" />
                {blog.views || 0}
              </span>
              <span className="flex items-center gap-1 text-xs" aria-label={`${blog.likes?.length || 0} likes`}>
                <Heart className="w-4 h-4" aria-hidden="true" />
                {blog.likes?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
