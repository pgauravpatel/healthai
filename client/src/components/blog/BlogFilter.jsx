import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const CATEGORIES = [
  'All',
  'Fitness',
  'Mental Health',
  'Diet',
  'Diseases',
  'Wellness',
  'Prevention',
  'Lifestyle'
]

export default function BlogFilter({ 
  search, 
  onSearchChange, 
  category, 
  onCategoryChange,
  onClear 
}) {
  const [showFilters, setShowFilters] = useState(false)

  const hasFilters = search || category

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search health articles..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <Button
          variant={showFilters ? 'default' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
          className="shrink-0"
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline ml-2">Filters</span>
        </Button>
      </div>

      {/* Category Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 pt-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat === 'All' ? '' : cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    (cat === 'All' && !category) || category === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Active filters:</span>
          {category && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full flex items-center gap-1">
              {category}
              <button onClick={() => onCategoryChange('')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {search && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full flex items-center gap-1">
              "{search}"
              <button onClick={() => onSearchChange('')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button 
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}

