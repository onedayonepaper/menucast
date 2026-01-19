'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { getSession, clearSession } from '@/lib/auth';

export default function Dashboard() {
  const [store, setStore] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      window.location.href = '/login';
      return;
    }

    apiFetch<any>('/stores/me', {
      headers: { authorization: `Bearer ${s.accessToken}` },
    })
      .then(setStore)
      .catch((e) => setErr(e?.message ?? '불러오기에 실패했습니다'));
  }, []);

  return (
    <main className="min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">대시보드</h1>
        <button
          className="rounded-md border px-3 py-1.5 text-sm"
          onClick={() => {
            clearSession();
            window.location.href = '/login';
          }}
        >
          로그아웃
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <a className="rounded-xl border p-4 hover:bg-gray-50" href="/devices">
          <div className="font-medium">디바이스</div>
          <div className="text-sm text-gray-600">등록 코드 발급 / 디바이스 목록</div>
        </a>
        <a className="rounded-xl border p-4 hover:bg-gray-50" href="/assets">
          <div className="font-medium">자산</div>
          <div className="text-sm text-gray-600">이미지/영상 업로드 및 관리</div>
        </a>
        <a className="rounded-xl border p-4 hover:bg-gray-50" href="/deployments">
          <div className="font-medium">배포</div>
          <div className="text-sm text-gray-600">플레이리스트를 매장에 배포</div>
        </a>
      </div>

      <div className="mt-6 rounded-xl border p-4">
        <div className="font-medium">매장</div>
        {err ? <div className="text-sm text-red-600">{err}</div> : null}
        <pre className="mt-2 overflow-auto rounded bg-gray-50 p-3 text-xs">
          {store ? JSON.stringify(store, null, 2) : '불러오는 중…'}
        </pre>
      </div>

      <div className="mt-6 rounded-xl border p-4">
        <div className="font-medium">바로가기</div>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          <a className="rounded-md border px-3 py-1.5" href="/playlists">플레이리스트</a>
          <a className="rounded-md border px-3 py-1.5" href="/settings">설정</a>
        </div>
      </div>
    </main>
  );
}
