import { cookies } from 'next/headers';
import { db } from './firestore';

const SESSION_COOKIE = 'mbd_session';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
}

export async function createSession(userEmail: string): Promise<string> {
  const ref = db.collection('sessions').doc();
  await ref.set({
    userId: userEmail,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function destroySessionByCookie(): Promise<void> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    await db.collection('sessions').doc(token).delete().catch(() => undefined);
  }
}

export function sessionCookieOptions() {
  return {
    name: SESSION_COOKIE,
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  };
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;

/** Reads the session cookie from the current request and resolves the logged-in admin, if any. */
export async function getCurrentAdmin(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const sessionSnap = await db.collection('sessions').doc(token).get();
  if (!sessionSnap.exists) return null;
  const session = sessionSnap.data() as { userId: string; expiresAt: string };

  if (new Date(session.expiresAt) < new Date()) {
    await sessionSnap.ref.delete().catch(() => undefined);
    return null;
  }

  const userSnap = await db.collection('users').doc(session.userId).get();
  if (!userSnap.exists) return null;
  const user = userSnap.data() as { email: string; name: string; phone: string | null; role: string };

  return { id: userSnap.id, email: user.email, name: user.name, phone: user.phone ?? null, role: user.role };
}

export async function requireAdmin(): Promise<SessionUser> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error('Not authenticated');
  return admin;
}
