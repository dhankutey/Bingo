const CACHE_NAME = 'bingo-cache-v2'; // Bumped version to force an update
const ASSETS_TO_CACHE = [
  '/bingo/',
  '/bingo/index.html',
  '/bingo/index.css',
  '/bingo/index.js',
  '/bingo/manifest.json',
  '/bingo/icon.png'
];

// Install the service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting()) // Forces the waiting service worker to become active
  );
});

// Activate worker and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Forces the service worker to take control immediately
  );
});

// Fetch assets from cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cache match, otherwise fetch from network
      return response || fetch(event.request);
    })
  );
});
