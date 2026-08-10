# Mehndi By Dhara — Standalone (Backend-Free) Web App

A fully independent clone of `apps/web` that reproduces the Mehndi By Dhara marketing site,
6-step booking wizard, and admin panel **without any backend**. Everything — services,
pricing, bookings, customers, availability, gallery, testimonials, contact messages, and the
admin login — lives entirely in the browser via IndexedDB (Dexie). `apps/api` is never called
and does not need to be running.

## Architecture

```
UI (src/app/**, src/components/**)
   -> src/domain/*.ts        (business rules: pricing, booking validation/conflicts, status
                               transitions, dashboard aggregation — plain TypeScript, ported
                               from apps/api/src/**/*.service.ts and booking-pricing.util.ts)
   -> src/services/*.repo.ts (repository layer — the ONLY code that touches Dexie directly)
   -> src/lib/db.ts          (Dexie/IndexedDB schema)
```

- **No cross-package imports.** Nothing here imports from `apps/web` or `apps/api`; all shared
  visual code (Tailwind palette, fonts, components, copy) was re-implemented locally.
- **No environment variables.** There is no `NEXT_PUBLIC_API_URL` or equivalent — the app is
  self-contained by construction.
- Components never call Dexie directly; they call functions in `src/services/*.repo.ts`, which
  in turn use `src/domain/*.ts` for anything involving business rules (pricing math, booking
  validation, conflict detection, status-transition side effects).

## Install, run, build

```bash
cd apps/web-standalone
npm install
npm run dev     # http://localhost:3100 — apps/api never needs to run
npm run build
npm run start
```

## Data storage & seeding

All data is stored in the browser's IndexedDB, in a database named
`mehndi-by-dhara-standalone` (see `src/lib/db.ts`). On first load, `src/lib/seed.ts` seeds:

- 6 service categories / services with their real pricing tiers, ported verbatim from
  `apps/api/prisma/seed.ts` (Arabic, Designer/Fancy, Indian Traditional, Engagement, Bridal,
  Feet Mehndi).
- 3 testimonials and 15 gallery items (images copied from `apps/web/public/gallery`).
- 14 days of availability, each with the same 5 fixed time slots as the original
  (`10:00-11:00, 11:30-12:30, 14:00-15:00, 15:30-16:30, 17:00-18:00`).
- One admin user: **admin@mehndibydhara.com / ChangeMe123!**

Seeding is guarded by a `seedVersion` flag stored in a `meta` table, and only fills tables that
are still empty — so it runs exactly once and will never silently overwrite data you've since
created or edited, even across reloads.

## Import / Export / Reset

Under **Admin → Settings** (`/admin/settings`):

- **Export Data** downloads every table as one JSON file.
- **Import Data** restores from a previously exported JSON file (replaces matching tables).
- **Reset Local Data** (double confirm-gated) wipes everything and reseeds the original demo
  catalog from scratch.

## Business logic parity

- `src/domain/pricing.ts` — `total = pricePerPerson * numberOfPeople`,
  `advance = ceil(total * 0.5)`, `remaining = total - advance` (identical to
  `apps/api/src/bookings/booking-pricing.util.ts`).
- `src/domain/booking.ts` — booking creation validates terms acceptance, people count, date not
  in the past, active service/pricing, and slot conflicts (same rules as
  `apps/api/src/bookings/bookings.service.ts`); status transitions free the time slot on
  CANCELLED/REJECTED and set payment status to PARTIAL on CONFIRMED / PAID on COMPLETED, and
  record `BookingStatusHistory` entries.
- `src/domain/dashboard.ts` — status counts, revenue (CONFIRMED + COMPLETED), and
  upcoming/recent booking lists, mirroring the original `/admin/dashboard` aggregation.

## Limitations (read before treating this as production-ready)

- **No backend, ever.** There is no server-side validation, rate limiting, or persistence
  beyond this one browser/profile. Clearing site data, using a different browser, or private/
  incognito mode all start from a fresh seed.
- **FE-only auth is not secure.** The admin "login" checks a bcrypt hash stored in the same
  IndexedDB database the browser can freely read, and the "session" is just a flag in
  `localStorage`. Anyone with DevTools access can bypass it. Do not reuse this pattern, or the
  demo admin password, for anything real.
- **No real notifications.** SMS/WhatsApp confirmations are not sent; the "Confirm via
  WhatsApp" button opens `wa.me` with a pre-filled message, same as the original UI, but no
  automatic message is sent server-side.
- **Single-device data.** Because everything lives in one browser's IndexedDB, nothing syncs
  between devices/tabs of different browsers. Use Export/Import to move data manually.
