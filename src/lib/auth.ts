'use client';

// Real server-backed session: an httpOnly cookie set by /api/auth/login, validated against
// the Session table on every /api/auth/me call. Replaces the old localStorage-only fake
// session so the same admin login works consistently from any browser/device.

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
}

export async function getSession(): Promise<AdminUser | null> {
  const res = await fetch('/api/auth/me', { cache: 'no-store' });
  if (!res.ok) return null;
  const { user } = await res.json();
  return user as AdminUser;
}

export async function clearSession(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
}

export async function login(email: string, password: string): Promise<AdminUser> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? 'Invalid email or password');
  }
  const { user } = await res.json();
  return user as AdminUser;
}
