import { Link } from 'react-router-dom'
import { Heart, Github, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-50 dark:bg-slate-900/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-health-500 to-mint-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">+</span>
              </div>
              <span className="font-bold text-xl gradient-text">HealthAI</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Your AI-powered healthcare assistant. Get general health information and lifestyle guidance.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg hover:bg-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-accent transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-accent transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blogs" className="text-muted-foreground hover:text-primary transition-colors">Health Blog</Link></li>
              <li><Link to="/chat" className="text-muted-foreground hover:text-primary transition-colors">AI Assistant</Link></li>
              <li><Link to="/blogs?category=Fitness" className="text-muted-foreground hover:text-primary transition-colors">Fitness</Link></li>
              <li><Link to="/blogs?category=Mental Health" className="text-muted-foreground hover:text-primary transition-colors">Mental Health</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blogs?category=Diet" className="text-muted-foreground hover:text-primary transition-colors">Diet & Nutrition</Link></li>
              <li><Link to="/blogs?category=Diseases" className="text-muted-foreground hover:text-primary transition-colors">Diseases</Link></li>
              <li><Link to="/blogs?category=Wellness" className="text-muted-foreground hover:text-primary transition-colors">Wellness</Link></li>
              <li><Link to="/blogs?category=Prevention" className="text-muted-foreground hover:text-primary transition-colors">Prevention</Link></li>
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
            <strong>⚕️ Medical Disclaimer:</strong> HealthAI provides general health information for educational purposes only. 
            It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified 
            healthcare provider for medical concerns.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} HealthAI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for better health
          </p>
        </div>
      </div>
    </footer>
  )
}

