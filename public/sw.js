// Service Worker for Hydra Fox Designs
// Bump CACHE_NAME on every deploy to flush stale assets.
// Astro hashes all /_astro/* filenames, so those are safe to cache long-term.
// HTML pages use network-first so a fresh deploy is always seen immediately.

const CACHE_NAME = 'hfd-cache-v2';

// Install — skip waiting so the new SW activates immediately
self.addEventListener('install', () => {
    self.skipWaiting();
});

// Activate — delete old caches from previous versions
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET') return;
    if (url.pathname.startsWith('/api/')) return;
    if (url.origin !== location.origin) return;

    // Hashed Astro assets: cache-first (content-hash guarantees freshness)
    if (url.pathname.startsWith('/_astro/') || url.pathname.startsWith('/fonts/') || url.pathname.startsWith('/images/')) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    if (response.ok) {
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
                    }
                    return response;
                }).catch(() => { console.error('SW: fetch failed for', url.pathname); });
            })
        );
        return;
    }

    // HTML pages: network-first so new deploys are visible immediately
    event.respondWith(
        fetch(request).then((response) => {
            if (response.ok) {
                caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
            }
            return response;
        }).catch(() =>
            caches.match(request).then((cached) => {
                if (cached) return cached;
                if (request.destination === 'document') {
                    return new Response(
                        `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline | Hydra Fox Designs</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .container { max-width: 400px; padding: 20px; }
    h1 { color: #4ade80; }
    p { color: #9ca3af; }
    a { color: #4ade80; }
  </style>
</head>
<body>
  <div class="container">
    <h1>You're Offline</h1>
    <p>Please check your internet connection and try again.</p>
    <p><a href="/">← Try Again</a></p>
  </div>
</body>
</html>`,
                        { headers: { 'Content-Type': 'text/html' } }
                    );
                }
            })
        )
    );
});
