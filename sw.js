/* CUBED service worker: makes the app installable and usable offline.
   Same-origin files are cached, plus the Three.js CDN and Google Fonts the
   app needs, so the cube keeps working offline once installed.
   Bump VERSION whenever you change app files so installed copies refresh. */
const VERSION='cubed-v1';
const CORE = [
  './', 'index.html', 'manifest.webmanifest',
  'icons/icon.svg'
];
const CDN_HOSTS = ['cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const allowed = url.origin === location.origin || url.hostname.endsWith('cdnjs.cloudflare.com') || url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com');
  if (!allowed) return;
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const hit = await cache.match(req, { ignoreSearch: true });
    const refresh = fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
      return res;
    });
    if (hit) { refresh.catch(() => {}); return hit; }
    try { return await refresh; }
    catch (err) {
      if (req.mode === 'navigate') { const home = await cache.match('index.html'); if (home) return home; }
      throw err;
    }
  })());
});
