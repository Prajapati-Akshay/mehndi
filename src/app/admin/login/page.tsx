'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogoMark } from '@/components/logo';
import { getSession, login } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      if (session) router.replace('/admin/dashboard');
    });
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
    <div className="min-h-[80vh] flex items-center justify-center bg-mehndi-pattern px-4 py-16">
      <Card className="w-full max-w-md p-8 sm:p-10 border border-gold-300/80 shadow-luxury">
        <div className="text-center">
          <LogoMark size={48} className="mx-auto" />
          <h1 className="mt-4 font-serif text-2xl font-bold text-forest-950">Admin Portal</h1>
          <p className="mt-1 text-xs text-forest-800/70">Mehndi By Dhara Management System</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-forest-900">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mehndibydhara.com"
              className="mt-1.5 w-full rounded-2xl border border-gold-300 bg-white px-4 py-3 text-sm text-forest-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-forest-900">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-1.5 w-full rounded-2xl border border-gold-300 bg-white px-4 py-3 text-sm text-forest-950 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
          {error && <p className="text-sm text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">{error}</p>}
          <Button type="submit" variant="luxury" disabled={loading} className="w-full py-3.5">
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
