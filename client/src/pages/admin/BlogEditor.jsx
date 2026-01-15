import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Save, Eye, Image, Tag, FileText,
  Loader2, Globe, Languages, Plus, Trash2, AlertCircle,
  CheckCircle, Stethoscope, Code, FormInput
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

const MEDICAL_CATEGORIES = [
  'Digestive Health',
  'Skin Care',
  'Mental Wellness',
  'Cardiovascular',
  'Respiratory',
  'Musculoskeletal',
  'Nutrition',
  'Women Health',
  'Men Health',
  'Child Health',
  'General Wellness',
  'Infectious Diseases',
  'Other'
]

/**
 * Blog Editor with Multilingual SEO Support
 * 
 * Features:
 * - Hindi intent keywords for Vinmec-style SEO
 * - Bilingual FAQ for rich results
 * - Medical category and symptoms
 * - Auto-generated slug preview
 * - SEO score calculator
 */
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
    medicalCategory: 'General Wellness',
    tags: '',
    coverImage: '',
    isPublished: false,
    
    // Multilingual Intent Keywords
    intentKeywords: {
      en: '',
      hi: '',
      hinglish: ''
    },
    
    // Symptoms for medical search
    symptoms: '',
    
    // English SEO
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      // Hindi SEO
      hindiMeta: {
        title: '',
        description: '',
        keywords: ''
      }
    },
    
    // Bilingual FAQ
    faq: [],
    
    // Medical Review
    medicalReviewed: false,
    reviewedBy: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [seoScore, setSeoScore] = useState(0)
  
  // JSON Import Mode
  const [editorMode, setEditorMode] = useState('form') // 'form' | 'json'
  const [jsonInput, setJsonInput] = useState('')
  const [jsonError, setJsonError] = useState('')

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
      return
    }
    if (isEditing) {
      loadBlog()
    }
  }, [isAdmin, id])

  // Calculate SEO score whenever form data changes
  useEffect(() => {
    calculateSeoScore()
  }, [formData])

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
        medicalCategory: blog.medicalCategory || 'General Wellness',
        tags: (blog.tags || []).join(', '),
        coverImage: blog.coverImage || '',
        isPublished: blog.isPublished || false,
        
        intentKeywords: {
          en: (blog.intentKeywords?.en || []).join(', '),
          hi: (blog.intentKeywords?.hi || []).join(', '),
          hinglish: (blog.intentKeywords?.hinglish || []).join(', ')
        },
        
        symptoms: (blog.symptoms || []).join(', '),
        
        seo: {
          metaTitle: blog.seo?.metaTitle || '',
          metaDescription: blog.seo?.metaDescription || '',
          keywords: (blog.seo?.keywords || []).join(', '),
          hindiMeta: {
            title: blog.seo?.hindiMeta?.title || '',
            description: blog.seo?.hindiMeta?.description || '',
            keywords: (blog.seo?.hindiMeta?.keywords || []).join(', ')
          }
        },
        
        faq: blog.faq || [],
        
        medicalReviewed: blog.medicalReviewed || false,
        reviewedBy: blog.reviewedBy || ''
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
    
    if (name.startsWith('seo.hindiMeta.')) {
      const field = name.split('.')[2]
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          hindiMeta: { ...prev.seo.hindiMeta, [field]: value }
        }
      }))
    } else if (name.startsWith('seo.')) {
      const seoField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        seo: { ...prev.seo, [seoField]: value }
      }))
    } else if (name.startsWith('intentKeywords.')) {
      const lang = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        intentKeywords: { ...prev.intentKeywords, [lang]: value }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  // FAQ handlers
  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faq: [...prev.faq, { question_en: '', answer_en: '', question_hi: '', answer_hi: '' }]
    }))
  }

  const updateFaq = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      faq: prev.faq.map((item, i) => i === index ? { ...item, [field]: value } : item)
    }))
  }

  const removeFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index)
    }))
  }

  // Calculate SEO score
  const calculateSeoScore = () => {
    let score = 0
    const checks = []

    // Title (20 points)
    if (formData.title.length >= 30 && formData.title.length <= 60) {
      score += 20
      checks.push({ label: 'Title length optimal', pass: true })
    } else {
      checks.push({ label: 'Title should be 30-60 chars', pass: false })
    }

    // Meta description (15 points)
    if (formData.seo.metaDescription.length >= 120 && formData.seo.metaDescription.length <= 160) {
      score += 15
      checks.push({ label: 'Meta description optimal', pass: true })
    } else {
      checks.push({ label: 'Meta description should be 120-160 chars', pass: false })
    }

    // Hindi intent keywords (20 points)
    if (formData.intentKeywords.hi.length > 10) {
      score += 20
      checks.push({ label: 'Hindi keywords added', pass: true })
    } else {
      checks.push({ label: 'Add Hindi intent keywords for ranking', pass: false })
    }

    // Symptoms (10 points)
    if (formData.symptoms.length > 5) {
      score += 10
      checks.push({ label: 'Symptoms added', pass: true })
    } else {
      checks.push({ label: 'Add symptoms for medical search', pass: false })
    }

    // FAQ (15 points)
    if (formData.faq.length >= 3) {
      score += 15
      checks.push({ label: 'FAQs added (3+)', pass: true })
    } else {
      checks.push({ label: 'Add at least 3 FAQs', pass: false })
    }

    // Hindi FAQ (10 points)
    const hasHindiFaq = formData.faq.some(f => f.question_hi && f.answer_hi)
    if (hasHindiFaq) {
      score += 10
      checks.push({ label: 'Hindi FAQs added', pass: true })
    } else {
      checks.push({ label: 'Add Hindi FAQ translations', pass: false })
    }

    // Content length (10 points)
    const wordCount = formData.content.split(/\s+/).length
    if (wordCount >= 800) {
      score += 10
      checks.push({ label: 'Content length optimal (800+ words)', pass: true })
    } else {
      checks.push({ label: `Content should be 800+ words (current: ${wordCount})`, pass: false })
    }

    setSeoScore({ score, checks })
  }

  // Generate slug preview
  const slugPreview = formData.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 60)

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
        symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(Boolean),
        intentKeywords: {
          en: formData.intentKeywords.en.split(',').map(k => k.trim()).filter(Boolean),
          hi: formData.intentKeywords.hi.split(',').map(k => k.trim()).filter(Boolean),
          hinglish: formData.intentKeywords.hinglish.split(',').map(k => k.trim()).filter(Boolean)
        },
        seo: {
          ...formData.seo,
          keywords: formData.seo.keywords.split(',').map(k => k.trim()).filter(Boolean),
          hindiMeta: {
            ...formData.seo.hindiMeta,
            keywords: formData.seo.hindiMeta.keywords.split(',').map(k => k.trim()).filter(Boolean)
          }
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

  // JSON Import Handler
  const handleJsonSubmit = async () => {
    setJsonError('')
    
    if (!jsonInput.trim()) {
      setJsonError('Please paste JSON data')
      return
    }

    try {
      // Parse JSON
      const jsonData = JSON.parse(jsonInput)
      
      // Validate required fields
      if (!jsonData.title) {
        setJsonError('JSON must include "title" field')
        return
      }
      if (!jsonData.content) {
        setJsonError('JSON must include "content" field')
        return
      }
      if (!jsonData.category) {
        setJsonError('JSON must include "category" field')
        return
      }

      setSaving(true)
      
      // Create blog directly from JSON
      await blogAPI.createBlog(jsonData)
      toast.success('Blog created from JSON successfully!')
      navigate('/admin')
      
    } catch (error) {
      if (error instanceof SyntaxError) {
        setJsonError('Invalid JSON format. Please check your JSON syntax.')
      } else {
        setJsonError(error.message || 'Failed to create blog from JSON')
        toast.error(error.message || 'Failed to create blog')
      }
    } finally {
      setSaving(false)
    }
  }

  // Sample JSON template for reference
  const sampleJsonTemplate = `{
  "title": "Your Blog Title Here",
  "content": "<h2>Introduction</h2><p>Content here...</p>",
  "category": "Wellness",
  "medicalCategory": "General Wellness",
  "tags": ["health", "wellness"],
  "coverImage": "https://images.unsplash.com/...",
  "isPublished": true,
  "intentKeywords": {
    "en": ["keyword1", "keyword2"],
    "hi": ["हिंदी कीवर्ड"],
    "hinglish": ["hindi keyword"]
  },
  "symptoms": ["symptom1", "symptom2"],
  "seo": {
    "metaTitle": "SEO Title | Health Scan",
    "metaDescription": "Meta description here...",
    "keywords": ["seo", "keywords"],
    "hindiMeta": {
      "title": "हिंदी शीर्षक",
      "description": "हिंदी विवरण",
      "keywords": ["हिंदी"]
    }
  },
  "faq": [
    {
      "question_en": "English question?",
      "answer_en": "English answer",
      "question_hi": "हिंदी प्रश्न?",
      "answer_hi": "हिंदी उत्तर"
    }
  ],
  "medicalReviewed": true,
  "reviewedBy": "Health Scan Medical Team"
}`

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
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
            {/* SEO Score Badge - only show in form mode */}
            {editorMode === 'form' && (
              <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                seoScore.score >= 80 ? 'bg-green-100 text-green-800' :
                seoScore.score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                SEO: {seoScore.score}/100
              </div>
            )}
            {editorMode === 'form' && (
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
            )}
            <Button 
              onClick={editorMode === 'form' ? handleSubmit : handleJsonSubmit} 
              loading={saving} 
              variant="gradient"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>

        {/* Editor Mode Toggle - Only show for new articles */}
        {!isEditing && (
          <div className="mb-6 flex items-center gap-2 p-1 bg-muted rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setEditorMode('form')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                editorMode === 'form' 
                  ? 'bg-background shadow text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FormInput className="w-4 h-4" />
              Form Editor
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('json')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                editorMode === 'json' 
                  ? 'bg-background shadow text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code className="w-4 h-4" />
              JSON Import
            </button>
          </div>
        )}

        {/* JSON Import Mode */}
        {editorMode === 'json' && !isEditing && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Import from JSON
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Paste your blog document JSON below. The JSON will be sent directly to create a new blog post.
                </p>
                
                {jsonError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {jsonError}
                  </div>
                )}
                
                <textarea
                  value={jsonInput}
                  onChange={(e) => {
                    setJsonInput(e.target.value)
                    setJsonError('')
                  }}
                  placeholder="Paste your JSON object here..."
                  className="w-full p-4 rounded-xl border bg-background resize-none h-[500px] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  spellCheck={false}
                />
                
                <div className="flex items-center justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setJsonInput(sampleJsonTemplate)}
                  >
                    Load Sample Template
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleJsonSubmit} 
                    loading={saving}
                    variant="gradient"
                  >
                    <Save className="w-4 h-4" />
                    Create from JSON
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* JSON Format Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Required Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <code className="bg-muted px-1 rounded">title</code> - Blog title (string)</li>
                  <li>• <code className="bg-muted px-1 rounded">content</code> - HTML content (string)</li>
                  <li>• <code className="bg-muted px-1 rounded">category</code> - One of: Fitness, Mental Health, Diet, Diseases, Wellness, Prevention, Lifestyle</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-3">
                  All other fields are optional. Click "Load Sample Template" to see the full structure.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Form Editor Mode */}
        {editorMode === 'form' && (
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
                  placeholder="Enter article title (keyword-rich, 30-60 chars)"
                  error={errors.title}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.title.length}/60 characters | Slug: <code className="bg-muted px-1 rounded">{slugPreview || 'auto-generated'}</code>
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Brief summary - must answer WHAT & WHY in first 100 words"
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
                  placeholder="Write medical content. Include symptoms list, causes, treatment options. Use H2, H3 for structure."
                  className={`w-full p-4 rounded-xl border bg-background resize-none h-96 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.content ? 'border-destructive' : ''}`}
                />
                {errors.content && (
                  <p className="text-xs text-destructive mt-1">{errors.content}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Word count: {formData.content.split(/\s+/).filter(Boolean).length} (aim for 800+)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Metadata & Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Categories & Tags
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

                {/* Medical Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Stethoscope className="w-4 h-4 inline mr-1" />
                    Medical Category
                  </label>
                  <select
                    name="medicalCategory"
                    value={formData.medicalCategory}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {MEDICAL_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
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

              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  🩺 Symptoms (for medical search matching)
                </label>
                <Input
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  placeholder="burning sensation, pain, itching, redness (comma separated)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  List symptoms users might search for
                </p>
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

          {/* Hindi Intent Keywords (CRITICAL FOR SEO) */}
          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader className="bg-orange-50 dark:bg-orange-950/20">
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <Languages className="w-5 h-5" />
                🇮🇳 Hindi Intent Keywords (Vinmec-style SEO)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                <strong>Critical:</strong> These keywords help Hindi searchers find your English content. 
                Add Hindi phrases that users might search for. Example: "गुदा में जलन" for "burning sensation in anus"
              </p>

              {/* English Intent Keywords */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  English Intent Keywords
                </label>
                <Input
                  name="intentKeywords.en"
                  value={formData.intentKeywords.en}
                  onChange={handleChange}
                  placeholder="burning sensation, anal pain, itching after stool"
                />
              </div>

              {/* Hindi Intent Keywords */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="text-orange-600">★</span> Hindi Intent Keywords (हिंदी)
                </label>
                <Input
                  name="intentKeywords.hi"
                  value={formData.intentKeywords.hi}
                  onChange={handleChange}
                  placeholder="गुदा में जलन, लैट्रिन के बाद जलन, पाइल्स के लक्षण"
                  className="font-hindi"
                  lang="hi"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Add common Hindi search phrases separated by commas
                </p>
              </div>

              {/* Hinglish Intent Keywords */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Hinglish Intent Keywords
                </label>
                <Input
                  name="intentKeywords.hinglish"
                  value={formData.intentKeywords.hinglish}
                  onChange={handleChange}
                  placeholder="guda mein jalan, latrine ke baad dard, pet mein gas"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Hindi words written in English letters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                SEO Settings (English)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Meta Title</label>
                <Input
                  name="seo.metaTitle"
                  value={formData.seo.metaTitle}
                  onChange={handleChange}
                  placeholder="SEO title (max 60 characters)"
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
                  placeholder="Search engine description (120-160 characters)"
                  className="w-full p-3 rounded-xl border bg-background resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.seo.metaDescription.length}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">SEO Keywords</label>
                <Input
                  name="seo.keywords"
                  value={formData.seo.keywords}
                  onChange={handleChange}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </CardContent>
          </Card>

          {/* Hindi SEO Meta */}
          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader className="bg-orange-50 dark:bg-orange-950/20">
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <Globe className="w-5 h-5" />
                Hindi SEO Meta (for Google Hindi ranking)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <label className="block text-sm font-medium mb-2">Hindi Meta Title</label>
                <Input
                  name="seo.hindiMeta.title"
                  value={formData.seo.hindiMeta.title}
                  onChange={handleChange}
                  placeholder="गुदा में जलन के कारण और उपचार | Health Scan"
                  lang="hi"
                  maxLength={70}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hindi Meta Description</label>
                <textarea
                  name="seo.hindiMeta.description"
                  value={formData.seo.hindiMeta.description}
                  onChange={handleChange}
                  placeholder="गुदा में जलन के कारण, लक्षण और घरेलू उपचार जानें..."
                  className="w-full p-3 rounded-xl border bg-background resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary"
                  lang="hi"
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hindi Keywords</label>
                <Input
                  name="seo.hindiMeta.keywords"
                  value={formData.seo.hindiMeta.keywords}
                  onChange={handleChange}
                  placeholder="गुदा में जलन, बवासीर, पाइल्स के लक्षण"
                  lang="hi"
                />
              </div>
            </CardContent>
          </Card>

          {/* Bilingual FAQ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  FAQs (For Rich Results)
                </span>
                <Button type="button" variant="outline" size="sm" onClick={addFaq}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add FAQ
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.faq.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No FAQs added. Add at least 3 FAQs for Google rich results.
                </p>
              ) : (
                formData.faq.map((faq, index) => (
                  <div key={index} className="p-4 border rounded-xl space-y-4 relative">
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="absolute top-2 right-2 p-1 hover:bg-destructive/10 rounded text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* English Question */}
                      <div>
                        <label className="block text-xs font-medium mb-1">Question (English) *</label>
                        <Input
                          value={faq.question_en}
                          onChange={(e) => updateFaq(index, 'question_en', e.target.value)}
                          placeholder="What causes burning sensation after stool?"
                        />
                      </div>
                      
                      {/* Hindi Question */}
                      <div>
                        <label className="block text-xs font-medium mb-1">Question (Hindi)</label>
                        <Input
                          value={faq.question_hi}
                          onChange={(e) => updateFaq(index, 'question_hi', e.target.value)}
                          placeholder="लैट्रिन के बाद जलन क्यों होती है?"
                          lang="hi"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* English Answer */}
                      <div>
                        <label className="block text-xs font-medium mb-1">Answer (English) *</label>
                        <textarea
                          value={faq.answer_en}
                          onChange={(e) => updateFaq(index, 'answer_en', e.target.value)}
                          placeholder="Answer in clear, helpful language..."
                          className="w-full p-2 rounded-lg border bg-background resize-none h-20 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      {/* Hindi Answer */}
                      <div>
                        <label className="block text-xs font-medium mb-1">Answer (Hindi)</label>
                        <textarea
                          value={faq.answer_hi}
                          onChange={(e) => updateFaq(index, 'answer_hi', e.target.value)}
                          placeholder="हिंदी में जवाब..."
                          className="w-full p-2 rounded-lg border bg-background resize-none h-20 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          lang="hi"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Medical Review */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Medical Review (EEAT Trust Signal)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="medicalReviewed"
                  checked={formData.medicalReviewed}
                  onChange={handleChange}
                  className="rounded"
                />
                <span>This content has been medically reviewed</span>
              </label>
              
              {formData.medicalReviewed && (
                <div>
                  <label className="block text-sm font-medium mb-2">Reviewed By</label>
                  <Input
                    name="reviewedBy"
                    value={formData.reviewedBy}
                    onChange={handleChange}
                    placeholder="Dr. Name, MD - Specialty"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO Score Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                SEO Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {seoScore.checks?.map((check, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {check.pass ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                    <span className={check.pass ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}>
                      {check.label}
                    </span>
                  </div>
                ))}
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
        )}
      </motion.div>
    </div>
  )
}
