import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth.server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  return NextResponse.json({ user: admin });
}
