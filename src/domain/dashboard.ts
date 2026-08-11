import type { DashboardData } from '@/lib/types';

export async function getDashboardData(): Promise<DashboardData> {
  const res = await fetch('/api/dashboard', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load dashboard data');
  return res.json();
}
