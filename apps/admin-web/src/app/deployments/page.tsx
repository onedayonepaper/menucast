'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { getSession } from '@/lib/auth';

const layouts = ['SPLIT2', 'SPLIT3_CALL_1450x1080', 'FULLSCREEN'] as const;

function loadLastPlaylistId(): string {
  try {
    return localStorage.getItem('menucast.admin.lastPlaylistId') ?? '';
  } catch {
    return '';
  }
}

export default function DeploymentsPage() {
  const [playlistId, setPlaylistId] = useState('');
  const [layoutPreset, setLayoutPreset] = useState<(typeof layouts)[number]>('SPLIT2');
  const [current, setCurrent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const s = getSession();
    if (!s) {
      window.location.href = '/login';
      return;
    }
    const data = await apiFetch<any>('/deployments/current', {
      headers: { authorization: `Bearer ${s.accessToken}` },
    });
    setCurrent(data);
  }

  useEffect(() => {
    const last = loadLastPlaylistId();
    if (last) setPlaylistId(last);

    refresh().catch((e) => setError(e?.message ?? '불러오기에 실패했습니다'));
  }, []);

  async function deploy() {
    const s = getSession();
    if (!s) return;
    setError(null);
    try {
      const dep = await apiFetch<any>('/deployments', {
        method: 'POST',
        headers: { authorization: `Bearer ${s.accessToken}` },
        body: JSON.stringify({
          targetType: 'STORE_ALL',
          playlistId,
          layoutPreset,
        }),
      });
      await refresh();
      alert(`배포 완료 (버전 ${dep.version})`);
    } catch (e: any) {
      setError(e?.message ?? '배포에 실패했습니다');
    }
  }

  return (
    <main className="min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">배포</h1>
        <a className="rounded-md border px-3 py-1.5 text-sm" href="/dashboard">
          뒤로
        </a>
      </div>

      <div className="mt-4 rounded-xl border p-4">
        <div className="font-medium">배포 만들기</div>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          <input
            className="rounded-md border px-3 py-2 font-mono text-xs"
            placeholder="playlistId"
            value={playlistId}
            onChange={(e) => setPlaylistId(e.target.value)}
          />
          <select
            className="rounded-md border px-3 py-2 text-sm"
            value={layoutPreset}
            onChange={(e) => setLayoutPreset(e.target.value as any)}
          >
            {layouts.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <button className="rounded-md bg-black px-3 py-2 text-sm text-white" onClick={deploy}>
            배포
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-600">플레이리스트 화면에서 마지막으로 작업한 playlistId를 자동으로 채웁니다.</div>
        {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
      </div>

      <div className="mt-4 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">현재 배포</div>
          <button className="rounded-md border px-3 py-1.5 text-sm" onClick={() => refresh()}>
            새로고침
          </button>
        </div>
        <pre className="mt-2 overflow-auto rounded bg-gray-50 p-3 text-xs">{current ? JSON.stringify(current, null, 2) : '불러오는 중…'}</pre>
      </div>

      <div className="mt-4 rounded-xl border p-4">
        <div className="font-medium">팁</div>
        <div className="mt-1 text-sm text-gray-600">
          배포 후 플레이어는 WS `deploy:update`를 받고 manifest를 다시 불러와 자동으로 반영합니다.
        </div>
      </div>
    </main>
  );
}
