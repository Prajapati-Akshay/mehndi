'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogoMark } from '@/components/logo';
import { getSession, login } from '@/lib/auth';
import { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } from '@/lib/seed';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSession()) router.replace('/admin/dashboard');
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-mehndi-pattern px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          <LogoMark size={48} className="mx-auto" />
          <h1 className="mt-4 font-serif text-2xl text-forest-900">Admin Login</h1>
          <p className="mt-1 text-sm text-forest-800/60">Mehndi By Dhara Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-forest-900">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gold-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-forest-900">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gold-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-300"
            />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-forest-800/40">
          Demo credentials: {SEED_ADMIN_EMAIL} / {SEED_ADMIN_PASSWORD}
        </p>
      </Card>
    </div>
  );
}
