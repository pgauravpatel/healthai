import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, Github, Twitter, Mail, FileSearch, Droplets, Activity } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-50 dark:bg-slate-900/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-10 h-10">
                  <path d="M5 2 L2 2 L2 10" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="square"/>
                  <path d="M35 2 L38 2 L38 10" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="square"/>
                  <path d="M2 30 L2 38 L10 38" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="square"/>
                  <path d="M38 30 L38 38 L30 38" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="square"/>
                  <circle cx="20" cy="20" r="12" stroke="#16a34a" strokeWidth="1.5" fill="none"/>
                  <circle cx="20" cy="20" r="9" stroke="#16a34a" strokeWidth="1.5" fill="none"/>
                  <circle cx="20" cy="20" r="6" stroke="#16a34a" strokeWidth="1.5" fill="none"/>
                  <circle cx="20" cy="20" r="3" stroke="#16a34a" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
              <span className="font-bold text-xl tracking-wide">
                <span className="text-green-600">HEALTH</span>
                <span className="text-gray-800 dark:text-white ml-1">SCAN</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted healthcare companion. Get health information and wellness guidance.
            </p>
            <div className="flex gap-3">
              <a href="https://twitter.com" className="p-2 rounded-lg hover:bg-accent transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com" className="p-2 rounded-lg hover:bg-accent transition-colors" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="mailto:contact@health.app" className="p-2 rounded-lg hover:bg-accent transition-colors" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Health Tools */}
          <div>
            <h3 className="font-semibold mb-4">Health Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/report-analyzer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <FileSearch className="w-3 h-3" /> Report Analyzer
                </Link>
              </li>
              <li>
                <Link to="/blood-test-analysis" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Droplets className="w-3 h-3" /> Blood Test Analysis
                </Link>
              </li>
              <li>
                <Link to="/cholesterol-report-ai" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Cholesterol Analyzer
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-muted-foreground hover:text-primary transition-colors">
                  Health Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Health Conditions - SEO Links */}
          <div>
            <h3 className="font-semibold mb-4">Health Conditions</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/diseases" className="text-muted-foreground hover:text-primary transition-colors">All Conditions</Link></li>
              <li><Link to="/diseases/fungal-infection" className="text-muted-foreground hover:text-primary transition-colors">Fungal Infection</Link></li>
              <li><Link to="/diseases/acidity" className="text-muted-foreground hover:text-primary transition-colors">Acidity & Heartburn</Link></li>
              <li><Link to="/diseases/piles" className="text-muted-foreground hover:text-primary transition-colors">Piles (Hemorrhoids)</Link></li>
              <li><Link to="/diseases/cold-cough" className="text-muted-foreground hover:text-primary transition-colors">Cold & Cough</Link></li>
            </ul>
          </div>

          {/* Health Blog - SEO Category Links */}
          <div>
            <h3 className="font-semibold mb-4">Health Blog</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blogs" className="text-muted-foreground hover:text-primary transition-colors">All Articles</Link></li>
              <li><Link to="/blogs/category/fitness" className="text-muted-foreground hover:text-primary transition-colors">Fitness Articles</Link></li>
              <li><Link to="/blogs/category/mental-health" className="text-muted-foreground hover:text-primary transition-colors">Mental Health</Link></li>
              <li><Link to="/blogs/category/diet" className="text-muted-foreground hover:text-primary transition-colors">Diet & Nutrition</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">Get Started</Link></li>
              <li><Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/disclaimer" className="text-muted-foreground hover:text-primary transition-colors">Medical Disclaimer</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>⚕️ {t('common.important')}:</strong> {t('disclaimers.medical')}
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Health Scan. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for better health
          </p>
        </div>
      </div>
    </footer>
  )
}
