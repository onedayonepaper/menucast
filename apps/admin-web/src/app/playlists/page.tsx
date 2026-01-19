'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { getSession } from '@/lib/auth';

type Asset = {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  filename: string;
  url: string;
  size: number;
};

function AssetPreview({ asset }: { asset: Asset | null }) {
  if (!asset) return <div className="text-sm text-gray-600">미리보기할 자산이 없습니다.</div>;

  return (
    <div className="grid gap-3 md:grid-cols-[160px_1fr]">
      <div className="overflow-hidden rounded-md bg-gray-100">
        {asset.type === 'IMAGE' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset.url} alt={asset.filename} className="h-[120px] w-full object-cover" />
        ) : (
          <video
            className="h-[120px] w-full object-cover"
            src={asset.url}
            controls
            muted
            playsInline
            preload="metadata"
          />
        )}
      </div>

      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{asset.filename}</div>
        <div className="mt-1 text-xs text-gray-600">{asset.type} • {Math.round(asset.size / 1024)} KB</div>
        <a className="mt-2 block truncate text-xs text-blue-600 underline" href={asset.url} target="_blank">
          {asset.url}
        </a>
        {asset.type === 'VIDEO' ? (
          <div className="mt-2 text-xs text-gray-600">영상은 재생 종료 후 다음 아이템으로 넘어갑니다.</div>
        ) : null}
      </div>
    </div>
  );
}


function saveLastPlaylistId(id: string) {
  try {
    localStorage.setItem('menucast.admin.lastPlaylistId', id);
  } catch {}
}

function loadLastPlaylistId(): string {
  try {
    return localStorage.getItem('menucast.admin.lastPlaylistId') ?? '';
  } catch {
    return '';
  }
}

export default function PlaylistsPage() {
  const [playlistId, setPlaylistId] = useState('');
  const [playlist, setPlaylist] = useState<any>(null);
  const [assets, setAssets] = useState<Asset[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('새 플레이리스트');

  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [imageDuration, setImageDuration] = useState('8');
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderDirty, setOrderDirty] = useState(false);

  const [assetTypeFilter, setAssetTypeFilter] = useState<'ALL' | 'IMAGE' | 'VIDEO'>('ALL');
  const [assetQuery, setAssetQuery] = useState('');

  const session = useMemo(() => getSession(), []);

  const filteredAssets = useMemo(() => {
    const q = assetQuery.trim().toLowerCase();
    return assets.filter((a) => {
      if (assetTypeFilter !== 'ALL' && a.type !== assetTypeFilter) return false;
      if (!q) return true;
      return a.filename.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
    });
  }, [assets, assetQuery, assetTypeFilter]);

  const selectedAsset = useMemo(
    () => assets.find((a) => a.id === selectedAssetId) ?? null,
    [assets, selectedAssetId],
  );

  useEffect(() => {
    const last = loadLastPlaylistId();
    if (last) setPlaylistId(last);
  }, []);

  async function refreshAssets() {
    if (!session) return;
    const list = await apiFetch<Asset[]>('/assets', {
      headers: { authorization: `Bearer ${session.accessToken}` },
    });
    setAssets(list);
  }

  async function refreshPlaylist(id: string) {
    if (!session) return;
    const data = await apiFetch<any>(`/playlists/${id}`, {
      headers: { authorization: `Bearer ${session.accessToken}` },
    });
    setPlaylist(data);
    setOrderDirty(false);
  }

  async function create() {
    if (!session) {
      window.location.href = '/login';
      return;
    }
    setError(null);
    const created = await apiFetch<any>('/playlists', {
      method: 'POST',
      headers: { authorization: `Bearer ${session.accessToken}` },
      body: JSON.stringify({ name }),
    });

    setPlaylistId(created.id);
    saveLastPlaylistId(created.id);
    await refreshAssets();
    await refreshPlaylist(created.id);
  }

  async function load() {
    if (!session) {
      window.location.href = '/login';
      return;
    }

    setError(null);
    try {
      saveLastPlaylistId(playlistId);
      await refreshAssets();
      await refreshPlaylist(playlistId);
    } catch (e: any) {
      setError(e?.message ?? '불러오기에 실패했습니다');
    }
  }

  async function addItem(assetIdOverride?: string) {
    if (!session) return;
    if (!playlist?.id) return;

    const assetId = assetIdOverride ?? selectedAssetId;
    if (!assetId) {
      setError('자산을 선택하세요');
      return;
    }

    const asset = assets.find((a) => a.id === assetId);
    if (!asset) {
      setError('자산을 찾을 수 없습니다');
      return;
    }

    const items = (playlist.items ?? []) as any[];
    const nextSort = items.length ? Math.max(...items.map((it) => it.sortOrder)) + 1 : 1;

    setError(null);
    try {
      await apiFetch<any>(`/playlists/${playlist.id}/items`, {
        method: 'POST',
        headers: { authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({
          assetId: asset.id,
          sortOrder: nextSort,
          durationSec: asset.type === 'IMAGE' ? Number(imageDuration || 8) : undefined,
        }),
      });

      // keep selection in sync when added via grid
      setSelectedAssetId(asset.id);

      await refreshPlaylist(playlist.id);
    } catch (e: any) {
      setError(e?.message ?? '아이템 추가에 실패했습니다');
    }

    // After add, backend order is normalized; UI is clean state.
    setOrderDirty(false);
  }

  function moveItem(from: number, to: number) {
    const items = [...(playlist?.items ?? [])];
    const [picked] = items.splice(from, 1);
    items.splice(to, 0, picked);

    // re-number
    const renumbered = items.map((it, idx) => ({ ...it, sortOrder: idx + 1 }));
    setPlaylist({ ...playlist, items: renumbered });
    setOrderDirty(true);
  }

  async function saveOrder() {
    if (!session) return;
    if (!playlist?.id) return;

    setSavingOrder(true);
    setError(null);
    try {
      const items = (playlist.items ?? []).map((it: any, idx: number) => ({
        playlistItemId: it.id,
        sortOrder: idx + 1,
      }));

      await apiFetch<any>(`/playlists/${playlist.id}/items/reorder`, {
        method: 'PUT',
        headers: { authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ items }),
      });

      await refreshPlaylist(playlist.id);
      alert('순서를 저장했습니다');
      setOrderDirty(false);
    } catch (e: any) {
      setError(e?.message ?? '순서 저장에 실패했습니다');
    } finally {
      setSavingOrder(false);
    }
  }

  async function removePlaylistItem(playlistItemId: string) {
    if (!session) return;
    if (!playlist?.id) return;

    const okConfirm = confirm('이 아이템을 플레이리스트에서 삭제할까요?');
    if (!okConfirm) return;

    setError(null);
    try {
      await apiFetch<any>(`/playlists/${playlist.id}/items`, {
        method: 'DELETE',
        headers: { authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ playlistItemId }),
      });
      await refreshPlaylist(playlist.id);
    } catch (e: any) {
      setError(e?.message ?? '삭제에 실패했습니다');
    }

    // Deleted item triggers server-side reordering; clean state.
    setOrderDirty(false);
  }

  return (
    <main className="min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">플레이리스트</h1>
        <a className="rounded-md border px-3 py-1.5 text-sm" href="/dashboard">
          뒤로
        </a>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4">
          <div className="font-medium">플레이리스트 만들기</div>
          <div className="mt-2 flex gap-2">
            <input
              className="flex-1 rounded-md border px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="플레이리스트 이름"
            />
            <button className="rounded-md bg-black px-3 py-2 text-sm text-white" onClick={create}>
              생성
            </button>
          </div>
        </div>

        <div className="rounded-xl border p-4">
          <div className="font-medium">플레이리스트 불러오기</div>
          <div className="mt-2 flex gap-2">
            <input
              className="flex-1 rounded-md border px-3 py-2 font-mono text-xs"
              placeholder="playlistId"
              value={playlistId}
              onChange={(e) => setPlaylistId(e.target.value)}
            />
            <button className="rounded-md border px-3 py-2 text-sm" onClick={load}>
              불러오기
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            현재 입력한 playlistId는 배포 화면에서 자동으로 기본값으로 사용됩니다.
          </div>
        </div>
      </div>

      {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}

      <div className="mt-4 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">아이템 추가</div>
            <div className="text-sm text-gray-600">자산을 선택해 플레이리스트에 추가합니다.</div>
          </div>
          {playlist?.id ? (
            <a className="rounded-md border px-3 py-1.5 text-sm" href={`/deployments?playlistId=${playlist.id}`}>
              이 플레이리스트로 배포
            </a>
          ) : null}
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-[1fr_140px_120px]">
          <div className="grid gap-2">
            <div className="flex flex-wrap gap-2">
              <button
                className={`rounded-md border px-3 py-2 text-sm ${assetTypeFilter === 'ALL' ? 'bg-black text-white' : 'bg-white'}`}
                onClick={() => setAssetTypeFilter('ALL')}
                type="button"
              >
                전체
              </button>
              <button
                className={`rounded-md border px-3 py-2 text-sm ${assetTypeFilter === 'IMAGE' ? 'bg-black text-white' : 'bg-white'}`}
                onClick={() => setAssetTypeFilter('IMAGE')}
                type="button"
              >
                이미지
              </button>
              <button
                className={`rounded-md border px-3 py-2 text-sm ${assetTypeFilter === 'VIDEO' ? 'bg-black text-white' : 'bg-white'}`}
                onClick={() => setAssetTypeFilter('VIDEO')}
                type="button"
              >
                영상
              </button>
            </div>
            <input
              className="rounded-md border px-3 py-2 text-sm"
              placeholder="자산 검색 (파일명 / ID)"
              value={assetQuery}
              onChange={(e) => setAssetQuery(e.target.value)}
            />
          </div>

          <input
            className="rounded-md border px-3 py-2 text-sm"
            value={imageDuration}
            onChange={(e) => setImageDuration(e.target.value)}
            placeholder="이미지(초)"
          />

          <button className="rounded-md bg-black px-3 py-2 text-sm text-white" onClick={() => addItem()}>
            추가
          </button>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border bg-white p-3">
            <div className="text-sm font-medium">선택한 자산</div>
            <div className="mt-2">
              <AssetPreview asset={selectedAsset} />
            </div>
          </div>

          <div className="rounded-lg border bg-white p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">자산 목록</div>
              <div className="text-xs text-gray-600">클릭하면 선택, + 버튼으로 추가</div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {filteredAssets.slice(0, 24).map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setSelectedAssetId(a.id)}
                  className={`group overflow-hidden rounded-md border text-left ${a.id === selectedAssetId ? 'border-black ring-2 ring-black/10' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  <div className="relative h-20 w-full bg-gray-100">
                    {a.type === 'IMAGE' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.url} alt={a.filename} className="h-20 w-full object-cover" />
                    ) : (
                      <div className="flex h-20 w-full items-center justify-center bg-black text-[10px] text-white/70">VIDEO</div>
                    )}
                    <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <div
                        className="rounded bg-white/90 px-2 py-1 text-[10px]"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addItem(a.id);
                        }}
                      >
                        +
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="truncate text-xs font-medium">{a.filename}</div>
                    <div className="mt-1 text-[10px] text-gray-600">{a.type}</div>
                  </div>
                </button>
              ))}

              {filteredAssets.length === 0 ? (
                <div className="col-span-2 text-sm text-gray-600 sm:col-span-3">검색 결과가 없습니다.</div>
              ) : null}
            </div>

            {filteredAssets.length > 24 ? (
              <div className="mt-2 text-xs text-gray-600">표시 제한: 24개 (검색어를 더 구체적으로 입력하세요)</div>
            ) : null}
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-600">
          영상은 재생이 끝나면 다음으로 넘어갑니다. 이미지는 durationSec 동안 표시됩니다.
        </div>
      </div>

      <div className="mt-4 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">현재 아이템</div>
          <button
            className="rounded-md bg-black px-3 py-1.5 text-sm text-white disabled:opacity-60"
            onClick={saveOrder}
            disabled={!playlist?.id || savingOrder || !orderDirty}
            title={!orderDirty ? '변경된 순서가 없습니다' : undefined}
          >
            {savingOrder ? '저장 중…' : orderDirty ? '순서 저장' : '저장됨'}
          </button>
        </div>

        {!playlist?.items?.length ? (
          <div className="mt-3 text-sm text-gray-600">아이템이 없습니다.</div>
        ) : (
          <div className="mt-3 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr>
                  <th className="py-2">순서</th>
                  <th>자산</th>
                  <th>유형</th>
                  <th>옵션</th>
                  <th className="text-right">작업</th>
                </tr>
              </thead>
              <tbody>
                {(playlist.items as any[]).map((it, idx) => (
                  <tr key={it.id} className="border-t">
                    <td className="py-2 font-mono text-xs">{idx + 1}</td>
                    <td className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="group relative h-10 w-16 overflow-hidden rounded bg-gray-100">
                          {it.asset?.type === 'IMAGE' ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={it.asset.url} alt={it.asset.filename} className="h-10 w-16 object-cover" />
                          ) : (
                            <>
                              <div className="absolute inset-0 flex items-center justify-center bg-black text-[10px] text-white/70">VIDEO</div>
                              <div className="absolute inset-0 hidden bg-black group-hover:block">
                                <video
                                  className="h-10 w-16 object-cover"
                                  src={it.asset?.url}
                                  muted
                                  playsInline
                                  preload="metadata"
                                  controls
                                />
                              </div>
                            </>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate">{it.asset?.filename ?? it.assetId}</div>
                          <a className="block truncate text-xs text-blue-600 underline" href={it.asset?.url} target="_blank">
                            {it.asset?.url}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs">{it.asset?.type ?? '-'}</td>
                    <td className="text-xs">{it.asset?.type === 'IMAGE' ? `이미지 ${it.durationSec ?? 8}s` : '-'}</td>
                    <td className="text-right">
                      <button
                        className="rounded-md border px-2 py-1 text-xs disabled:opacity-50"
                        disabled={idx === 0}
                        onClick={() => moveItem(idx, idx - 1)}
                      >
                        위
                      </button>
                      <button
                        className="ml-2 rounded-md border px-2 py-1 text-xs disabled:opacity-50"
                        disabled={idx === (playlist.items as any[]).length - 1}
                        onClick={() => moveItem(idx, idx + 1)}
                      >
                        아래
                      </button>
                      <button
                        className="ml-2 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100"
                        onClick={() => removePlaylistItem(it.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl border p-4">
        <div className="font-medium">보완 예정</div>
        <div className="mt-1 text-sm text-gray-600">
          드래그 정렬, 자산 미리보기, 배포 화면에서 플레이리스트 목록 선택 UI를 추가할 수 있습니다.
        </div>
      </div>
    </main>
  );
}
