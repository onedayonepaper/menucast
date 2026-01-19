/* Simple runtime cache for manifest + assets. */

const CACHE = 'menucast-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      await self.skipWaiting();
      const cache = await caches.open(CACHE);
      await cache.addAll(['/']);
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only handle http(s)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Cache-first for uploads + API manifest
  const isUpload = url.pathname.startsWith('/uploads/');
  const isManifest = url.pathname.endsWith('/api/player/manifest');

  if (!isUpload && !isManifest) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(event.request);
      if (cached) return cached;

      try {
        const res = await fetch(event.request);
        if (res && res.ok) {
          await cache.put(event.request, res.clone());
        }
        return res;
      } catch (e) {
        if (cached) return cached;
        throw e;
      }
    })(),
  );
});
