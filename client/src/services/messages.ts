import { apiFetch } from '@/api/client';

export interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    fullName: string;
    username: string;
  }>;
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  bookingId: string | null;
  isRead: boolean;
  createdAt: string;
}

export async function getConversations(): Promise<Conversation[]> {
  const response = await apiFetch('/api/messages');
  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }
  return response.json();
}

export async function getConversation(conversationId: string): Promise<Message[]> {
  const response = await apiFetch(`/api/messages/${conversationId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch conversation');
  }
  return response.json();
}

export async function sendMessage(data: {
  receiverId: string;
  content: string;
  bookingId?: string;
}): Promise<Message> {
  const response = await apiFetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      receiverId: data.receiverId,
      content: data.content,
      bookingId: data.bookingId || null,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  return response.json();
}

export async function markConversationRead(conversationId: string): Promise<void> {
  const response = await apiFetch(`/api/messages/${conversationId}/read`, {
    method: 'PATCH',
  });
  
  if (!response.ok) {
    throw new Error('Failed to mark conversation as read');
  }
}
