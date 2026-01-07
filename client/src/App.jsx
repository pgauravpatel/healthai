import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import Profile from './pages/Profile'
import Bookmarks from './pages/Bookmarks'
import AdminDashboard from './pages/admin/AdminDashboard'
import BlogEditor from './pages/admin/BlogEditor'
import NotFound from './pages/NotFound'
import Disclaimer from './pages/Disclaimer'

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes with Layout */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/blogs" element={<Layout><Blogs /></Layout>} />
      <Route path="/blogs/:slug" element={<Layout><BlogDetail /></Layout>} />
      <Route path="/disclaimer" element={<Layout><Disclaimer /></Layout>} />
      
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
            <Chat />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/chat/:chatId" element={
        <ProtectedRoute>
          <Layout showFooter={false} showDisclaimer={false}>
            <Chat />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/chat/history" element={
        <ProtectedRoute>
          <Layout showFooter={false} showDisclaimer={false}>
            <Chat />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout><Profile /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/bookmarks" element={
        <ProtectedRoute>
          <Layout><Bookmarks /></Layout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/blogs/new" element={
        <ProtectedRoute adminOnly>
          <Layout><BlogEditor /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/blogs/:id/edit" element={
        <ProtectedRoute adminOnly>
          <Layout><BlogEditor /></Layout>
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  )
}

