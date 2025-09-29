import { motion } from "framer-motion";
import { MessageSquare, Send, Search, ArrowRight } from "lucide-react";

const messages = [
  {
    id: "1",
    provider: "Sarah Chen",
    service: "Hair Styling",
    lastMessage: "Hi! I'm available for your appointment tomorrow at 2 PM. Looking forward to working with you!",
    time: "5 min ago",
    unread: true,
    avatar: "SC"
  },
  {
    id: "2",
    provider: "Maria Rodriguez",
    service: "Hair Color",
    lastMessage: "Perfect! I have all the products ready for your color treatment. See you next week!",
    time: "1 hour ago",
    unread: false,
    avatar: "MR"
  },
  {
    id: "3",
    provider: "Jennifer Kim",
    service: "Hair Cut & Wash",
    lastMessage: "Thank you for choosing our salon! Your appointment was completed successfully.",
    time: "2 days ago",
    unread: false,
    avatar: "JK"
  }
];

export function MessagesSection() {
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

      <div className="space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="group relative cursor-pointer"
            data-testid={`message-${message.id}`}
          >
            <div className={`absolute -inset-1 bg-gradient-to-r ${
              message.unread 
                ? 'from-cyan-500/20 to-blue-500/20' 
                : 'from-slate-500/10 to-slate-600/10'
            } rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-500`}></div>
            
            <div className="relative p-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold ${
                  message.unread ? 'ring-2 ring-cyan-400/50' : ''
                }`}>
                  {message.avatar}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white">{message.provider}</h3>
                      <span className="text-sm text-slate-400">• {message.service}</span>
                      {message.unread && (
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-sm text-slate-400">{message.time}</span>
                  </div>
                  
                  <p className="text-slate-300 mb-4 leading-relaxed line-clamp-2">
                    {message.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-lg text-sm font-medium hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300 flex items-center gap-2"
                      data-testid={`button-reply-${message.id}`}
                    >
                      <Send className="h-4 w-4" />
                      Reply
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-2"
                      data-testid={`button-view-conversation-${message.id}`}
                    >
                      View Conversation <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
