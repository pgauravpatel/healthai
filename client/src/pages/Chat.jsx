import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Send, Menu, Loader2, AlertTriangle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ChatMessage from '@/components/chat/ChatMessage'
import ChatSidebar from '@/components/chat/ChatSidebar'
import { InlineDisclaimer } from '@/components/MedicalDisclaimer'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { chatAPI } from '@/services/api'

export default function Chat() {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const toast = useToast()
  
  const [chats, setChats] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingChats, setLoadingChats] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/chat' } } })
    }
  }, [isAuthenticated, navigate])

  // Load chats
  useEffect(() => {
    if (isAuthenticated) {
      loadChats()
    }
  }, [isAuthenticated])

  // Load specific chat
  useEffect(() => {
    if (chatId && isAuthenticated) {
      loadChat(chatId)
    } else {
      setCurrentChat(null)
    }
  }, [chatId, isAuthenticated])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentChat?.messages])

  const loadChats = async () => {
    try {
      const response = await chatAPI.getChats()
      setChats(response.data.chats)
    } catch (error) {
      console.error('Failed to load chats:', error)
    } finally {
      setLoadingChats(false)
    }
  }

  const loadChat = async (id) => {
    try {
      const response = await chatAPI.getChat(id)
      setCurrentChat(response.data.chat)
    } catch (error) {
      toast.error('Failed to load chat')
      navigate('/chat')
    }
  }

  const handleNewChat = async () => {
    setCurrentChat(null)
    navigate('/chat')
    setSidebarOpen(false)
  }

  const handleSelectChat = (id) => {
    navigate(`/chat/${id}`)
    setSidebarOpen(false)
  }

  const handleDeleteChat = async (id) => {
    try {
      await chatAPI.deleteChat(id)
      setChats(prev => prev.filter(c => c._id !== id))
      if (chatId === id) {
        navigate('/chat')
      }
      toast.success('Chat deleted')
    } catch (error) {
      toast.error('Failed to delete chat')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim() || loading) return

    const userMessage = message.trim()
    setMessage('')
    setLoading(true)

    // Optimistically add user message
    const tempMessage = { role: 'user', content: userMessage, timestamp: new Date() }
    if (currentChat) {
      setCurrentChat(prev => ({
        ...prev,
        messages: [...prev.messages, tempMessage]
      }))
    } else {
      setCurrentChat({
        messages: [tempMessage]
      })
    }

    try {
      const response = await chatAPI.sendMessage({
        message: userMessage,
        chatId: currentChat?._id
      })

      const newChatId = response.data.chatId
      
      // Update current chat with AI response
      setCurrentChat(prev => ({
        ...prev,
        _id: newChatId,
        messages: [
          ...prev.messages,
          { ...response.data.message, timestamp: new Date() }
        ]
      }))

      // Navigate to chat if new
      if (!chatId) {
        navigate(`/chat/${newChatId}`, { replace: true })
      }

      // Refresh chats list
      loadChats()

    } catch (error) {
      toast.error(error.message || 'Failed to send message')
      // Remove optimistic message on error
      setCurrentChat(prev => ({
        ...prev,
        messages: prev.messages.slice(0, -1)
      }))
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  if (!isAuthenticated) {
    return null
  }

  const messages = currentChat?.messages || []

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        currentChatId={chatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-4 bg-card">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-accent rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-semibold">
                {currentChat?.title || 'New Conversation'}
              </h1>
              <p className="text-xs text-muted-foreground">
                AI Health Assistant
              </p>
            </div>
          </div>
          
          {currentChat && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteChat(currentChat._id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
          {/* Disclaimer */}
          <InlineDisclaimer />

          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center py-12"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-health-500 to-mint-500 flex items-center justify-center mb-6">
                <span className="text-4xl">🏥</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Hello! I'm your Health Assistant</h2>
              <p className="text-muted-foreground max-w-md mb-8">
                I'm here to help with general health questions and lifestyle guidance. 
                How can I assist you today?
              </p>
              
              <div className="grid sm:grid-cols-2 gap-3 max-w-lg">
                {[
                  'What are some tips for better sleep?',
                  'How can I reduce stress naturally?',
                  'What foods boost immunity?',
                  'How much water should I drink daily?'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setMessage(suggestion)}
                    className="p-3 text-left text-sm rounded-xl border hover:bg-accent transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((msg, i) => (
              <ChatMessage 
                key={i} 
                message={msg} 
                isLatest={i === messages.length - 1}
              />
            ))
          )}

          {loading && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-health-500 to-mint-500 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
              <span className="text-sm">Health Scan is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4 bg-card">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about health, wellness, or lifestyle..."
                className="flex-1 px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={!message.trim() || loading}
                className="px-6"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-3">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              For emergencies, call your local emergency services. This is not a substitute for professional medical advice.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

