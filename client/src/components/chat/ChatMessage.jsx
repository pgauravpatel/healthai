import { motion } from 'framer-motion'
import { Bot, User, Copy, Check, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { UserAvatar } from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'
import { copyToClipboard, formatRelativeTime } from '@/lib/utils'

export default function ChatMessage({ message, isLatest = false }) {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const isEmergency = message.isEmergency

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div
      initial={isLatest ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <UserAvatar user={user} size="md" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-health-500 to-mint-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">
            {isUser ? 'You' : 'Health Scan'}
          </span>
          {message.timestamp && (
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(message.timestamp)}
            </span>
          )}
        </div>

        <div
          className={`inline-block text-left ${
            isUser
              ? 'chat-bubble-user px-4 py-3'
              : isEmergency
              ? 'emergency-banner'
              : 'chat-bubble-ai px-4 py-3'
          }`}
        >
          {isEmergency && (
            <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Emergency Alert</span>
            </div>
          )}
          
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {message.content.split('\n').map((line, i) => (
              <p key={i} className={i > 0 ? 'mt-2' : ''}>
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Actions */}
        {!isUser && (
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

