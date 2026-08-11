import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

function initApp(): App {
  if (getApps().length) return getApps()[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.',
    );
  }

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

let firestoreInstance: Firestore | null = null;
function getDb(): Firestore {
  if (!firestoreInstance) firestoreInstance = getFirestore(initApp());
  return firestoreInstance;
}

// Lazily initialized on first actual use (not at module load), so importing this module —
// e.g. while Next.js collects route metadata at build time — never requires credentials to
// already be present. Behaves exactly like a real Firestore instance at every call site.
export const db: Firestore = new Proxy({} as Firestore, {
  get(_target, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop);
    return typeof value === 'function' ? value.bind(real) : value;
  },
});

// Guarded, run-once seed so every API route/serverless invocation can assume the
// catalog/admin user exist without re-seeding on every cold start.
const globalForSeed = globalThis as unknown as { seeded?: Promise<void> };

export function ensureSeeded(): Promise<void> {
  if (!globalForSeed.seeded) {
    globalForSeed.seeded = import('./seed.server').then((m) => m.seedIfNeeded(db));
  }
  return globalForSeed.seeded;
}
