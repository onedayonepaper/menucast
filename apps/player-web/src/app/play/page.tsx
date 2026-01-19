'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { apiFetch } from '@/lib/api';
import { clearDeviceSession, getDeviceSession } from '@/lib/device';

type Manifest = {
  storeId: string;
  deviceId: string;
  version: number;
  layoutPreset: 'SPLIT2' | 'SPLIT3_CALL_1450x1080' | 'FULLSCREEN';
  callEnabled: boolean;
  callListSize: number;
  playlist: {
    items: {
      playlistItemId: string;
      sortOrder: number;
      durationSec: number | null;
      asset: {
        id: string;
        type: 'IMAGE' | 'VIDEO';
        url: string;
        filename: string;
      };
    }[];
  };
};

type CallEvent = { action: 'CALL' | 'RECALL' | 'RESET'; number: number; ts: string };

async function cacheManifestAndAssets(manifest: Manifest) {
  if (!('caches' in window)) return { cached: false, count: 0 };
  const cache = await caches.open('menucast-v1');

  const urls = [
    `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4100/api'}/player/manifest`,
    ...manifest.playlist.items.map((it) => it.asset.url),
  ];

  let count = 0;
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        await cache.put(url, res.clone());
        count++;
      }
    } catch {
      // ignore
    }
  }

  return { cached: true, count };
}

async function loadManifest(deviceToken: string): Promise<Manifest> {
  return apiFetch<Manifest>('/player/manifest', {
    headers: { 'x-device-token': deviceToken },
  });
}

export default function PlayPage() {
  const session = useMemo(() => getDeviceSession(), []);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [calls, setCalls] = useState<CallEvent[]>([]);
  const [status, setStatus] = useState<'online' | 'offline'>('online');
  const [debug, setDebug] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<{ cached: boolean; count: number } | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const idxRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!session) {
      window.location.href = '/register';
      return;
    }

    const onOnline = () => setStatus('online');
    const onOffline = () => setStatus('offline');
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === 'd') setDebug((v) => !v);
    }
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('keydown', onKey);
    };
  }, [session]);

  async function refreshAll() {
    if (!session) return;
    try {
      const m = await loadManifest(session.deviceToken);
      setManifest(m);
      const ci = await cacheManifestAndAssets(m);
      setCacheInfo(ci);

      // prefetch calls
      try {
        const recent = await apiFetch<any[]>('/calls/recent?limit=6', {
          headers: { 'x-device-token': session.deviceToken },
        });
        setCalls(recent);
      } catch {}
    } catch (e) {
      // offline: try cache manifest
      setStatus('offline');
    }
  }

  useEffect(() => {
    refreshAll();
  }, [session]);

  // WS
  useEffect(() => {
    if (!session) return;
    const url = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4100/ws';
    const socket = io(url, {
      transports: ['websocket'],
      auth: { storeId: session.storeId, deviceId: session.deviceId },
    });
    socketRef.current = socket;

    socket.on('deploy:update', () => {
      refreshAll();
    });

    socket.on('call:event', (ev: any) => {
      setCalls((prev) => [{ action: ev.action, number: ev.number, ts: ev.ts }, ...prev].slice(0, 6));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [session]);

  // Playback loop
  const items = manifest?.playlist.items ?? [];
  const current = items.length ? items[idxRef.current % items.length] : null;

  function scheduleNext(ms: number) {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      idxRef.current = (idxRef.current + 1) % Math.max(1, items.length);
      // force rerender
      setManifest((m) => (m ? { ...m } : m));
    }, ms);
  }

  useEffect(() => {
    if (!manifest) return;
    if (!current) return;
    if (current.asset.type === 'IMAGE') {
      scheduleNext((current.durationSec ?? 8) * 1000);
    }

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manifest, current?.playlistItemId]);

  const callList = calls.slice(0, manifest?.callListSize ?? 6);

  return (
    <main className="fixed inset-0 bg-black text-white">
      {!manifest ? (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold">불러오는 중…</div>
            <div className="mt-2 text-sm text-white/60">멈춘 것 같다면 디바이스 등록 상태를 확인하세요.</div>
            <button
              className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black"
              onClick={() => {
                clearDeviceSession();
                window.location.href = '/register';
              }}
            >
              다시 등록
            </button>
          </div>
        </div>
      ) : (
        <div className="h-full w-full">
          {/* Layout */}
          {manifest.layoutPreset === 'FULLSCREEN' ? (
            <div className="h-full w-full">
              <PlayerSurface item={current} onVideoEnded={() => { idxRef.current = (idxRef.current + 1) % Math.max(1, items.length); setManifest({ ...manifest }); }} />
            </div>
          ) : manifest.layoutPreset === 'SPLIT2' ? (
            <div className="grid h-full w-full grid-cols-[60%_40%]">
              <div className="relative">
                <PlayerSurface item={current} onVideoEnded={() => { idxRef.current = (idxRef.current + 1) % Math.max(1, items.length); setManifest({ ...manifest }); }} />
              </div>
              <div className="relative border-l border-white/10">
                <PlayerSurface item={current} onVideoEnded={() => { idxRef.current = (idxRef.current + 1) % Math.max(1, items.length); setManifest({ ...manifest }); }} />
                {manifest.callEnabled ? <CallOverlay calls={callList} /> : null}
              </div>
            </div>
          ) : (
            // SPLIT3_CALL_1450x1080
            <div className="h-full w-full flex items-center justify-center">
              <div className="relative" style={{ width: '1450px', height: '1080px', transform: 'scale(var(--s))', transformOrigin: 'top left' } as any}>
                <div className="absolute inset-0 grid grid-cols-[1fr_360px]">
                  <div className="relative">
                    <PlayerSurface item={current} onVideoEnded={() => { idxRef.current = (idxRef.current + 1) % Math.max(1, items.length); setManifest({ ...manifest }); }} />
                  </div>
                  <div className="relative border-l border-white/10 bg-black">
                    {manifest.callEnabled ? <CallPanel calls={callList} /> : null}
                  </div>
                </div>
              </div>
              <ScaleFit />
            </div>
          )}

          {/* status */}
          <div className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs">
            {status === 'online' ? '온라인' : '오프라인'}
          </div>

          {debug ? (
            <div className="absolute left-4 bottom-4 w-[420px] rounded-xl bg-black/70 p-3 text-xs border border-white/10">
              <div className="font-mono">deviceId: {manifest.deviceId}</div>
              <div className="font-mono">storeId: {manifest.storeId}</div>
              <div className="font-mono">version: {manifest.version}</div>
              <div className="font-mono">layout: {manifest.layoutPreset}</div>
              <div className="font-mono">cache: {cacheInfo ? `${cacheInfo.count}개 저장됨` : 'n/a'}</div>
            </div>
          ) : null}
        </div>
      )}
    </main>
  );
}

function PlayerSurface({
  item,
  onVideoEnded,
}: {
  item: Manifest['playlist']['items'][number] | null;
  onVideoEnded: () => void;
}) {
  if (!item) {
    return <div className="h-full w-full flex items-center justify-center text-white/60">배포된 콘텐츠가 없습니다.</div>;
  }

  if (item.asset.type === 'IMAGE') {
    return (
      <div className="h-full w-full">
        <img src={item.asset.url} className="h-full w-full object-cover" alt={item.asset.filename} />
      </div>
    );
  }

  return (
    <video
      className="h-full w-full object-cover"
      src={item.asset.url}
      autoPlay
      muted
      playsInline
      onEnded={onVideoEnded}
    />
  );
}

function callActionLabel(a: CallEvent['action']) {
  if (a === 'CALL') return '호출';
  if (a === 'RECALL') return '재호출';
  return '초기화';
}

function CallOverlay({ calls }: { calls: CallEvent[] }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/60 border-t border-white/10 p-4">
      <div className="text-sm font-semibold">호출</div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {calls.map((c, idx) => (
          <div key={idx} className={`rounded-lg p-3 ${idx === 0 ? 'bg-amber-400 text-black' : 'bg-white/10 text-white'}`}>
            <div className="text-xs opacity-80">{callActionLabel(c.action)}</div>
            <div className="text-3xl font-black">{c.number}</div>
          </div>
        ))}
        {calls.length === 0 ? <div className="text-white/60 text-sm">호출 내역 없음</div> : null}
      </div>
    </div>
  );
}

function CallPanel({ calls }: { calls: CallEvent[] }) {
  return (
    <div className="h-full w-full p-6">
      <div className="text-xl font-semibold">호출 안내</div>
      <div className="mt-4 grid gap-3">
        {calls.map((c, idx) => (
          <div key={idx} className={`rounded-xl p-4 ${idx === 0 ? 'bg-emerald-400 text-black' : 'bg-white/10 text-white'}`}>
            <div className="text-xs opacity-80">{callActionLabel(c.action)}</div>
            <div className="text-5xl font-black tracking-tight">{c.number}</div>
          </div>
        ))}
        {calls.length === 0 ? <div className="text-white/60">호출 내역 없음</div> : null}
      </div>
    </div>
  );
}

function ScaleFit() {
  // sets CSS var --s on body using viewport fit
  useEffect(() => {
    function update() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = Math.min(vw / 1450, vh / 1080);
      document.documentElement.style.setProperty('--s', String(s));
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return null;
}
