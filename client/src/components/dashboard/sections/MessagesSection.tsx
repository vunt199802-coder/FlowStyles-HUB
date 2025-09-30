import { motion } from "framer-motion";
import { MessageSquare, Send, Search, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { getConversations } from "@/services/messages";
import type { Conversation } from "@/types/api";

export function MessagesSection() {
  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ['/api/messages'],
    queryFn: getConversations,
    refetchInterval: 45000, // Poll every 45 seconds
  });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
          <MessageSquare className="h-6 w-6 text-purple-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white" data-testid="messages-title">
            Messages
          </h2>
          <p className="text-slate-400">Communicate with your service providers</p>
        </div>
        
        <div className="relative">
          <input 
            type="search" 
            placeholder="Search messages..." 
            className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
            data-testid="search-messages"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </motion.div>

      {isLoading ? (
        <div className="text-center text-slate-400 py-12">Loading messages...</div>
      ) : conversations.length === 0 ? (
        <div className="text-center text-slate-400 py-12">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-slate-600" />
          <p className="text-lg mb-2">No messages yet</p>
          <p className="text-sm">Start a conversation with a service provider!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map((conversation, index) => {
            const otherParticipant = conversation.participants[0];
            const hasUnread = conversation.unreadCount > 0;
            const initials = otherParticipant?.fullName
              ?.split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase() || otherParticipant?.username?.substring(0, 2).toUpperCase() || '??';
            
            return (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group relative cursor-pointer"
                data-testid={`message-${conversation.id}`}
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${
                  hasUnread 
                    ? 'from-cyan-500/20 to-blue-500/20' 
                    : 'from-slate-500/10 to-slate-600/10'
                } rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-500`}></div>
                
                <div className="relative p-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold ${
                      hasUnread ? 'ring-2 ring-cyan-400/50' : ''
                    }`}>
                      {initials}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-white">
                            {otherParticipant?.fullName || otherParticipant?.username || 'Unknown'}
                          </h3>
                          {hasUnread && (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                              <span className="text-xs text-cyan-400">{conversation.unreadCount}</span>
                            </div>
                          )}
                        </div>
                        {conversation.lastMessage && (
                          <span className="text-sm text-slate-400">
                            {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      
                      {conversation.lastMessage && (
                        <p className="text-slate-300 mb-4 leading-relaxed line-clamp-2">
                          {conversation.lastMessage.content}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-lg text-sm font-medium hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300 flex items-center gap-2"
                          data-testid={`button-reply-${conversation.id}`}
                        >
                          <Send className="h-4 w-4" />
                          Reply
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05, x: 5 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-2"
                          data-testid={`button-view-conversation-${conversation.id}`}
                        >
                          View Conversation <ArrowRight className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
