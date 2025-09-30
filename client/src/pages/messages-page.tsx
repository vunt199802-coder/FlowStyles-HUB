import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Search, RefreshCcw, Loader2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getConversation, sendMessage } from '@/services/messages';

export function MessagesPage() {
  const [conversationIdInput, setConversationIdInput] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [formError, setFormError] = useState('');

  const queryClient = useQueryClient();

  const {
    data: conversation = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['conversation', selectedConversationId],
    queryFn: () => getConversation(selectedConversationId),
    enabled: !!selectedConversationId,
    refetchInterval: 45000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: async () => {
      setMessageContent('');
      await queryClient.invalidateQueries({ queryKey: ['conversation', selectedConversationId] });
    },
  });

  function handleSelectConversation(e: React.FormEvent) {
    e.preventDefault();
    if (!conversationIdInput.trim()) {
      return;
    }
    setSelectedConversationId(conversationIdInput.trim());
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    if (!selectedConversationId) {
      setFormError('Select a conversation before sending a message.');
      return;
    }

    if (!receiverId.trim()) {
      setFormError('Receiver ID is required.');
      return;
    }

    if (!messageContent.trim()) {
      setFormError('Message content cannot be empty.');
      return;
    }

    try {
      await sendMessageMutation.mutateAsync({
        receiverId: receiverId.trim(),
        content: messageContent.trim(),
        ...(bookingId.trim() ? { bookingId: bookingId.trim() } : {}),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message.';
      setFormError(message);
    }
  }

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
          <p className="text-slate-400">Load an existing conversation using its ID and stay in sync.</p>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Conversation Controls</h3>
            <form onSubmit={handleSelectConversation} className="space-y-4">
              <div>
                <label htmlFor="conversationId" className="block text-sm font-medium text-slate-300 mb-2">
                  Conversation ID
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="conversationId"
                    value={conversationIdInput}
                    onChange={(e) => setConversationIdInput(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter conversation identifier"
                    data-testid="input-conversation-id"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                data-testid="button-load-conversation"
              >
                Load Conversation
              </motion.button>
            </form>

            {selectedConversationId && (
              <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
                <span>Active ID: <span className="text-white font-medium">{selectedConversationId}</span></span>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  data-testid="button-refresh-conversation"
                >
                  {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                  Refresh
                </button>
              </div>
            )}
          </div>

          <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Send a Message</h3>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label htmlFor="receiverId" className="block text-sm font-medium text-slate-300 mb-2">
                  Receiver ID
                </label>
                <input
                  id="receiverId"
                  value={receiverId}
                  onChange={(e) => setReceiverId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Target user id"
                  data-testid="input-receiver-id"
                />
              </div>

              <div>
                <label htmlFor="bookingId" className="block text-sm font-medium text-slate-300 mb-2">
                  Booking ID (optional)
                </label>
                <input
                  id="bookingId"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Attach to a booking"
                  data-testid="input-booking-id"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Write your message"
                  data-testid="input-message"
                />
              </div>

              {formError && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm" data-testid="error-message">
                  {formError}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={sendMessageMutation.isPending}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-send-message"
              >
                {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Conversation Thread</h3>
            {selectedConversationId && (
              <span className="text-xs text-slate-400">
                Auto-refresh every 45s
              </span>
            )}
          </div>

          {!selectedConversationId && (
            <div className="text-sm text-slate-400">
              Enter a conversation ID to load its messages. Conversation discovery APIs are coming soon.
            </div>
          )}

          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((key) => (
                <div key={key} className="h-20 bg-slate-700/40 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {isError && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {(error as Error)?.message || 'Failed to load conversation.'}
            </div>
          )}

          {!isLoading && !isError && conversation.length === 0 && selectedConversationId && (
            <div className="text-sm text-slate-400">
              No messages yet for this conversation.
            </div>
          )}

          <div className="space-y-4">
            {conversation.map((message) => (
              <div
                key={message.id}
                className="p-4 bg-slate-900/60 border border-slate-700/40 rounded-xl"
                data-testid={`message-${message.id}`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>
                    From <span className="text-slate-200 font-medium">{message.senderId}</span> →{' '}
                    <span className="text-slate-200 font-medium">{message.receiverId}</span>
                  </span>
                  <span>{new Date(message.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-slate-100 leading-relaxed whitespace-pre-wrap">{message.content}</p>
                {message.bookingId && (
                  <div className="mt-2 text-xs text-slate-400">
                    Booking: <span className="text-slate-200">{message.bookingId}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
