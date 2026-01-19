'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { getSession } from '@/lib/auth';

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [code, setCode] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const s = getSession();
    if (!s) {
      window.location.href = '/login';
      return;
    }
    const list = await apiFetch<any[]>('/devices', {
      headers: { authorization: `Bearer ${s.accessToken}` },
    });
    setDevices(list);
  }

  useEffect(() => {
    refresh().catch((e) => setError(e?.message ?? '불러오기에 실패했습니다'));
  }, []);

  async function createCode() {
    const s = getSession();
    if (!s) return;
    setError(null);
    const created = await apiFetch<any>('/devices/registration-codes', {
      method: 'POST',
      headers: { authorization: `Bearer ${s.accessToken}` },
      body: JSON.stringify({}),
    });
    setCode(created);
  }

  return (
    <main className="min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">디바이스</h1>
        <a className="rounded-md border px-3 py-1.5 text-sm" href="/dashboard">
          뒤로
        </a>
      </div>

      <div className="mt-4 rounded-xl border p-4">
        <div className="flex items-center justify-between">
            <div>
            <div className="font-medium">등록 코드</div>
            <div className="text-sm text-gray-600">플레이어 `/register`에서 입력하세요.</div>
          </div>
          <button className="rounded-md bg-black px-3 py-2 text-sm text-white" onClick={createCode}>
            코드 발급
          </button>

        </div>

        {code ? (
          <div className="mt-3 rounded-md bg-gray-50 p-3">
            <div className="text-sm">코드: <span className="font-mono font-semibold">{code.code}</span></div>
            <div className="text-xs text-gray-600">만료: {code.expiresAt}</div>
          </div>
        ) : null}

        {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
      </div>

      <div className="mt-4 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">등록된 디바이스</div>
          <button className="rounded-md border px-3 py-1.5 text-sm" onClick={() => refresh()}>
            새로고침
          </button>
        </div>
        <div className="mt-3 overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2">이름</th>
                <th>ID</th>
                <th>마지막 연결</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="py-2 font-medium">{d.name}</td>
                  <td className="font-mono text-xs">{d.id}</td>
                  <td className="text-xs">{d.lastSeenAt ?? '-'}</td>
                </tr>
              ))}
              {devices.length === 0 ? (
                <tr>
                  <td className="py-6 text-gray-500" colSpan={3}>
                    아직 등록된 디바이스가 없습니다.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
