import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bookmark, ArrowLeft } from 'lucide-react'
import BlogCard from '@/components/blog/BlogCard'
import { BlogCardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { authAPI } from '@/services/api'

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookmarks()
  }, [])

  const loadBookmarks = async () => {
    try {
      const response = await authAPI.getBookmarks()
      setBookmarks(response.data.bookmarks)
    } catch (error) {
      console.error('Failed to load bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link 
          to="/profile"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>

        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Bookmark className="w-8 h-8" />
          Saved Articles
        </h1>
        <p className="text-muted-foreground mt-2">
          Your bookmarked health articles for quick reference
        </p>
      </motion.div>

      {/* Bookmarks Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Bookmark className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No saved articles yet</h2>
          <p className="text-muted-foreground mb-6">
            Start exploring and save articles you want to read later
          </p>
          <Button asChild>
            <Link to="/blogs">Browse Articles</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((blog, index) => (
            <BlogCard key={blog._id} blog={blog} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}

