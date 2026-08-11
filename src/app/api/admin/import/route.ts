import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';
import { jsonError } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

const COLLECTIONS = [
  'users', 'customers', 'serviceCategories', 'services', 'servicePricing', 'availability', 'timeSlots',
  'bookings', 'bookingStatusHistory', 'payments', 'galleryItems', 'testimonials', 'contactMessages',
  'notifications', 'notificationEvents',
] as const;

export async function POST(req: NextRequest) {
  await ensureSeeded();
  try {
    const body = (await req.json()) as { data?: Record<string, { id: string; [key: string]: unknown }[]> };
    if (!body.data) throw new Error('Invalid backup file: missing "data" object.');

    for (const name of COLLECTIONS) {
      const existing = await db.collection(name).get();
      let batch = db.batch();
      let ops = 0;
      for (const doc of existing.docs) {
        batch.delete(doc.ref);
        if (++ops >= 400) { await batch.commit(); batch = db.batch(); ops = 0; }
      }
      if (ops > 0) await batch.commit();

      const rows = body.data?.[name];
      if (!Array.isArray(rows) || rows.length === 0) continue;
      batch = db.batch();
      ops = 0;
      for (const row of rows) {
        const { id, ...fields } = row;
        batch.set(db.collection(name).doc(id), fields);
        if (++ops >= 400) { await batch.commit(); batch = db.batch(); ops = 0; }
      }
      if (ops > 0) await batch.commit();
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}
