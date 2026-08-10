'use client';

import { useEffect, useState } from 'react';
import { seedIfNeeded } from '@/lib/seed';

/** Runs the one-time Dexie seed before rendering children, so every page can assume data exists. */
export function SeedProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedIfNeeded()
      .catch((err) => console.error('Seed failed', err))
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-forest-800/60 text-sm">
        Loading Mehndi By Dhara…
      </div>
    );
  }

  return <>{children}</>;
}
