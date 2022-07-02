const CACHE_KEY = 'pwa-v1';

const urlsToCache = [
  '/pwa/',
  '/pwa/index.html',
  '/pwa/assets/style.css',
  '/pwa/assets/index.js',
  '/pwa/manifest.json',
  '/pwa/favicon.ico',
  '/pwa/favicon-16x16.png',
  '/pwa/favicon-32x32.png',
  '/pwa/android-chrome-192x192.png',
  '/pwa/android-chrome-512x512.png',
  '/pwa/apple-touch-icon.png',
  '/pwa/assets/back-to-the-future-1920.jpeg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_KEY).then(cache => cache.addAll(urlsToCache))
  )
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => 
        Promise.all(
          keys
            .filter(key => key !== CACHE_KEY)
            .map(key => caches.delete(key))
        )
      )
  )
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log('Cache hit', event.request);
        return response;
      }
      return fetch(event.request)
        .then(response => caches.open(CACHE_KEY))
        .then(cache => {
          cache.put(event.request, response.clone());
          return response;
        })
        .catch(() => console.error('Fetch failed'))
    })
  )
});
