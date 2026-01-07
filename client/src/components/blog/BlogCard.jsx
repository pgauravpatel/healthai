import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Heart, Bookmark, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { UserAvatar } from '@/components/ui/Avatar'
import { formatDate } from '@/lib/utils'

export default function BlogCard({ blog, index = 0 }) {
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
      transition={{ delay: index * 0.1 }}
      className="health-card overflow-hidden group"
    >
      <Link to={`/blogs/${blog.slug}`}>
        {/* Cover Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[blog.category] || 'bg-gray-100 text-gray-800'}`}>
              {blog.category}
            </span>
          </div>

          {/* Reading Time */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1 text-white text-sm">
            <Clock className="w-4 h-4" />
            {blog.readingTime} min read
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h2 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {blog.title}
          </h2>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {blog.excerpt}
          </p>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag}
                  className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Author & Stats */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <UserAvatar user={blog.author} size="sm" />
              <div className="text-sm">
                <p className="font-medium">{blog.author?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(blog.publishedAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="flex items-center gap-1 text-xs">
                <Eye className="w-4 h-4" />
                {blog.views || 0}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Heart className="w-4 h-4" />
                {blog.likes?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

