import { NextResponse } from 'next/server';
import { db } from '@/lib/firestore';
import { seedIfNeeded } from '@/lib/seed.server';
import { jsonError } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

const COLLECTIONS = [
  'notificationEvents', 'notifications', 'bookingStatusHistory', 'payments', 'bookings',
  'timeSlots', 'availability', 'servicePricing', 'services', 'serviceCategories',
  'customers', 'testimonials', 'galleryItems', 'contactMessages', 'sessions', 'users', 'meta',
] as const;

export async function POST() {
  try {
    for (const name of COLLECTIONS) {
      const snap = await db.collection(name).get();
      let batch = db.batch();
      let ops = 0;
      for (const doc of snap.docs) {
        batch.delete(doc.ref);
        if (++ops >= 400) { await batch.commit(); batch = db.batch(); ops = 0; }
      }
      if (ops > 0) await batch.commit();
    }
    await seedIfNeeded(db);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return jsonError(err);
  }
}
