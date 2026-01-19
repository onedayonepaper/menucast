'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { getSession } from '@/lib/auth';

const layouts = ['SPLIT2', 'SPLIT3_CALL_1450x1080', 'FULLSCREEN'] as const;

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const s = getSession();
    if (!s) {
      window.location.href = '/login';
      return;
    }
    const store = await apiFetch<any>('/stores/me', {
      headers: { authorization: `Bearer ${s.accessToken}` },
    });
    setSettings(store);
  }

  useEffect(() => {
    load().catch((e) => setError(e?.message ?? '불러오기에 실패했습니다'));
  }, []);

  async function save() {
    const s = getSession();
    if (!s) return;

    setError(null);
    try {
      const updated = await apiFetch<any>('/stores/me/settings', {
        method: 'PATCH',
        headers: { authorization: `Bearer ${s.accessToken}` },
        body: JSON.stringify({
          callEnabled: settings.callEnabled,
          callListSize: Number(settings.callListSize),
          callStartNo: Number(settings.callStartNo),
          layoutPreset: settings.layoutPreset,
        }),
      });
      setSettings({ ...settings, ...updated });
      alert('저장했습니다');
    } catch (e: any) {
      setError(e?.message ?? '저장에 실패했습니다');
    }
  }

  return (
    <main className="min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">설정</h1>
        <a className="rounded-md border px-3 py-1.5 text-sm" href="/dashboard">
          뒤로
        </a>
      </div>

      <div className="mt-4 rounded-xl border p-4">
        {settings ? (
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!settings.callEnabled}
                onChange={(e) => setSettings({ ...settings, callEnabled: e.target.checked })}
              />
              호출 기능 사용
            </label>

            <div>
              <div className="text-sm font-medium">호출 목록 개수</div>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                value={settings.callListSize}
                onChange={(e) => setSettings({ ...settings, callListSize: e.target.value })}
              />
            </div>

            <div>
              <div className="text-sm font-medium">호출 시작 번호</div>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                value={settings.callStartNo}
                onChange={(e) => setSettings({ ...settings, callStartNo: e.target.value })}
              />
            </div>

            <div>
              <div className="text-sm font-medium">레이아웃 프리셋</div>
              <select
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                value={settings.layoutPreset}
                onChange={(e) => setSettings({ ...settings, layoutPreset: e.target.value })}
              >
                {layouts.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <button className="rounded-md bg-black px-4 py-2 text-sm text-white" onClick={save}>
                저장
              </button>
              {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600">불러오는 중…</div>
        )}
      </div>
    </main>
  );
}
