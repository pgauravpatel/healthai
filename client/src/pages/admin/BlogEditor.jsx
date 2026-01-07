import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Save, Eye, Image, Tag, FileText,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { blogAPI } from '@/services/api'

const CATEGORIES = [
  'Fitness',
  'Mental Health',
  'Diet',
  'Diseases',
  'Wellness',
  'Prevention',
  'Lifestyle'
]

export default function BlogEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const toast = useToast()

  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Wellness',
    tags: '',
    coverImage: '',
    isPublished: false,
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: ''
    }
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
      return
    }
    if (isEditing) {
      loadBlog()
    }
  }, [isAdmin, id])

  const loadBlog = async () => {
    setLoading(true)
    try {
      const response = await blogAPI.getAdminBlog(id)
      const blog = response.data.blog
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        excerpt: blog.excerpt || '',
        category: blog.category || 'Wellness',
        tags: (blog.tags || []).join(', '),
        coverImage: blog.coverImage || '',
        isPublished: blog.isPublished || false,
        seo: {
          metaTitle: blog.seo?.metaTitle || '',
          metaDescription: blog.seo?.metaDescription || '',
          keywords: (blog.seo?.keywords || []).join(', ')
        }
      })
    } catch (error) {
      toast.error('Failed to load blog')
      navigate('/admin')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.startsWith('seo.')) {
      const seoField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        seo: { ...prev.seo, [seoField]: value }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.content.trim()) newErrors.content = 'Content is required'
    if (!formData.category) newErrors.category = 'Category is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        seo: {
          ...formData.seo,
          keywords: formData.seo.keywords.split(',').map(k => k.trim()).filter(Boolean)
        }
      }

      if (isEditing) {
        await blogAPI.updateBlog(id, data)
        toast.success('Blog updated successfully!')
      } else {
        await blogAPI.createBlog(data)
        toast.success('Blog created successfully!')
      }
      
      navigate('/admin')
    } catch (error) {
      toast.error(error.message || 'Failed to save blog')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link 
              to="/admin"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Edit Article' : 'New Article'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="rounded"
              />
              Publish
            </label>
            <Button onClick={handleSubmit} loading={saving} variant="gradient">
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Content Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter article title"
                  error={errors.title}
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Brief summary of the article (auto-generated if empty)"
                  className="w-full p-3 rounded-xl border bg-background resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={500}
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">Content * (HTML supported)</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your article content here... HTML tags like <h2>, <p>, <ul>, <li> are supported."
                  className={`w-full p-4 rounded-xl border bg-background resize-none h-96 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.content ? 'border-destructive' : ''}`}
                />
                {errors.content && (
                  <p className="text-xs text-destructive mt-1">{errors.content}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <Input
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="health, wellness, fitness (comma separated)"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium mb-2">Cover Image URL</label>
                <Input
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  icon={Image}
                />
                {formData.coverImage && (
                  <img
                    src={formData.coverImage}
                    alt="Preview"
                    className="mt-3 h-40 w-full object-cover rounded-xl"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* SEO Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Meta Title</label>
                <Input
                  name="seo.metaTitle"
                  value={formData.seo.metaTitle}
                  onChange={handleChange}
                  placeholder="SEO optimized title (max 60 characters)"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.seo.metaTitle.length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Meta Description</label>
                <textarea
                  name="seo.metaDescription"
                  value={formData.seo.metaDescription}
                  onChange={handleChange}
                  placeholder="Brief description for search engines (max 160 characters)"
                  className="w-full p-3 rounded-xl border bg-background resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.seo.metaDescription.length}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Keywords</label>
                <Input
                  name="seo.keywords"
                  value={formData.seo.keywords}
                  onChange={handleChange}
                  placeholder="seo, keywords, health (comma separated)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button (Mobile) */}
          <div className="flex justify-end gap-3 md:hidden">
            <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
              Cancel
            </Button>
            <Button type="submit" loading={saving} variant="gradient">
              <Save className="w-4 h-4" />
              Save Article
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

