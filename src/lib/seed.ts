// Seed data ported verbatim from apps/api/prisma/seed.ts. Runs once on first load,
// guarded by a `seedVersion` flag in the `meta` table so it never re-seeds/overwrites
// data a user has since edited.
import bcrypt from 'bcryptjs';
import { db } from './db';
import { uid, nowIso } from './utils';

const SEED_VERSION = '2';
const ADMIN_EMAIL = 'admin@mehndibydhara.com';
const ADMIN_PASSWORD = 'ChangeMe123!';

type TierInput = { lengthLabel: string; price: number; whatsIncluded: string };
type ServiceInput = { name: string; description?: string; tiers: TierInput[] };
type CategoryInput = { slug: string; name: string; description: string; services: ServiceInput[] };

const CATALOG: CategoryInput[] = [
  {
    slug: 'arabic-mehndi',
    name: 'Arabic Mehndi',
    description: 'Bold flowing floral vines and heavy Arabic patterns.',
    services: [
      {
        name: 'Arabic Mehndi',
        tiers: [
          { lengthLabel: 'Palm Length', price: 200, whatsIncluded: '400 Heavy Arabic' },
          { lengthLabel: '2 Finger above Palm / Wrist Length', price: 250, whatsIncluded: '600 Heavy Arabic' },
          { lengthLabel: '4 Finger above Palm / Bangle Length', price: 300, whatsIncluded: '800 Heavy Arabic' },
          { lengthLabel: '1/2 Hand / Half Hand', price: 350, whatsIncluded: '1000 Heavy Arabic' },
          { lengthLabel: '3/4th Length', price: 400, whatsIncluded: '1500 Heavy Arabic' },
          { lengthLabel: 'Elbow Length', price: 450, whatsIncluded: '1800 Heavy Arabic' },
        ],
      },
    ],
  },
  {
    slug: 'designer-fancy-mehndi',
    name: 'Designer / Fancy Mehndi',
    description: 'Intricate mandala and fancy heavy designs.',
    services: [
      {
        name: 'Designer / Fancy Mehndi',
        tiers: [
          { lengthLabel: 'Palm Length', price: 250, whatsIncluded: 'Fancy/Mandala' },
          { lengthLabel: '2 Finger above Palm / Wrist Length', price: 300, whatsIncluded: '700 Intricate Heavy design' },
          { lengthLabel: '4 Finger above Palm / Bangle Length', price: 400, whatsIncluded: '1100 Intricate Heavy Designs' },
          { lengthLabel: '1/2 Hand / Half Hand', price: 550, whatsIncluded: '1500 Intricate Heavy design' },
        ],
      },
    ],
  },
  {
    slug: 'indian-traditional',
    name: 'Indian Traditional',
    description: 'Classic Indian motifs with peacocks and elephants.',
    services: [
      {
        name: 'Indian Traditional',
        tiers: [
          { lengthLabel: 'Palm Length', price: 350, whatsIncluded: 'Designer' },
          { lengthLabel: '2 Finger above Palm / Wrist Length', price: 450, whatsIncluded: 'Heavy Designer' },
          { lengthLabel: '4 Finger above Palm / Bangle Length', price: 500, whatsIncluded: 'Heavy Designer' },
          { lengthLabel: '1/2 Hand / Half Hand', price: 550, whatsIncluded: 'With Peacock, Elephant' },
          { lengthLabel: '3/4th Length', price: 650, whatsIncluded: 'With Peacock, Elephant' },
          { lengthLabel: 'Elbow Length', price: 900, whatsIncluded: 'With Peacock, Elephant' },
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
          { lengthLabel: '4 Finger above Palm / Bangle Length', price: 600, whatsIncluded: 'Basic design with ring ceremony figure (rings, name or letter)' },
          { lengthLabel: '1/2 Hand / Half Hand', price: 800, whatsIncluded: 'Heavy with Peacock + elephant' },
          { lengthLabel: '3/4th Length', price: 900, whatsIncluded: 'Heavy with Ring ceremony Figures' },
          { lengthLabel: 'Elbow Length', price: 1200, whatsIncluded: 'Customised couple figure design' },
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
          { lengthLabel: '1/2 Hand / Half Hand', price: 1000, whatsIncluded: 'Basic Bridal design with ankle length feet design' },
          { lengthLabel: '3/4th Length', price: 1500, whatsIncluded: 'Basic figure kalash, ganpavesh with ankle length feet design' },
          { lengthLabel: 'Elbow Length', price: 3000, whatsIncluded: '1 Bride 1 groom figure ankle length feet design' },
          { lengthLabel: 'Elbow Length (Standing Figures)', price: 3500, whatsIncluded: '1 standing Bride 1 groom standing figure ankle length' },
          { lengthLabel: 'Elbow Length (Intricate)', price: 4500, whatsIncluded: 'Intricate bride groom + Shiv Parvati / Radha Krishna / Vishnu Lakshmi figure' },
        ],
      },
    ],
  },
  {
    slug: 'feet-mehndi',
    name: 'Feet Mehndi',
    description: 'Beautiful feet designs to complement any look.',
    services: [
      {
        name: 'Feet Mehndi',
        tiers: [
          { lengthLabel: '2 Finger above ankle length', price: 1000, whatsIncluded: 'Per figure extra' },
          { lengthLabel: '4 Finger above ankle length', price: 1500, whatsIncluded: 'Per figure extra' },
          { lengthLabel: 'Peacock elephant', price: 500, whatsIncluded: 'Per figure extra' },
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

const GALLERY_ITEMS = [
  { title: 'Arabic Vine Forearm', category: 'arabic-mehndi', imageUrl: '/gallery/arabic-greenery-forearm.jpg' },
  { title: 'Arabic Floral Forearm', category: 'arabic-mehndi', imageUrl: '/gallery/arabic-outdoor-forearm.jpg' },
  { title: 'Bridal Geometric Elbow Design', category: 'bridal-mehndi', imageUrl: '/gallery/bridal-elbow-geometric.jpg' },
  { title: 'Bridal Full Hand Floral', category: 'bridal-mehndi', imageUrl: '/gallery/bridal-full-hand-floral.jpg' },
  { title: 'Heavy Bridal Elbow Design', category: 'bridal-mehndi', imageUrl: '/gallery/bridal-heavy-elbow-dark.jpg' },
  { title: 'Ornate Peacock Bridal Design', category: 'bridal-mehndi', imageUrl: '/gallery/bridal-peacock-ornate.jpg' },
  { title: 'Mandala Sleeve Design', category: 'designer-fancy-mehndi', imageUrl: '/gallery/designer-mandala-sleeve.jpg' },
  { title: 'Fancy Palm Mandala', category: 'designer-fancy-mehndi', imageUrl: '/gallery/designer-palm-mandala-1.jpg' },
  { title: 'Circular Palm Mandala', category: 'designer-fancy-mehndi', imageUrl: '/gallery/designer-palm-mandala-2.jpg' },
  { title: 'Ring Ceremony Design', category: 'engagement-mehndi', imageUrl: '/gallery/engagement-ring-ceremony.jpg' },
  { title: 'Elephant & Lotus Feet Design', category: 'feet-mehndi', imageUrl: '/gallery/feet-elephants-lotus.jpg' },
  { title: 'Flamingo Anklet Feet Design', category: 'feet-mehndi', imageUrl: '/gallery/feet-flamingo-anklet.jpg' },
  { title: 'Peacock Anklet Feet Design', category: 'feet-mehndi', imageUrl: '/gallery/feet-mandala-anklet.jpg' },
  { title: 'Traditional Elephant Design', category: 'indian-traditional', imageUrl: '/gallery/traditional-elephants-backhand.jpg' },
  { title: 'Peacock & Elephant Traditional', category: 'indian-traditional', imageUrl: '/gallery/traditional-peacock-elephant.jpg' },
  ...Array.from({ length: 45 }, (_, i) => ({
    title: `Mehndi Design ${i + 1}`,
    category: null as string | null,
    imageUrl: `/gallery/pdf-import/mehndi-pdf-p${i + 1}-${i + 1}.jpg`,
  })),
  ...Array.from({ length: 23 }, (_, i) => ({
    title: `Mehandi Design ${i + 1}`,
    category: null as string | null,
    imageUrl: `/gallery/pdf-import/mehandi-pdf-p${i + 1}-${i + 1}.jpg`,
  })),
];

const SLOTS = ['10:00-11:00', '11:30-12:30', '14:00-15:00', '15:30-16:30', '17:00-18:00'];

function startOfDayIso(d: Date): string {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy.toISOString();
}

export async function seedIfNeeded(): Promise<void> {
  const flag = await db.meta.get('seedVersion');
  if (flag?.value === SEED_VERSION) return;

  const now = nowIso();

  await db.transaction(
    'rw',
    [db.categories, db.services, db.pricing, db.users, db.availability, db.timeSlots, db.testimonials, db.gallery, db.meta],
    async () => {
      // Only seed each sub-area if empty, so re-running (e.g. schema bump) never clobbers edits.
      if ((await db.categories.count()) === 0) {
        for (const [catIndex, cat] of CATALOG.entries()) {
          const categoryId = uid();
          await db.categories.add({
            id: categoryId,
            slug: cat.slug,
            name: cat.name,
            description: cat.description,
            sortOrder: catIndex,
            isActive: true,
            createdAt: now,
            updatedAt: now,
          });

          for (const [svcIndex, svc] of cat.services.entries()) {
            const serviceId = uid();
            await db.services.add({
              id: serviceId,
              categoryId,
              name: svc.name,
              description: svc.description ?? null,
              isActive: true,
              sortOrder: svcIndex,
              createdAt: now,
              updatedAt: now,
            });

            for (const [tierIndex, tier] of svc.tiers.entries()) {
              await db.pricing.add({
                id: uid(),
                serviceId,
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

      if ((await db.users.where('email').equals(ADMIN_EMAIL).count()) === 0) {
        const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10);
        await db.users.add({
          id: uid(),
          email: ADMIN_EMAIL,
          passwordHash,
          name: 'Dhara',
          role: 'ADMIN',
          createdAt: now,
          updatedAt: now,
        });
      }

      if ((await db.availability.count()) === 0) {
        const today = new Date();
        for (let i = 1; i <= 14; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const availabilityId = uid();
          await db.availability.add({
            id: availabilityId,
            date: startOfDayIso(date),
            isAvailable: true,
            note: null,
            createdAt: now,
            updatedAt: now,
          });
          for (const slot of SLOTS) {
            const [startTime, endTime] = slot.split('-');
            await db.timeSlots.add({
              id: uid(),
              availabilityId,
              startTime,
              endTime,
              isBooked: false,
            });
          }
        }
      }

      if ((await db.testimonials.count()) === 0) {
        for (const t of TESTIMONIALS) {
          await db.testimonials.add({
            id: uid(),
            customerName: t.customerName,
            message: t.message,
            rating: t.rating,
            isActive: true,
            createdAt: now,
            updatedAt: now,
          });
        }
      }

      {
        const existingUrls = new Set((await db.gallery.toArray()).map((g) => g.imageUrl));
        let sortOrder = await db.gallery.count();
        for (const item of GALLERY_ITEMS) {
          if (existingUrls.has(item.imageUrl)) continue;
          await db.gallery.add({
            id: uid(),
            imageUrl: item.imageUrl,
            title: item.title,
            category: item.category,
            sortOrder: sortOrder++,
            isActive: true,
            createdAt: now,
            updatedAt: now,
          });
        }
      }

      await db.meta.put({ key: 'seedVersion', value: SEED_VERSION });
    },
  );
}

/** Wipes ALL local data and reseeds from scratch (used by the admin "Reset Local Data" action). */
export async function resetAndReseed(): Promise<void> {
  await db.transaction(
    'rw',
    [
      db.categories, db.services, db.pricing, db.availability, db.timeSlots,
      db.customers, db.bookings, db.statusHistory, db.payments,
      db.testimonials, db.gallery, db.contactMessages, db.users, db.meta,
    ],
    async () => {
      await Promise.all([
        db.categories.clear(),
        db.services.clear(),
        db.pricing.clear(),
        db.availability.clear(),
        db.timeSlots.clear(),
        db.customers.clear(),
        db.bookings.clear(),
        db.statusHistory.clear(),
        db.payments.clear(),
        db.testimonials.clear(),
        db.gallery.clear(),
        db.contactMessages.clear(),
        db.users.clear(),
        db.meta.clear(),
      ]);
    },
  );
  await seedIfNeeded();
}

export const SEED_ADMIN_EMAIL = ADMIN_EMAIL;
export const SEED_ADMIN_PASSWORD = ADMIN_PASSWORD;
