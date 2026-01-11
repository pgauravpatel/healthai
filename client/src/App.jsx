import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
)

// Eager loaded pages (critical for SEO and initial load)
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

// Lazy loaded pages (non-critical, loaded on demand)
const Chat = lazy(() => import('./pages/Chat'))
const Blogs = lazy(() => import('./pages/Blogs'))
const BlogDetail = lazy(() => import('./pages/BlogDetail'))
const Profile = lazy(() => import('./pages/Profile'))
const Bookmarks = lazy(() => import('./pages/Bookmarks'))
const ReportAnalyzer = lazy(() => import('./pages/ReportAnalyzer'))
const ReportHistory = lazy(() => import('./pages/ReportHistory'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const BlogEditor = lazy(() => import('./pages/admin/BlogEditor'))
const Disclaimer = lazy(() => import('./pages/Disclaimer'))
const About = lazy(() => import('./pages/About'))
const BlogCategory = lazy(() => import('./pages/BlogCategory'))

// Disease Pages
const DiseasesIndex = lazy(() => import('./pages/diseases/DiseasesIndex'))
const DiseasePage = lazy(() => import('./pages/diseases/DiseasePage'))

// SEO Landing Pages (lazy loaded but pre-rendered)
const AIHealthReportAnalyzer = lazy(() => import('./pages/seo/AIHealthReportAnalyzer'))
const BloodTestAnalysis = lazy(() => import('./pages/seo/BloodTestAnalysis'))
const CholesterolReportAI = lazy(() => import('./pages/seo/CholesterolReportAI'))

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

// Auth Route (redirect if already logged in)
function AuthRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

// Suspense wrapper for lazy-loaded components
const LazyRoute = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
)

export default function App() {
  return (
    <Routes>
      {/* Public Routes with Layout - Eager loaded for SEO */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      
      {/* SEO Landing Pages - High-priority public pages */}
      <Route path="/ai-health-report-analyzer" element={
        <Layout>
          <LazyRoute><AIHealthReportAnalyzer /></LazyRoute>
        </Layout>
      } />
      <Route path="/blood-test-analysis" element={
        <Layout>
          <LazyRoute><BloodTestAnalysis /></LazyRoute>
        </Layout>
      } />
      <Route path="/cholesterol-report-ai" element={
        <Layout>
          <LazyRoute><CholesterolReportAI /></LazyRoute>
        </Layout>
      } />
      <Route path="/about" element={
        <Layout>
          <LazyRoute><About /></LazyRoute>
        </Layout>
      } />
      
      {/* Blog Routes */}
      <Route path="/blogs" element={
        <Layout>
          <LazyRoute><Blogs /></LazyRoute>
        </Layout>
      } />
      <Route path="/blogs/category/:category" element={
        <Layout>
          <LazyRoute><BlogCategory /></LazyRoute>
        </Layout>
      } />
      <Route path="/blogs/:slug" element={
        <Layout>
          <LazyRoute><BlogDetail /></LazyRoute>
        </Layout>
      } />
      
      {/* Disease/Health Condition Routes */}
      <Route path="/diseases" element={
        <Layout>
          <LazyRoute><DiseasesIndex /></LazyRoute>
        </Layout>
      } />
      <Route path="/diseases/:slug" element={
        <Layout>
          <LazyRoute><DiseasePage /></LazyRoute>
        </Layout>
      } />
      
      {/* Other Public Routes */}
      <Route path="/disclaimer" element={
        <Layout>
          <LazyRoute><Disclaimer /></LazyRoute>
        </Layout>
      } />
      
      {/* Auth Routes (no layout for cleaner look) */}
      <Route path="/login" element={
        <AuthRoute><Login /></AuthRoute>
      } />
      <Route path="/register" element={
        <AuthRoute><Register /></AuthRoute>
      } />

      {/* Protected Routes */}
      <Route path="/chat" element={
        <ProtectedRoute>
          <Layout showFooter={false} showDisclaimer={false}>
            <LazyRoute><Chat /></LazyRoute>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/chat/:chatId" element={
        <ProtectedRoute>
          <Layout showFooter={false} showDisclaimer={false}>
            <LazyRoute><Chat /></LazyRoute>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/chat/history" element={
        <ProtectedRoute>
          <Layout showFooter={false} showDisclaimer={false}>
            <LazyRoute><Chat /></LazyRoute>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <LazyRoute><Profile /></LazyRoute>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/bookmarks" element={
        <ProtectedRoute>
          <Layout>
            <LazyRoute><Bookmarks /></LazyRoute>
          </Layout>
        </ProtectedRoute>
      } />

      {/* Report Analyzer Routes */}
      <Route path="/report-analyzer" element={
        <Layout>
          <LazyRoute><ReportAnalyzer /></LazyRoute>
        </Layout>
      } />
      <Route path="/reports/history" element={
        <ProtectedRoute>
          <Layout>
            <LazyRoute><ReportHistory /></LazyRoute>
          </Layout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <Layout>
            <LazyRoute><AdminDashboard /></LazyRoute>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/blogs/new" element={
        <ProtectedRoute adminOnly>
          <Layout>
            <LazyRoute><BlogEditor /></LazyRoute>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/blogs/:id/edit" element={
        <ProtectedRoute adminOnly>
          <Layout>
            <LazyRoute><BlogEditor /></LazyRoute>
          </Layout>
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  )
}
