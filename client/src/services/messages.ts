import { apiFetch } from '@/api/client';
import type { Message } from '@/types/api';

export async function getConversation(conversationId: string): Promise<Message[]> {
  const response = await apiFetch(`/api/messages/${conversationId}`);
  return response.json();
}

export async function sendMessage(data: {
  receiverId: string;
  content: string;
  bookingId?: string;
}): Promise<Message> {
  const response = await apiFetch('/api/messages', {
    method: 'POST',
    body: JSON.stringify({
      receiverId: data.receiverId,
      content: data.content,
      ...(data.bookingId ? { bookingId: data.bookingId } : {}),
    }),
  });

  return response.json();
}
