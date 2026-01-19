'use client';

import { useEffect, useRef, useState } from 'react';
import { apiFetch, API_BASE_URL } from '@/lib/api';
import { getSession } from '@/lib/auth';

export default function AssetsPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function refresh() {
    const s = getSession();
    if (!s) {
      window.location.href = '/login';
      return;
    }
    const list = await apiFetch<any[]>('/assets', {
      headers: { authorization: `Bearer ${s.accessToken}` },
    });
    setAssets(list);
  }

  useEffect(() => {
    refresh().catch((e) => setError(e?.message ?? '불러오기에 실패했습니다'));
  }, []);

  async function uploadFiles(files: FileList) {
    const s = getSession();
    if (!s) return;
    setUploading(true);
    setError(null);

    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch(`${API_BASE_URL}/assets/upload`, {
          method: 'POST',
          headers: { authorization: `Bearer ${s.accessToken}` },
          body: form,
        });
        const json = await res.json();
        if (!json.ok) throw new Error(json.error.message);
      }
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? '업로드에 실패했습니다');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function remove(id: string) {
    const s = getSession();
    if (!s) return;
    setError(null);
    try {
      await apiFetch(`/assets/${id}`, {
        method: 'DELETE',
        headers: { authorization: `Bearer ${s.accessToken}` },
      });
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? '삭제에 실패했습니다');
    }
  }

  return (
    <main className="min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">자산</h1>
        <a className="rounded-md border px-3 py-1.5 text-sm" href="/dashboard">
          뒤로
        </a>
      </div>

      <div
        className="mt-4 rounded-xl border border-dashed p-6 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
        }}
      >
        <div className="font-medium">여기로 파일을 드래그&드롭</div>
        <div className="text-sm text-gray-600">또는 파일 선택 (이미지/영상)</div>
        <div className="mt-3">
          <input
            ref={inputRef}
            type="file"
            multiple
            className="text-sm"
            onChange={(e) => {
              if (e.target.files) uploadFiles(e.target.files);
            }}
            disabled={uploading}
          />
        </div>
        {uploading ? <div className="mt-2 text-sm">업로드 중…</div> : null}
        {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
      </div>

      <div className="mt-4 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">파일 목록</div>
          <button className="rounded-md border px-3 py-1.5 text-sm" onClick={() => refresh()}>
            새로고침
          </button>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {assets.map((a) => (
            <div key={a.id} className="rounded-lg border p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{a.filename}</div>
                  <div className="text-xs text-gray-600">{a.type} • {Math.round(a.size / 1024)} KB</div>
                  <a className="mt-1 block text-xs text-blue-600 underline" href={a.url} target="_blank">
                    {a.url}
                  </a>
                </div>
                <button className="rounded-md border px-2 py-1 text-xs" onClick={() => remove(a.id)}>
                  삭제
                </button>
              </div>
            </div>
          ))}
          {assets.length === 0 ? <div className="text-sm text-gray-500">아직 업로드된 자산이 없습니다.</div> : null}
        </div>
      </div>
    </main>
  );
}
