// Hub Cart service worker — conservative caching:
// cache-first ONLY for product images (/api/img/) and Next static assets.
// Pages and API data always go to the network, so content never goes stale.
const CACHE = 'hubcart-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const cacheable = url.pathname.startsWith('/api/img/') || url.pathname.startsWith('/_next/static/');
  if (!cacheable) return; // let the browser handle everything else normally

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(request);
      if (hit) return hit;
      const res = await fetch(request);
      if (res.ok) cache.put(request, res.clone());
      return res;
    })
  );
});
