// Server-side seed for the Firestore-backed app. Runs once per project, guarded by a
// `meta/seedVersion` doc, so it never re-seeds/overwrites data an admin has since edited.
import type { Firestore } from 'firebase-admin/firestore';
import bcrypt from 'bcryptjs';
import { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } from './demo-credentials';
import { nowIso } from './utils';

const SEED_VERSION = '1';

type TierInput = { lengthLabel: string; price: number; whatsIncluded: string };
type ServiceInput = { name: string; description?: string; tiers: TierInput[] };
type CategoryInput = { slug: string; name: string; description: string; services: ServiceInput[] };

const CATALOG: CategoryInput[] = [
  {
    slug: 'mandala-art',
    name: 'Mandala Art',
    description: 'Mandala belt designs for wrist and hand.',
    services: [
      {
        name: 'Mandala Art',
        tiers: [
          { lengthLabel: '2 Finger Mandala Belt', price: 150, whatsIncluded: '2 Finger Mandala Belt' },
          { lengthLabel: 'Mandala Art with Belt', price: 300, whatsIncluded: 'Mandala Art with Belt' },
        ],
      },
    ],
  },
  {
    slug: 'arabic-mehndi',
    name: 'Arabic Mehndi',
    description: 'Bold flowing floral vines and heavy Arabic patterns.',
    services: [
      {
        name: 'Arabic Mehndi',
        tiers: [
          { lengthLabel: 'Half Hand', price: 300, whatsIncluded: 'Arabic Half Hand' },
          { lengthLabel: 'Full Hand', price: 500, whatsIncluded: 'Arabic Full Hand' },
        ],
      },
    ],
  },
  {
    slug: 'sider-mehndi',
    name: 'Sider Mehndi',
    description: 'Sider style designs in multiple lengths.',
    services: [
      {
        name: 'Sider Mehndi',
        tiers: [
          { lengthLabel: '4 Finger Sider', price: 400, whatsIncluded: '4 Finger Sider' },
          { lengthLabel: 'Half Sider', price: 550, whatsIncluded: 'Half Sider' },
          { lengthLabel: 'Full Sider', price: 900, whatsIncluded: 'Full Sider' },
        ],
      },
    ],
  },
  {
    slug: 'bridal-mehndi',
    name: 'Bridal Mehndi',
    description: 'Elaborate bridal designs with feet included.',
    services: [
      {
        name: 'Bridal Mehndi',
        tiers: [
          { lengthLabel: 'Bridal Mehndi', price: 4500, whatsIncluded: 'Full Bridal Mehndi' },
        ],
      },
    ],
  },
  {
    slug: 'engagement-mehndi',
    name: 'Engagement Mehndi',
    description: 'Ring ceremony themed designs with figures.',
    services: [
      {
        name: 'Engagement Mehndi',
        tiers: [
          { lengthLabel: 'Engagement Mehndi', price: 3500, whatsIncluded: 'Full Engagement Mehndi' },
        ],
      },
    ],
  },
];

const TESTIMONIALS = [
  { customerName: 'Priya S.', message: 'Dhara did my bridal mehndi and it was absolutely stunning. Everyone at the wedding was asking about it!', rating: 5 },
  { customerName: 'Ankita M.', message: 'Beautiful Arabic design, quick and neat application. Highly recommend for engagement functions.', rating: 5 },
  { customerName: 'Rina P.', message: 'Loved the traditional peacock design on my hands. Stain came out gorgeous.', rating: 5 },
];

const GALLERY_ITEMS: { title: string; category: string | null; imageUrl: string }[] = [
  { title: 'Arabic Vine Forearm', category: 'arabic-mehndi', imageUrl: '/gallery/arabic-greenery-forearm.jpg' },
  { title: 'Arabic Floral Forearm', category: 'arabic-mehndi', imageUrl: '/gallery/arabic-outdoor-forearm.jpg' },
  { title: 'Bridal Geometric Elbow Design', category: 'bridal-mehndi', imageUrl: '/gallery/bridal-elbow-geometric.jpg' },
  { title: 'Bridal Full Hand Floral', category: 'bridal-mehndi', imageUrl: '/gallery/bridal-full-hand-floral.jpg' },
  { title: 'Heavy Bridal Elbow Design', category: 'bridal-mehndi', imageUrl: '/gallery/bridal-heavy-elbow-dark.jpg' },
  { title: 'Ornate Peacock Bridal Design', category: 'bridal-mehndi', imageUrl: '/gallery/bridal-peacock-ornate.jpg' },
  { title: 'Mandala Sleeve Design', category: 'mandala-art', imageUrl: '/gallery/designer-mandala-sleeve.jpg' },
  { title: 'Fancy Palm Mandala', category: 'mandala-art', imageUrl: '/gallery/designer-palm-mandala-1.jpg' },
  { title: 'Circular Palm Mandala', category: 'mandala-art', imageUrl: '/gallery/designer-palm-mandala-2.jpg' },
  { title: 'Ring Ceremony Design', category: 'engagement-mehndi', imageUrl: '/gallery/engagement-ring-ceremony.jpg' },
  { title: 'Elephant & Lotus Feet Design', category: null, imageUrl: '/gallery/feet-elephants-lotus.jpg' },
  { title: 'Flamingo Anklet Feet Design', category: null, imageUrl: '/gallery/feet-flamingo-anklet.jpg' },
  { title: 'Peacock Anklet Feet Design', category: null, imageUrl: '/gallery/feet-mandala-anklet.jpg' },
  { title: 'Traditional Elephant Design', category: null, imageUrl: '/gallery/traditional-elephants-backhand.jpg' },
  { title: 'Peacock & Elephant Traditional', category: null, imageUrl: '/gallery/traditional-peacock-elephant.jpg' },
  ...Array.from({ length: 45 }, (_, i) => ({
    title: `Mehndi Design ${i + 1}`,
    category: null,
    imageUrl: `/gallery/pdf-import/mehndi-pdf-p${i + 1}-${i + 1}.jpg`,
  })),
  ...Array.from({ length: 23 }, (_, i) => ({
    title: `Mehandi Design ${i + 1}`,
    category: null,
    imageUrl: `/gallery/pdf-import/mehandi-pdf-p${i + 1}-${i + 1}.jpg`,
  })),
];

const SLOTS = ['10:00-11:00', '11:30-12:30', '14:00-15:00', '15:30-16:30', '17:00-18:00'];

function startOfDayIsoDate(d: Date): string {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy.toISOString();
}

export async function seedIfNeeded(db: Firestore): Promise<void> {
  const metaRef = db.collection('meta').doc('seedVersion');
  const flag = await metaRef.get();
  if (flag.exists && flag.data()?.value === SEED_VERSION) return;

  const now = nowIso();

  if ((await db.collection('serviceCategories').limit(1).get()).empty) {
    for (const [catIndex, cat] of CATALOG.entries()) {
      const catRef = db.collection('serviceCategories').doc();
      await catRef.set({
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        sortOrder: catIndex,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });

      for (const [svcIndex, svc] of cat.services.entries()) {
        const svcRef = db.collection('services').doc();
        await svcRef.set({
          categoryId: catRef.id,
          name: svc.name,
          description: svc.description ?? null,
          isActive: true,
          sortOrder: svcIndex,
          createdAt: now,
          updatedAt: now,
        });

        for (const [tierIndex, tier] of svc.tiers.entries()) {
          await db.collection('servicePricing').doc().set({
            serviceId: svcRef.id,
            lengthLabel: tier.lengthLabel,
            price: tier.price,
            whatsIncluded: tier.whatsIncluded,
            sortOrder: tierIndex,
            isActive: true,
            createdAt: now,
            updatedAt: now,
          });
        }
      }
    }
  }

  const adminRef = db.collection('users').doc(SEED_ADMIN_EMAIL);
  if (!(await adminRef.get()).exists) {
    await adminRef.set({
      email: SEED_ADMIN_EMAIL,
      passwordHash: bcrypt.hashSync(SEED_ADMIN_PASSWORD, 10),
      name: 'Dhara',
      phone: null,
      role: 'ADMIN',
      createdAt: now,
      updatedAt: now,
    });
  }

  if ((await db.collection('availability').limit(1).get()).empty) {
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const iso = startOfDayIsoDate(date);
      const availRef = db.collection('availability').doc(iso);
      await availRef.set({ date: iso, isAvailable: true, note: null, createdAt: now, updatedAt: now });
      for (const slot of SLOTS) {
        const [startTime, endTime] = slot.split('-');
        await db.collection('timeSlots').doc().set({
          availabilityId: availRef.id,
          startTime,
          endTime,
          isBooked: false,
        });
      }
    }
  }

  if ((await db.collection('testimonials').limit(1).get()).empty) {
    for (const t of TESTIMONIALS) {
      await db.collection('testimonials').doc().set({ ...t, isActive: true, createdAt: now, updatedAt: now });
    }
  }

  const existingGallery = await db.collection('galleryItems').select('imageUrl').get();
  const existingUrls = new Set(existingGallery.docs.map((d) => d.data().imageUrl as string));
  const missingGalleryItems = GALLERY_ITEMS.filter((item) => !existingUrls.has(item.imageUrl));
  if (missingGalleryItems.length > 0) {
    let sortOrder = existingGallery.size;
    for (const item of missingGalleryItems) {
      await db.collection('galleryItems').doc().set({ ...item, sortOrder: sortOrder++, isActive: true, createdAt: now, updatedAt: now });
    }
  }

  await metaRef.set({ value: SEED_VERSION });
}
