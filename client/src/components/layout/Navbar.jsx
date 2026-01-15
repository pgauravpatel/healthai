import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, Sun, Moon, User, LogOut, 
  BookOpen, MessageCircle, Home, LayoutDashboard, FileSearch, Globe, Info, Heart
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { UserAvatar } from '@/components/ui/Avatar'
import LanguageSelector from '@/components/LanguageSelector'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  // Navigation links with translations
  const navLinks = [
    { href: '/', label: t('navbar.home'), icon: Home },
    { href: '/diseases', label: t('navbar.healthConditions', 'Health Conditions'), icon: Heart },
    { href: '/report-analyzer', label: t('navbar.reportAnalyzer'), icon: FileSearch },
    { href: '/blogs', label: t('navbar.blog'), icon: BookOpen },
    { href: '/chat', label: t('navbar.assistant'), icon: MessageCircle },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Health Scan with fingerprint scanner */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                {/* Corner brackets */}
                <path d="M5 2 L2 2 L2 10" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="square"/>
                <path d="M35 2 L38 2 L38 10" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="square"/>
                <path d="M2 30 L2 38 L10 38" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="square"/>
                <path d="M38 30 L38 38 L30 38" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="square"/>
                {/* Fingerprint circles */}
                <circle cx="20" cy="20" r="12" stroke="#16a34a" strokeWidth="1.5" fill="none"/>
                <circle cx="20" cy="20" r="9" stroke="#16a34a" strokeWidth="1.5" fill="none"/>
                <circle cx="20" cy="20" r="6" stroke="#16a34a" strokeWidth="1.5" fill="none"/>
                <circle cx="20" cy="20" r="3" stroke="#16a34a" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <span className="font-bold text-xl hidden sm:block tracking-wide">
              <span className="text-green-600">HEALTH</span>
              <span className="text-gray-800 dark:text-white ml-1">SCAN</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  location.pathname === href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  location.pathname.startsWith('/admin')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                {t('navbar.admin')}
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Language Selector - Desktop */}
            <div className="hidden sm:block">
              <LanguageSelector variant="compact" />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-accent transition-colors"
              aria-label={t('navbar.theme')}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* User Menu / Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-accent transition-colors"
                >
                  <UserAvatar user={user} size="sm" />
                  <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                    {user?.name}
                  </span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setUserMenuOpen(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 rounded-xl bg-card border shadow-lg z-50 overflow-hidden"
                      >
                        <div className="p-3 border-b">
                          <p className="font-medium truncate">{user?.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                          >
                            <User className="w-4 h-4" />
                            {t('navbar.profile')}
                          </Link>
                          <Link
                            to="/chat/history"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            {t('navbar.chatHistory')}
                          </Link>
                          <Link
                            to="/bookmarks"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                          >
                            <BookOpen className="w-4 h-4" />
                            {t('navbar.bookmarks')}
                          </Link>
                          <Link
                            to="/reports/history"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                          >
                            <FileSearch className="w-4 h-4" />
                            {t('navbar.reportHistory')}
                          </Link>
                          
                          {/* Language Selector in Dropdown */}
                          <div className="px-3 py-2 sm:hidden">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Globe className="w-4 h-4" />
                              {t('navbar.language')}
                            </div>
                            <LanguageSelector variant="compact" />
                          </div>
                          
                          <hr className="my-2" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            {t('navbar.logout')}
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">{t('navbar.login')}</Link>
                </Button>
                <Button variant="gradient" asChild>
                  <Link to="/register">{t('navbar.register')}</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-accent transition-colors md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  to={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    location.pathname === href
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-accent'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
              
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-accent"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  {t('navbar.admin')}
                </Link>
              )}

              {/* Mobile Language Selector */}
              <div className="px-4 py-3 border-t border-border/50 mt-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Globe className="w-5 h-5" />
                    {t('navbar.language')}
                  </span>
                  <LanguageSelector variant="compact" />
                </div>
              </div>

              {!isAuthenticated && (
                <div className="pt-4 space-y-2 border-t">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      {t('navbar.login')}
                    </Link>
                  </Button>
                  <Button variant="gradient" className="w-full" asChild>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      {t('navbar.register')}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
