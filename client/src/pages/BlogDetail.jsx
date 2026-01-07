import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Clock, Eye, Heart, Bookmark, Share2, ArrowLeft,
  Calendar, User, MessageCircle, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { UserAvatar } from '@/components/ui/Avatar'
import { Skeleton } from '@/components/ui/Skeleton'
import BlogCard from '@/components/blog/BlogCard'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { blogAPI, authAPI, commentAPI } from '@/services/api'
import { formatDate, copyToClipboard } from '@/lib/utils'

export default function BlogDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const toast = useToast()

  const [blog, setBlog] = useState(null)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    loadBlog()
  }, [slug])

  const loadBlog = async () => {
    setLoading(true)
    try {
      const response = await blogAPI.getBlog(slug)
      setBlog(response.data.blog)
      setLiked(response.data.userInteraction?.liked || false)
      setLikesCount(response.data.blog.likes?.length || 0)

      // Load related blogs
      const relatedResponse = await blogAPI.getRelatedBlogs(response.data.blog._id)
      setRelatedBlogs(relatedResponse.data.blogs)

      // Load comments
      const commentsResponse = await commentAPI.getComments(response.data.blog._id)
      setComments(commentsResponse.data.comments)

      // Check if bookmarked
      if (isAuthenticated) {
        const bookmarksResponse = await authAPI.getBookmarks()
        const isBookmarked = bookmarksResponse.data.bookmarks.some(
          b => b._id === response.data.blog._id
        )
        setBookmarked(isBookmarked)
      }

    } catch (error) {
      toast.error('Failed to load article')
      navigate('/blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to like articles')
      return
    }

    try {
      const response = await blogAPI.toggleLike(blog._id)
      setLiked(response.data.liked)
      setLikesCount(response.data.likesCount)
    } catch (error) {
      toast.error('Failed to update like')
    }
  }

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to bookmark articles')
      return
    }

    try {
      const response = await authAPI.toggleBookmark(blog._id)
      setBookmarked(response.data.isBookmarked)
      toast.success(response.data.message)
    } catch (error) {
      toast.error('Failed to update bookmark')
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    const success = await copyToClipboard(url)
    if (success) {
      toast.success('Link copied to clipboard!')
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    if (!isAuthenticated) {
      toast.info('Please log in to comment')
      return
    }

    setSubmittingComment(true)
    try {
      const response = await commentAPI.createComment(blog._id, {
        content: newComment.trim()
      })
      setComments(prev => [response.data.comment, ...prev])
      setNewComment('')
      toast.success('Comment added!')
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-6 w-64 mb-8" />
        <Skeleton className="h-96 w-full rounded-2xl mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  if (!blog) return null

  return (
    <article className="pb-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-muted/50 to-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link 
            to="/blogs"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/blogs" className="hover:text-foreground">Blog</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{blog.category}</span>
          </nav>

          {/* Category Badge */}
          <Badge className="mb-4">{blog.category}</Badge>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
          >
            {blog.title}
          </motion.h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <UserAvatar user={blog.author} size="sm" />
              <span>{blog.author?.name}</span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(blog.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {blog.readingTime} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {blog.views} views
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant={liked ? 'default' : 'outline'}
              size="sm"
              onClick={handleLike}
              className={liked ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              {likesCount}
            </Button>
            <Button
              variant={bookmarked ? 'default' : 'outline'}
              size="sm"
              onClick={handleBookmark}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              {bookmarked ? 'Saved' : 'Save'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="container mx-auto px-4 max-w-4xl -mt-4">
        <motion.img
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div 
          className="blog-content prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/blogs?tag=${tag}`}
                  className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-primary/10 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        <div className="mt-12 p-6 bg-muted/50 rounded-2xl">
          <div className="flex items-start gap-4">
            <UserAvatar user={blog.author} size="lg" />
            <div>
              <h3 className="font-semibold text-lg">{blog.author?.name}</h3>
              <p className="text-muted-foreground mt-1">
                {blog.author?.bio || 'Health content writer at HealthAI'}
              </p>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={isAuthenticated ? "Share your thoughts..." : "Log in to comment"}
              className="w-full p-4 rounded-xl border bg-background resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={!isAuthenticated || submittingComment}
            />
            <div className="flex justify-end mt-3">
              <Button
                type="submit"
                disabled={!isAuthenticated || !newComment.trim() || submittingComment}
                loading={submittingComment}
              >
                Post Comment
              </Button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className="flex gap-4">
                  <UserAvatar user={comment.author} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.author?.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                      {comment.isEdited && (
                        <span className="text-xs text-muted-foreground">(edited)</span>
                      )}
                    </div>
                    <p className="text-muted-foreground">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBlogs.map((blog, i) => (
                <BlogCard key={blog._id} blog={blog} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

