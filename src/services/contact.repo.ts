import type { DBContactMessage } from '@/lib/types';

export async function createContactMessage(input: { name: string; email?: string | null; phone?: string | null; message: string }): Promise<DBContactMessage> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const { message } = await res.json();
  return message;
}

export async function listContactMessages(): Promise<DBContactMessage[]> {
  const res = await fetch('/api/contact', { cache: 'no-store' });
  const { messages } = await res.json();
  return messages;
}

export async function markContactMessageRead(id: string, isRead = true): Promise<void> {
  await fetch(`/api/contact/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isRead }),
  });
}

export async function deleteContactMessage(id: string): Promise<void> {
  await fetch(`/api/contact/${id}`, { method: 'DELETE' });
}
