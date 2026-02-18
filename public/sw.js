// Service Worker for Hydra Fox Designs
// Provides offline caching and faster repeat visits

const CACHE_NAME = 'hfd-cache-v1';
const STATIC_ASSETS = [
    '/',
    '/services/',
    '/work/',
    '/industries/',
    '/resources/',
    '/about/',
    '/contact/',
    '/images/hfd-logo-withoutBg.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('📦 Caching static assets...');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip API requests (chat.php should always go to network)
    if (url.pathname.includes('/api/')) return;

    // Skip external requests
    if (url.origin !== location.origin) return;

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            // Return cached version if available
            if (cachedResponse) {
                // Fetch fresh version in background for next time
                event.waitUntil(
                    fetch(request).then((response) => {
                        if (response.ok) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, response);
                            });
                        }
                    }).catch(() => { })
                );
                return cachedResponse;
            }

            // Otherwise fetch from network and cache
            return fetch(request).then((response) => {
                // Don't cache non-successful responses
                if (!response.ok) return response;

                // Clone the response for caching
                const responseToCache = response.clone();

                // Cache HTML pages and static assets
                if (
                    request.destination === 'document' ||
                    request.destination === 'image' ||
                    request.destination === 'style' ||
                    request.destination === 'script' ||
                    request.destination === 'font'
                ) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                }

                return response;
            }).catch(() => {
                // If offline and page not cached, show offline message
                if (request.destination === 'document') {
                    return new Response(
                        `<!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Offline | Hydra Fox Designs</title>
              <style>
                body {
                  font-family: system-ui, sans-serif;
                  background: #000;
                  color: #fff;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
                  text-align: center;
                }
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
                        {
                            headers: { 'Content-Type': 'text/html' },
                        }
                    );
                }
            });
        })
    );
});
