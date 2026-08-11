import { NextResponse } from 'next/server';
import { destroySessionByCookie, sessionCookieOptions } from '@/lib/auth.server';

export const dynamic = 'force-dynamic';

export async function POST() {
  await destroySessionByCookie();
  const res = NextResponse.json({ ok: true });
  const { name } = sessionCookieOptions();
  res.cookies.set(name, '', { maxAge: 0, path: '/' });
  return res;
}
