import { db } from '@/lib/db';
import { uid, nowIso } from '@/lib/utils';
import type { DBContactMessage } from '@/lib/types';

export async function createContactMessage(input: { name: string; email?: string | null; phone?: string | null; message: string }): Promise<DBContactMessage> {
  const item: DBContactMessage = {
    id: uid(),
    name: input.name,
    email: input.email ?? null,
    phone: input.phone ?? null,
    message: input.message,
    isRead: false,
    createdAt: nowIso(),
  };
  await db.contactMessages.add(item);
  return item;
}

export async function listContactMessages(): Promise<DBContactMessage[]> {
  return db.contactMessages.orderBy('createdAt').reverse().toArray();
}

export async function markContactMessageRead(id: string, isRead = true): Promise<void> {
  await db.contactMessages.update(id, { isRead });
}

export async function deleteContactMessage(id: string): Promise<void> {
  await db.contactMessages.delete(id);
}
