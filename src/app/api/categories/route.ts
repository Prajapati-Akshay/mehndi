import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSeeded } from '@/lib/firestore';
import { jsonError } from '@/lib/api-utils';
import { nowIso } from '@/lib/utils';
import type { ServiceCategory } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await ensureSeeded();
  const withServices = req.nextUrl.searchParams.get('withServices') === 'true';
  const includeInactive = req.nextUrl.searchParams.get('includeInactive') === 'true';

  const catSnap = await db.collection('serviceCategories').get();
  let categories = catSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  categories.sort((a, b) => a.sortOrder - b.sortOrder);
  if (!includeInactive) categories = categories.filter((c) => c.isActive);

  if (!withServices) {
    return NextResponse.json({ categories });
  }

  const [svcSnap, pricingSnap] = await Promise.all([
    db.collection('services').get(),
    db.collection('servicePricing').get(),
  ]);
  const allServices = svcSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  const allPricing = pricingSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  const result: ServiceCategory[] = categories.map((cat) => {
    let services = allServices.filter((s) => s.categoryId === cat.id);
    if (!includeInactive) services = services.filter((s) => s.isActive);
    services.sort((a, b) => a.sortOrder - b.sortOrder);

    return {
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      services: services.map((svc) => {
        let tiers = allPricing.filter((p) => p.serviceId === svc.id);
        if (!includeInactive) tiers = tiers.filter((t) => t.isActive);
        tiers.sort((a, b) => a.sortOrder - b.sortOrder);
        return {
          id: svc.id,
          name: svc.name,
          description: svc.description,
          pricingTiers: tiers.map((p) => ({
            id: p.id,
            lengthLabel: p.lengthLabel,
            price: p.price,
            whatsIncluded: p.whatsIncluded,
            sortOrder: p.sortOrder,
            isActive: p.isActive,
          })),
        };
      }),
    };
  });

  return NextResponse.json({ categories: result });
}

export async function POST(req: NextRequest) {
  await ensureSeeded();
  try {
    const { slug, name, description } = await req.json();
    const count = (await db.collection('serviceCategories').get()).size;
    const now = nowIso();
    const ref = db.collection('serviceCategories').doc();
    const data = { slug, name, description: description ?? null, sortOrder: count, isActive: true, createdAt: now, updatedAt: now };
    await ref.set(data);
    return NextResponse.json({ category: { id: ref.id, ...data } }, { status: 201 });
  } catch (err) {
    return jsonError(err);
  }
}
