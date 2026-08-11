import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db, ensureSeeded } from '@/lib/firestore';
import { createSession, sessionCookieOptions } from '@/lib/auth.server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  await ensureSeeded();
  const { email, password } = (await req.json()) as { email?: string; password?: string };
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const userSnap = await db.collection('users').doc(email.toLowerCase()).get();
  const user = userSnap.data() as { email: string; passwordHash: string; name: string; phone: string | null; role: string } | undefined;
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const token = await createSession(userSnap.id);
  const res = NextResponse.json({
    user: { id: userSnap.id, email: user.email, name: user.name, phone: user.phone ?? null, role: user.role },
  });
  const { name, ...options } = sessionCookieOptions();
  res.cookies.set(name, token, options);
  return res;
}
