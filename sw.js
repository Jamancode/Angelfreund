const CACHE_NAME = 'universal-pwa-installer-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'css/style.css',
  'js/script.js',
  'manifest.json',
  'images/logo.png',
  'images/icon-72x72.png',
  'images/icon-96x96.png',
  'images/icon-128x128.png',
  'images/icon-144x144.png',
  'images/icon-152x152.png',
  'images/icon-192x192.png',
  'images/icon-384x384.png',
  'images/icon-512x512.png',
  'images/browser-placeholder.png',
  'images/chrome-logo.png',
  'images/firefox-logo.png',
  'images/edge-logo.png',
  'images/safari-logo.png',
  'images/opera-logo.png',
  'images/samsung-internet-logo.png',
  'images/ios-share-icon.png',
  'images/ios-add-to-home-icon.png'
  // Weitere wichtige Assets hier hinzufügen
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
          console.error('Failed to cache resources during install:', err);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
