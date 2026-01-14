import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import Seo from '@/components/seo/Seo'

export default function Login() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const from = location.state?.from?.pathname || '/'

  const validate = () => {
    const newErrors = {}
    if (!email) newErrors.email = t('auth.emailRequired')
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = t('auth.emailRequired')
    if (!password) newErrors.password = t('auth.passwordRequired')
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await login(email, password)
      toast.success(t('auth.loginSuccess'))
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(error.message || t('auth.invalidCredentials'))
      setErrors({ general: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Seo
        title={t('seo.loginTitle')}
        description={t('seo.loginDescription')}
        canonicalUrl="/login"
        noIndex={false}
      />
      
      <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-health-500 to-mint-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">+</span>
            </div>
            <span className="font-bold text-xl gradient-text">HealthAI</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">{t('auth.welcomeBack')}</h1>
          <p className="text-muted-foreground mb-8">
            {t('auth.createAccountSubtitle')}
          </p>

          {errors.general && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.email')}</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                icon={Mail}
                error={errors.email}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.password')}</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={Lock}
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-input" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-primary hover:underline">
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              <LogIn className="w-4 h-4" />
              {t('auth.login')}
            </Button>
          </form>

          <p className="mt-8 text-center text-muted-foreground">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              {t('auth.signUp')}
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-health-500 to-mint-500 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-lg text-white text-center"
        >
          <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-white/20 flex items-center justify-center">
            <span className="text-5xl">🏥</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            {t('home.heroTitle')}
          </h2>
          <p className="text-white/80 text-lg">
            {t('home.heroSubtitle')}
          </p>
        </motion.div>
      </div>
    </div>
    </>
  )
}
