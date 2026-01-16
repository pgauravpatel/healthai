import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Search, ChevronRight, Home, Heart, FileSearch, MessageCircle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import Seo from '@/components/seo/Seo'
import { getAllDiseases, getDiseaseCategories } from '@/data/diseases'

export default function DiseasesIndex() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  
  const allDiseases = getAllDiseases()
  const categories = getDiseaseCategories()
  
  // Filter diseases
  const filteredDiseases = allDiseases.filter(disease => {
    const matchesSearch = !search || 
      disease.name.toLowerCase().includes(search.toLowerCase()) ||
      disease.searchTerms.some(term => term.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = !selectedCategory || disease.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Group by category for display
  const groupedDiseases = filteredDiseases.reduce((acc, disease) => {
    if (!acc[disease.category]) acc[disease.category] = []
    acc[disease.category].push(disease)
    return acc
  }, {})

  // Schema for the index page
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Health Conditions & Everyday Health Problems",
    "description": "Browse common health conditions like fungal infections, acidity, piles, cold, fever, and more. Get trusted information on symptoms, causes, and home remedies.",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": allDiseases.length,
      "itemListElement": allDiseases.map((disease, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `https://www.healthreportscan.info/diseases/${disease.slug}`,
        "name": disease.name
      }))
    }
  }

  return (
    <>
      <Seo
        title="Health Conditions & Everyday Health Problems | Health Scan"
        description="Learn about common health conditions like fungal infections, acidity, piles, fever, cold, and more. Get trusted information on symptoms, causes, home remedies, and when to see a doctor."
        keywords="health conditions, everyday health problems, fungal infection, mouth ulcer, piles, acidity, gas, skin rash, fever, cold, dandruff, itching, home remedies"
        canonicalUrl="/diseases"
        schema={collectionSchema}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-health-500/10 via-background to-mint-500/10 py-12 md:py-16">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-foreground flex items-center gap-1">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">Health Conditions</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Everyday Health <span className="gradient-text">Conditions</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Get reliable information about common health problems. Learn about symptoms, causes, 
                home remedies, and when to consult a doctor. All content is for educational purposes only.
              </p>

              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search conditions (e.g., acidity, fungal infection)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 py-6 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-6 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                All Conditions
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Diseases List */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {Object.keys(groupedDiseases).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No conditions found matching your search.</p>
                <button 
                  onClick={() => { setSearch(''); setSelectedCategory(''); }}
                  className="text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(groupedDiseases).map(([category, diseases]) => (
                  <div key={category}>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      {getCategoryEmoji(category)} {category}
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {diseases.map((disease, i) => (
                        <motion.div
                          key={disease.slug}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Link
                            to={`/diseases/${disease.slug}`}
                            className="block p-5 bg-card rounded-xl border hover:shadow-lg hover:border-primary/50 transition-all group"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-3xl">{disease.emoji}</span>
                              <div className="flex-1">
                                <h3 className="font-semibold group-hover:text-primary transition-colors">
                                  {disease.name}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                  {disease.shortDesc}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
              <p className="text-muted-foreground mb-8">
                Our AI-powered tools can help you understand your health better
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <Link
                  to="/chat"
                  className="p-6 bg-card rounded-xl border hover:shadow-md transition-all"
                >
                  <MessageCircle className="w-8 h-8 text-health-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">AI Health Assistant</h3>
                  <p className="text-sm text-muted-foreground">Ask health questions</p>
                </Link>
                <Link
                  to="/ai-health-report-analyzer"
                  className="p-6 bg-card rounded-xl border hover:shadow-md transition-all"
                >
                  <FileSearch className="w-8 h-8 text-health-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">Report Analyzer</h3>
                  <p className="text-sm text-muted-foreground">Understand lab results</p>
                </Link>
                <Link
                  to="/blogs"
                  className="p-6 bg-card rounded-xl border hover:shadow-md transition-all"
                >
                  <Heart className="w-8 h-8 text-health-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">Health Blog</h3>
                  <p className="text-sm text-muted-foreground">Expert articles</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 bg-amber-50 dark:bg-amber-900/10 border-y border-amber-200 dark:border-amber-800">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>⚕️ Medical Disclaimer:</strong> The information on these pages is for educational 
              purposes only and is not intended to be a substitute for professional medical advice, 
              diagnosis, or treatment. Always seek the advice of your physician or other qualified 
              health provider.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

function getCategoryEmoji(category) {
  const emojis = {
    'Skin & Hair': '🧴',
    'Oral Health': '🦷',
    'Digestive Health': '🍽️',
    'General Health': '❤️',
    'Respiratory Health': '🫁'
  }
  return emojis[category] || '🏥'
}

