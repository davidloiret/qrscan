const CACHE_KEY = 'qrscan-v1';

const urlsToCache = [
  '/qrscan/',
  // 'https://unpkg.com/qrcode-decoder@0.3.1/dist/index.min.js',
  '/qrscan/index.html',
  '/qrscan/assets/style.css',
  '/qrscan/assets/index.js',
  '/qrscan/manifest.json',
  '/qrscan/favicon.ico',
  '/qrscan/favicon-16x16.png',
  '/qrscan/favicon-32x32.png',
  '/qrscan/android-chrome-192x192.png',
  '/qrscan/android-chrome-512x512.png',
  '/qrscan/apple-touch-icon.png',
  '/qrscan/assets/back-to-the-future-1920.jpeg',
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
