import { NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

const COLLECTIONS = [
  'users', 'customers', 'serviceCategories', 'services', 'servicePricing', 'availability', 'timeSlots',
  'bookings', 'bookingStatusHistory', 'payments', 'galleryItems', 'testimonials', 'contactMessages',
  'notifications', 'notificationEvents',
] as const;

export async function GET() {
  await ensureSeeded();
  const dump: Record<string, unknown[]> = {};
  for (const name of COLLECTIONS) {
    const snap = await db.collection(name).get();
    dump[name] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return NextResponse.json({ version: 1, exportedAt: new Date().toISOString(), data: dump });
}
