'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { setDeviceSession } from '@/lib/device';

export default function RegisterPage() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('Player 1');
  const [screenProfile, setScreenProfile] = useState('DEFAULT');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<any>('/devices/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code, name, screenProfile }),
      });
      setDeviceSession(data);
      window.location.href = '/play';
      } catch (e: any) {
        setError(e?.message ?? '등록에 실패했습니다');
      } finally {

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">디바이스 등록</h1>
        <p className="mt-1 text-sm text-white/70">관리자 → 디바이스에서 발급한 등록 코드를 입력하세요.</p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="text-sm">등록 코드</label>
            <input className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2" value={code} onChange={(e) => setCode(e.target.value)} placeholder="ABCD-EFGH" />
          </div>
          <div>
            <label className="text-sm">디바이스 이름</label>
            <input className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">화면 프로필</label>
            <input className="mt-1 w-full rounded-xl bg-white/10 px-3 py-2" value={screenProfile} onChange={(e) => setScreenProfile(e.target.value)} />
          </div>

          {error ? <div className="text-sm text-red-400">{error}</div> : null}

          <button disabled={loading} className="w-full rounded-xl bg-white px-4 py-2 text-black font-semibold disabled:opacity-60">
            {loading ? '등록 중…' : '등록'}
          </button>
        </form>
      </div>
    </main>
  );
}
