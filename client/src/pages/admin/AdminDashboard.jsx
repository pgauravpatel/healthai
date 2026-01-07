import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Plus, Edit, Trash2, Eye, EyeOff, Search,
  FileText, Users, MessageCircle, TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { blogAPI } from '@/services/api'
import { formatDate, truncateText } from '@/lib/utils'

export default function AdminDashboard() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [filter, setFilter] = useState('all') // all, published, draft

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
      return
    }
    loadBlogs()
  }, [isAdmin, filter])

  const loadBlogs = async () => {
    setLoading(true)
    try {
      const status = filter === 'all' ? undefined : filter
      const response = await blogAPI.getAdminBlogs({ status, limit: 20 })
      setBlogs(response.data.blogs)
      setPagination(response.data.pagination)
    } catch (error) {
      toast.error('Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePublish = async (id) => {
    try {
      const response = await blogAPI.togglePublish(id)
      setBlogs(prev => prev.map(blog => 
        blog._id === id ? { ...blog, isPublished: response.data.isPublished } : blog
      ))
      toast.success(response.data.message)
    } catch (error) {
      toast.error('Failed to update blog')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) return

    try {
      await blogAPI.deleteBlog(id)
      setBlogs(prev => prev.filter(blog => blog._id !== id))
      toast.success('Blog deleted')
    } catch (error) {
      toast.error('Failed to delete blog')
    }
  }

  // Stats
  const stats = [
    { 
      label: 'Total Blogs', 
      value: pagination.total,
      icon: FileText,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      label: 'Published', 
      value: blogs.filter(b => b.isPublished).length,
      icon: Eye,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      label: 'Drafts', 
      value: blogs.filter(b => !b.isPublished).length,
      icon: EyeOff,
      color: 'from-amber-500 to-orange-500'
    },
    { 
      label: 'Total Views', 
      value: blogs.reduce((acc, b) => acc + (b.views || 0), 0),
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your health blog content</p>
          </div>
          <Button variant="gradient" asChild>
            <Link to="/admin/blogs/new">
              <Plus className="w-4 h-4" />
              New Article
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'published', 'draft'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Blogs Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading...
              </div>
            ) : blogs.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No blogs found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium">Title</th>
                      <th className="text-left p-4 font-medium">Category</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Views</th>
                      <th className="text-left p-4 font-medium">Date</th>
                      <th className="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog._id} className="border-b hover:bg-muted/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={blog.coverImage}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <span className="font-medium">
                              {truncateText(blog.title, 40)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{blog.category}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant={blog.isPublished ? 'success' : 'warning'}>
                            {blog.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {blog.views || 0}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {formatDate(blog.createdAt)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleTogglePublish(blog._id)}
                              title={blog.isPublished ? 'Unpublish' : 'Publish'}
                            >
                              {blog.isPublished ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                            >
                              <Link to={`/admin/blogs/${blog._id}/edit`}>
                                <Edit className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(blog._id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

