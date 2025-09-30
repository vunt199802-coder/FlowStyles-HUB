import { apiFetch } from '@/api/client';
import type { Message } from '@/types/api';

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
