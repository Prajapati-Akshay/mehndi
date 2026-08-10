'use client';

// Lightweight local-session simulation: checks email + bcrypt-compares password against the
// seeded admin's hash in Dexie, stores a session flag in localStorage. There is no real JWT
// or network call — this is a FE-only demo and is NOT secure (see README limitations).
import bcrypt from 'bcryptjs';
import { db } from './db';

const SESSION_KEY = 'mbd_admin_session';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function getSession(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as AdminUser) : null;
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

function setSession(user: AdminUser) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export async function login(email: string, password: string): Promise<AdminUser> {
  const user = await db.users.where('email').equalsIgnoreCase(email).first();
  if (!user) throw new Error('Invalid email or password');
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) throw new Error('Invalid email or password');
  const session: AdminUser = { id: user.id, email: user.email, name: user.name, role: user.role };
  setSession(session);
  return session;
}
