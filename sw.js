self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open('fretBoardCache').then((cache) => cache.addAll([
            '/',
            '/index.html',
            '/styles/style.css',
            '/scripts/main.js',
        ]))
    )
});

self.addEventListener('fetch', (e) => {
    console.log(e.request.url);
    e.respondWith(
      caches.match(e.request).then((response) => response || fetch(e.request)),
    );
  });