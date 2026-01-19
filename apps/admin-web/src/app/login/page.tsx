'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { setSession } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('owner@menucast.local');
  const [password, setPassword] = useState('owner1234!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
      try {
        const data = await apiFetch<any>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        setSession(data);
        window.location.href = '/dashboard';
      } catch (e: any) {
        setError(e?.message ?? '로그인에 실패했습니다');
      } finally {

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border bg-white p-6">
        <h1 className="text-xl font-semibold">메뉴캐스트 관리자</h1>
        <p className="mt-1 text-sm text-gray-600">디바이스, 자산, 플레이리스트, 배포를 관리합니다.</p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <button
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? '로그인 중…' : '로그인'}
          </button>
        </form>
      </div>
    </main>
  );
}
