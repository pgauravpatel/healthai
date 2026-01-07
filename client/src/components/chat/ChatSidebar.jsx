import { motion } from 'framer-motion'
import { Plus, MessageCircle, Trash2, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatRelativeTime, truncateText } from '@/lib/utils'

export default function ChatSidebar({ 
  chats, 
  currentChatId, 
  onSelectChat, 
  onNewChat, 
  onDeleteChat,
  isOpen,
  onClose 
}) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        className={`fixed lg:relative left-0 top-0 h-full w-72 bg-card border-r z-50 lg:z-0 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform lg:transition-none`}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Chat History</h2>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-accent rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button 
            onClick={onNewChat} 
            className="w-full" 
            variant="gradient"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin">
          {chats.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8 px-4">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No chat history yet</p>
              <p className="mt-1">Start a new conversation!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {chats.map((chat) => (
                <motion.div
                  key={chat._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative"
                >
                  <button
                    onClick={() => onSelectChat(chat._id)}
                    className={`w-full text-left p-3 rounded-xl transition-colors ${
                      currentChatId === chat._id
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {truncateText(chat.title, 30)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(chat.lastMessageAt || chat.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChat(chat._id)
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-destructive transition-all"
                    title="Delete chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            💡 Tip: Start with symptoms for better advice
          </p>
        </div>
      </motion.aside>
    </>
  )
}

