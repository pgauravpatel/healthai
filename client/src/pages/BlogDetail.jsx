import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
import BlogSeo from '@/components/seo/BlogSeo'
import BlogFAQ, { generateFAQs } from '@/components/blog/BlogFAQ'
import AuthorBio, { BlogDisclaimer, RelatedContent } from '@/components/blog/AuthorBio'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { blogAPI, authAPI, commentAPI } from '@/services/api'
import { formatDate, copyToClipboard } from '@/lib/utils'

export default function BlogDetail() {
  const { t } = useTranslation()
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

  // Generate FAQs for schema
  const faqs = blog ? generateFAQs(blog.category, blog.title) : []

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

  // Category slug for internal linking
  const categorySlug = blog.category.toLowerCase().replace(/\s+/g, '-')

  return (
    <>
      {/* SEO Component with all meta tags and schemas */}
      <BlogSeo blog={blog} faqs={faqs} />

      <article className="pb-16" itemScope itemType="https://schema.org/BlogPosting">
        {/* Hidden semantic data for SEO */}
        <meta itemProp="headline" content={blog.title} />
        <meta itemProp="datePublished" content={blog.publishedAt || blog.createdAt} />
        <meta itemProp="dateModified" content={blog.updatedAt} />
        <meta itemProp="author" content={blog.author?.name || 'Health Scan Team'} />
        
        {/* Header */}
        <header className="bg-gradient-to-b from-muted/50 to-background py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Back Button */}
            <Link 
              to="/blogs"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Breadcrumb Navigation - SEO Important */}
            <nav 
              className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
              aria-label="Breadcrumb"
              itemScope
              itemType="https://schema.org/BreadcrumbList"
            >
              <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link to="/" className="hover:text-foreground" itemProp="item">
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </span>
              <ChevronRight className="w-4 h-4" />
              <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link to="/blogs" className="hover:text-foreground" itemProp="item">
                  <span itemProp="name">Blog</span>
                </Link>
                <meta itemProp="position" content="2" />
              </span>
              <ChevronRight className="w-4 h-4" />
              <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link 
                  to={`/blogs/category/${categorySlug}`} 
                  className="hover:text-foreground"
                  itemProp="item"
                >
                  <span itemProp="name">{blog.category}</span>
                </Link>
                <meta itemProp="position" content="3" />
              </span>
              <ChevronRight className="w-4 h-4" />
              <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span className="text-foreground" itemProp="name">{blog.title}</span>
                <meta itemProp="position" content="4" />
              </span>
            </nav>

            {/* Category Badge - Internal Link */}
            <Link to={`/blogs/category/${categorySlug}`}>
              <Badge className="mb-4 hover:bg-primary/80 transition-colors">
                {blog.category}
              </Badge>
            </Link>

            {/* Title - Single H1 for SEO */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
              itemProp="headline"
            >
              {blog.title}
            </motion.h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
              <div className="flex items-center gap-2" itemProp="author" itemScope itemType="https://schema.org/Person">
                <UserAvatar user={blog.author} size="sm" />
                <span itemProp="name">{blog.author?.name || 'Health Scan Team'}</span>
              </div>
              <time 
                dateTime={blog.publishedAt || blog.createdAt}
                className="flex items-center gap-1"
                itemProp="datePublished"
              >
                <Calendar className="w-4 h-4" />
                {formatDate(blog.publishedAt)}
              </time>
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
                aria-label={liked ? 'Unlike article' : 'Like article'}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                {likesCount}
              </Button>
              <Button
                variant={bookmarked ? 'default' : 'outline'}
                size="sm"
                onClick={handleBookmark}
                aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                {bookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                aria-label="Share article"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </header>

        {/* Cover Image - Optimized for SEO */}
        <div className="container mx-auto px-4 max-w-4xl -mt-4">
          <motion.figure
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <img
              src={blog.coverImage}
              alt={`${blog.title} - Health Scan Blog`}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
              loading="eager"
              itemProp="image"
              width="800"
              height="400"
            />
          </motion.figure>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 max-w-4xl py-12">
          {/* Article Content - Semantic HTML */}
          <div 
            className="blog-content prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h3:text-xl"
            dangerouslySetInnerHTML={{ __html: blog.content }}
            itemProp="articleBody"
          />

          {/* Tags - Internal Links */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h2 className="text-sm font-medium text-muted-foreground mb-3">Related Topics</h2>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map(tag => (
                  <Link
                    key={tag}
                    to={`/blogs?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                    rel="tag"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio & Trust Signals */}
          <AuthorBio 
            author={blog.author}
            publishedAt={blog.publishedAt || blog.createdAt}
            updatedAt={blog.updatedAt}
            readingTime={blog.readingTime}
          />

          {/* Medical Disclaimer */}
          <BlogDisclaimer />

          {/* FAQ Section - Auto-generated for SEO */}
          <BlogFAQ 
            faqs={faqs}
            category={blog.category}
            title={blog.title}
          />

          {/* Internal Linking - Related Content */}
          <RelatedContent 
            category={blog.category}
            currentBlogId={blog._id}
          />

          {/* Comments Section */}
          <section className="mt-12" aria-labelledby="comments-heading">
            <h2 id="comments-heading" className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Comments ({comments.length})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-8">
              <label htmlFor="comment-input" className="sr-only">Write a comment</label>
              <textarea
                id="comment-input"
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
                        <time className="text-xs text-muted-foreground" dateTime={comment.createdAt}>
                          {formatDate(comment.createdAt)}
                        </time>
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
          </section>
        </div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <aside className="bg-muted/30 py-16" aria-labelledby="related-articles">
            <div className="container mx-auto px-4">
              <h2 id="related-articles" className="text-2xl font-bold mb-8">
                Related Articles in {blog.category}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedBlogs.map((relatedBlog, i) => (
                  <BlogCard key={relatedBlog._id} blog={relatedBlog} index={i} />
                ))}
              </div>
              
              {/* Internal Link to Category */}
              <div className="text-center mt-8">
                <Link 
                  to={`/blogs/category/${categorySlug}`}
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  View all {blog.category} articles
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>
        )}
      </article>
    </>
  )
}
