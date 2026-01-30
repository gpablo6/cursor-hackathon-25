/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'pupas-v2';
const BASE = '/pupas/';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([
      BASE + 'index.html',
      BASE + '404.html',
      BASE + 'icon-192x192.png',
      BASE + 'icon-192x192-maskable.png',
      BASE + 'icon-512x512.png',
      BASE + 'icon-512x512-maskable.png',
      BASE + 'source-1024x1024.png',
    ])
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(BASE)) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(BASE + 'index.html').then((cached) => cached || fetch(BASE + 'index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).then((res) => {
        const clone = res.clone();
        if (res.ok && event.request.method === 'GET') {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return res;
      })
    )
  );
});
