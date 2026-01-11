import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronRight, AlertTriangle, CheckCircle, XCircle, 
  Stethoscope, HelpCircle, ChevronDown, MessageCircle,
  Send, Loader2, Home, BookOpen, FileSearch, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import DiseaseSeo from '@/components/seo/DiseaseSeo'
import { getDiseaseBySlug, getRelatedDiseases, getAllDiseases } from '@/data/diseases'
import { chatAPI } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export default function DiseasePage() {
  const { t } = useTranslation()
  const { slug } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  const disease = getDiseaseBySlug(slug)
  const relatedDiseases = getRelatedDiseases(slug)
  
  // AI Chat state
  const [showChat, setShowChat] = useState(false)
  const [chatQuestion, setChatQuestion] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [chatLoading, setChatLoading] = useState(false)

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    // Scroll to top when disease changes
    window.scrollTo(0, 0)
  }, [slug])

  if (!disease) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Condition Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find information about this condition.
          </p>
          <Button asChild>
            <Link to="/diseases">Browse All Conditions</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleAskAI = async (e) => {
    e.preventDefault()
    if (!chatQuestion.trim() || chatLoading) return

    const userMessage = chatQuestion.trim()
    setChatQuestion('')
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setChatLoading(true)

    try {
      // Create a contextual prompt about this disease
      const contextualMessage = `I'm reading about ${disease.name} and have a question: ${userMessage}

Please provide general health guidance related to ${disease.name}. Remember:
- Do NOT provide a medical diagnosis
- Do NOT prescribe medications
- Focus on general information and lifestyle guidance
- Mention when they should consult a doctor
- Be helpful but cautious`

      const response = await chatAPI.sendMessage({ 
        message: contextualMessage 
      })
      
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.message 
      }])
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I\'m unable to respond right now. Please try again later or consult a healthcare professional for your questions.'
      }])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <>
      <DiseaseSeo disease={disease} />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-8 md:py-12">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav 
              className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
              aria-label="Breadcrumb"
            >
              <Link to="/" className="hover:text-foreground flex items-center gap-1">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/diseases" className="hover:text-foreground">
                Health Conditions
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{disease.name}</span>
            </nav>

            {/* Title */}
            <div className="max-w-4xl">
              <Badge className="mb-4">{disease.category}</Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 flex items-center gap-3">
                <span className="text-4xl">{disease.emoji}</span>
                {disease.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                {disease.shortDesc}
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <section aria-labelledby="overview-heading">
                <h2 id="overview-heading" className="text-2xl font-bold mb-4 flex items-center gap-2">
                  📖 What is {disease.name}?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {disease.overview}
                </p>
              </section>

              {/* Causes */}
              <section aria-labelledby="causes-heading" className="p-6 bg-orange-50 dark:bg-orange-900/10 rounded-2xl">
                <h2 id="causes-heading" className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-800 dark:text-orange-300">
                  <AlertTriangle className="w-5 h-5" />
                  Common Causes
                </h2>
                <ul className="space-y-2">
                  {disease.causes.map((cause, i) => (
                    <li key={i} className="flex items-start gap-2 text-orange-900 dark:text-orange-100">
                      <span className="text-orange-500 mt-1">•</span>
                      {cause}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Symptoms */}
              <section aria-labelledby="symptoms-heading" className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl">
                <h2 id="symptoms-heading" className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-800 dark:text-blue-300">
                  🩺 Common Symptoms
                </h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {disease.symptoms.map((symptom, i) => (
                    <div key={i} className="flex items-start gap-2 text-blue-900 dark:text-blue-100">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                      <span>{symptom}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Home Care */}
              <section aria-labelledby="homecare-heading" className="p-6 bg-green-50 dark:bg-green-900/10 rounded-2xl">
                <h2 id="homecare-heading" className="text-xl font-bold mb-4 flex items-center gap-2 text-green-800 dark:text-green-300">
                  🏠 Home Care & Lifestyle Tips
                </h2>
                <ul className="space-y-3">
                  {disease.homeCare.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-green-900 dark:text-green-100">
                      <span className="w-6 h-6 rounded-full bg-green-500 text-white text-sm flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>

              {/* What NOT to Do */}
              <section aria-labelledby="donot-heading" className="p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl">
                <h2 id="donot-heading" className="text-xl font-bold mb-4 flex items-center gap-2 text-red-800 dark:text-red-300">
                  <XCircle className="w-5 h-5" />
                  What NOT to Do
                </h2>
                <ul className="space-y-2">
                  {disease.doNot.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-red-900 dark:text-red-100">
                      <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* When to See Doctor */}
              <section aria-labelledby="doctor-heading" className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border-2 border-purple-200 dark:border-purple-800">
                <h2 id="doctor-heading" className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-800 dark:text-purple-300">
                  <Stethoscope className="w-5 h-5" />
                  When to Consult a Doctor
                </h2>
                <p className="text-purple-900 dark:text-purple-100 mb-4">
                  Seek medical attention if you experience any of the following:
                </p>
                <ul className="space-y-2">
                  {disease.whenToSeeDoctor.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-purple-900 dark:text-purple-100">
                      <AlertTriangle className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* FAQs */}
              <section aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6" />
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {disease.faqs.map((faq, i) => (
                    <div key={i} className="border rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                        className={cn(
                          "w-full flex items-center justify-between p-4 text-left",
                          "hover:bg-muted/50 transition-colors",
                          openFaq === i && "bg-muted/30"
                        )}
                        aria-expanded={openFaq === i}
                      >
                        <span className="font-medium pr-4">{faq.question}</span>
                        <ChevronDown 
                          className={cn(
                            "w-5 h-5 text-muted-foreground transition-transform flex-shrink-0",
                            openFaq === i && "rotate-180"
                          )} 
                        />
                      </button>
                      <AnimatePresence>
                        {openFaq === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-4 pb-4 text-muted-foreground">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </section>

              {/* Medical Disclaimer */}
              <section className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800">
                <h2 className="font-bold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
                  ⚕️ Medical Disclaimer
                </h2>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  This information is for educational purposes only and is not intended to be a substitute for 
                  professional medical advice, diagnosis, or treatment. Always seek the advice of your physician 
                  or other qualified health provider with any questions you may have regarding a medical condition. 
                  Never disregard professional medical advice or delay in seeking it because of something you have read here.
                </p>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* AI Chat Widget */}
              <div className="sticky top-24">
                <div className="p-6 bg-gradient-to-br from-health-500/10 to-mint-500/10 rounded-2xl border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-health-500 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold">Ask AI Assistant</h3>
                      <p className="text-xs text-muted-foreground">
                        Get answers about {disease.name}
                      </p>
                    </div>
                  </div>

                  {!showChat ? (
                    <Button 
                      variant="gradient" 
                      className="w-full"
                      onClick={() => setShowChat(true)}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Ask a Question
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      {/* Chat Messages */}
                      {chatMessages.length > 0 && (
                        <div className="max-h-64 overflow-y-auto space-y-2 p-3 bg-background rounded-lg">
                          {chatMessages.map((msg, i) => (
                            <div 
                              key={i}
                              className={cn(
                                "p-2 rounded-lg text-sm",
                                msg.role === 'user' 
                                  ? "bg-primary/10 ml-4" 
                                  : "bg-muted mr-4"
                              )}
                            >
                              {msg.content}
                            </div>
                          ))}
                          {chatLoading && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Thinking...
                            </div>
                          )}
                        </div>
                      )}

                      {/* Chat Input */}
                      <form onSubmit={handleAskAI} className="flex gap-2">
                        <input
                          type="text"
                          value={chatQuestion}
                          onChange={(e) => setChatQuestion(e.target.value)}
                          placeholder={`Ask about ${disease.name}...`}
                          className="flex-1 px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          disabled={chatLoading}
                        />
                        <Button 
                          type="submit" 
                          size="sm" 
                          disabled={!chatQuestion.trim() || chatLoading}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </form>

                      {!isAuthenticated && (
                        <p className="text-xs text-muted-foreground text-center">
                          <Link to="/login" className="text-primary hover:underline">Log in</Link> for full AI assistant access
                        </p>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    AI provides general guidance only, not medical advice
                  </p>
                </div>

                {/* Related Conditions */}
                {relatedDiseases.length > 0 && (
                  <div className="mt-6 p-6 bg-card rounded-2xl border">
                    <h3 className="font-bold mb-4">Related Conditions</h3>
                    <div className="space-y-2">
                      {relatedDiseases.map(related => (
                        <Link
                          key={related.slug}
                          to={`/diseases/${related.slug}`}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <span className="text-xl">{related.emoji}</span>
                          <div>
                            <p className="font-medium text-sm">{related.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {related.shortDesc}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Internal Links */}
                <div className="mt-6 p-6 bg-card rounded-2xl border">
                  <h3 className="font-bold mb-4">Explore More</h3>
                  <div className="space-y-2">
                    <Link
                      to="/ai-health-report-analyzer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <FileSearch className="w-5 h-5 text-health-500" />
                      <div>
                        <p className="font-medium text-sm">AI Report Analyzer</p>
                        <p className="text-xs text-muted-foreground">
                          Upload & analyze health reports
                        </p>
                      </div>
                    </Link>
                    <Link
                      to="/blogs"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <BookOpen className="w-5 h-5 text-health-500" />
                      <div>
                        <p className="font-medium text-sm">Health Blog</p>
                        <p className="text-xs text-muted-foreground">
                          Expert health articles
                        </p>
                      </div>
                    </Link>
                    <Link
                      to="/chat"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <MessageCircle className="w-5 h-5 text-health-500" />
                      <div>
                        <p className="font-medium text-sm">AI Health Assistant</p>
                        <p className="text-xs text-muted-foreground">
                          Ask health questions
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Browse More Conditions */}
        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Browse Other Health Conditions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {getAllDiseases()
                .filter(d => d.slug !== slug)
                .slice(0, 10)
                .map(d => (
                  <Link
                    key={d.slug}
                    to={`/diseases/${d.slug}`}
                    className="p-4 bg-card rounded-xl border hover:shadow-md transition-all text-center"
                  >
                    <span className="text-2xl block mb-2">{d.emoji}</span>
                    <span className="text-sm font-medium">{d.name}</span>
                  </Link>
                ))}
            </div>
            <div className="text-center mt-6">
              <Link to="/diseases" className="text-primary hover:underline inline-flex items-center gap-1">
                View all health conditions <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

