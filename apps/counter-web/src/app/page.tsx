'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';

type Session = { accessToken: string };

function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('menucast.admin.session');
  if (!raw) return null;
  try {
    const s = JSON.parse(raw);
    return { accessToken: s.accessToken };
  } catch {
    return null;
  }
}

export default function CounterPage() {
  const [recent, setRecent] = useState<any[]>([]);
  const [lastNumber, setLastNumber] = useState<number | null>(null);
  const [manual, setManual] = useState('');
  const [resetTo, setResetTo] = useState('1');
  const [error, setError] = useState<string | null>(null);

  const authHeader = useMemo(() => {
    const s = getSession();
    return s ? { authorization: `Bearer ${s.accessToken}` } : {};
  }, []);

  async function refreshRecent() {
    // counter uses admin jwt for now; fetch recent calls via store/me is protected
    // we just call /stores/me to validate token, then load recent via /calls/recent is on player route with device token only
    // for MVP, counter shows last action only in UI; recent list uses internal state.
  }

  async function callNext() {
      setError(null);
      try {
        const data = await apiFetch<any>('/calls/next', {
          method: 'POST',
          headers: authHeader,
          body: JSON.stringify({}),
        });
        setLastNumber(data.number);
        setRecent((prev) => [{ action: 'CALL', number: data.number, ts: new Date().toISOString() }, ...prev].slice(0, 6));
      } catch (e: any) {
        setError(e?.message ?? '실행에 실패했습니다');
      }

  }

  async function callNumber(action: 'CALL' | 'RECALL') {
    setError(null);
    try {
      const n = Number(manual);
      if (!n) throw new Error('번호를 입력하세요');
      const path = action === 'CALL' ? '/calls/call' : '/calls/recall';
      await apiFetch<any>(path, {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify({ number: n }),
      });
      setLastNumber(n);
      setRecent((prev) => [{ action, number: n, ts: new Date().toISOString() }, ...prev].slice(0, 6));
      setManual('');
    } catch (e: any) {
      setError(e?.message ?? '실행에 실패했습니다');
    }
  }

  async function reset() {
    setError(null);
    try {
      const n = Number(resetTo);
      if (!n) throw new Error('초기화 번호를 입력하세요');
      await apiFetch<any>('/calls/reset', {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify({ toNumber: n }),
      });
      setRecent((prev) => [{ action: 'RESET', number: n, ts: new Date().toISOString() }, ...prev].slice(0, 6));
    } catch (e: any) {
      setError(e?.message ?? '실행에 실패했습니다');
    }
  }

  useEffect(() => {
    refreshRecent();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">메뉴캐스트 호출</h1>
          <div className="text-xs text-zinc-400">관리자 로그인 토큰(localStorage)을 사용합니다</div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-zinc-900 p-6">
            <div className="text-sm text-zinc-300">최근 호출</div>
            <div className="mt-2 text-6xl font-black tracking-tight">{lastNumber ?? '—'}</div>
            <button className="mt-4 w-full rounded-xl bg-emerald-500 py-4 text-xl font-bold text-black" onClick={callNext}>
              다음 호출 (+1)
            </button>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-6">
            <div className="text-sm text-zinc-300">직접 호출 / 재호출 / 초기화</div>
            <div className="mt-3 flex gap-2">
              <input className="flex-1 rounded-xl bg-zinc-800 px-4 py-3" placeholder="번호" value={manual} onChange={(e) => setManual(e.target.value)} />
              <button className="rounded-xl bg-blue-500 px-4 py-3 font-semibold text-black" onClick={() => callNumber('CALL')}>
                호출
              </button>
              <button className="rounded-xl bg-amber-400 px-4 py-3 font-semibold text-black" onClick={() => callNumber('RECALL')}>
                재호출
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <input className="flex-1 rounded-xl bg-zinc-800 px-4 py-3" placeholder="초기화 번호" value={resetTo} onChange={(e) => setResetTo(e.target.value)} />
              <button className="rounded-xl bg-zinc-200 px-4 py-3 font-semibold text-black" onClick={reset}>
                초기화
              </button>
            </div>
            {error ? <div className="mt-3 text-sm text-red-400">{error}</div> : null}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-zinc-900 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-300">최근 기록(로컬)</div>
            <div className="text-xs text-zinc-500">최대 6개</div>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {recent.map((r, idx) => (
              <div key={idx} className="rounded-xl bg-zinc-800 p-4">
                <div className="text-xs text-zinc-400">{r.action === 'CALL' ? '호출' : r.action === 'RECALL' ? '재호출' : r.action === 'RESET' ? '초기화' : r.action}</div>
                <div className="mt-1 text-3xl font-bold">{r.number}</div>
                <div className="mt-1 text-xs text-zinc-500">{new Date(r.ts).toLocaleTimeString()}</div>
              </div>
            ))}
            {recent.length === 0 ? <div className="text-sm text-zinc-400">아직 호출이 없습니다.</div> : null}
          </div>
        </div>
      </div>
    </main>
  );
}
