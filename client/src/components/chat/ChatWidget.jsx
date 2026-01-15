import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { chatAPI } from '@/services/api'
import { useToast } from '@/context/ToastContext'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim() || loading) return

    if (!isAuthenticated) {
      toast.info('Please log in to use the AI assistant')
      navigate('/login')
      return
    }

    const userMessage = message.trim()
    setMessage('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await chatAPI.sendMessage({ message: userMessage })
      setMessages(prev => [...prev, response.data.message])
    } catch (error) {
      toast.error(error.message || 'Failed to send message')
      setMessages(prev => prev.slice(0, -1)) // Remove user message on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          isOpen 
            ? 'bg-slate-700 text-white' 
            : 'bg-gradient-to-r from-health-500 to-mint-500 text-white'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-card border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-health-500 to-mint-500 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xl">🏥</span>
                </div>
                <div>
                  <h3 className="font-semibold">Health Scan Assistant</h3>
                  <p className="text-xs text-white/80">Ask about health & wellness</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[300px] overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <p className="mb-2">👋 Hello! I'm your health assistant.</p>
                  <p>Ask me about general health, wellness, or lifestyle tips.</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2 ${
                        msg.role === 'user'
                          ? 'chat-bubble-user'
                          : 'chat-bubble-ai'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="chat-bubble-ai px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin text-health-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your health question..."
                  className="flex-1 px-4 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!message.trim() || loading}
                  className="rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                For emergencies, call your local emergency number
              </p>
            </form>

            {/* Full Chat Link */}
            <div className="p-2 border-t bg-muted/30 text-center">
              <button
                onClick={() => {
                  setIsOpen(false)
                  navigate('/chat')
                }}
                className="text-sm text-primary hover:underline"
              >
                Open full chat experience →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

