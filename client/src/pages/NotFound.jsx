import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* 404 Illustration */}
        <div className="text-9xl font-bold gradient-text mb-4">404</div>
        
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved or doesn't exist.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild>
            <Link to="/">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/blogs">
              <Search className="w-4 h-4" />
              Browse Articles
            </Link>
          </Button>
        </div>

        <button 
          onClick={() => window.history.back()}
          className="mt-6 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back to previous page
        </button>
      </motion.div>
    </div>
  )
}

