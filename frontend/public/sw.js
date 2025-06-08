// Universal PWA Service Worker with Cross-Browser Optimization
const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `pwa-installer-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `pwa-installer-dynamic-${CACHE_VERSION}`;
const RUNTIME_CACHE = `pwa-installer-runtime-${CACHE_VERSION}`;

// Critical resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  'https://raw.githubusercontent.com/Jamancode/jamancode.github.io/main/images/icon-192x192.png',
  'https://raw.githubusercontent.com/Jamancode/jamancode.github.io/main/images/icon-512x512.png'
];

// Browser Detection Utilities
function getBrowserInfo() {
  const ua = navigator.userAgent;
  return {
    isChrome: /Chrome/.test(ua) && !/Edge|Edg/.test(ua),
    isEdge: /Edge|Edg/.test(ua),
    isSafari: /Safari/.test(ua) && !/Chrome|Chromium/.test(ua),
    isFirefox: /Firefox/.test(ua),
    isSamsung: /SamsungBrowser/.test(ua),
    isIOS: /iPad|iPhone|iPod/.test(ua),
    isAndroid: /Android/.test(ua),
    isMobile: /Mobi|Android/i.test(ua)
  };
}

// Safari-optimized cache management (50MB limit)
async function manageSafariCache() {
  const browser = getBrowserInfo();
  if (!browser.isSafari) return;
  
  try {
    const estimate = await navigator.storage.estimate();
    const SAFARI_LIMIT = 50 * 1024 * 1024; // 50MB
    
    if (estimate.usage > SAFARI_LIMIT * 0.8) {
      await performAggressiveCleanup();
    }
  } catch (error) {
    console.log('Cache estimation not available');
  }
}

async function performAggressiveCleanup() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    name.includes('dynamic') || name.includes('runtime')
  );
  
  await Promise.all(oldCaches.map(name => caches.delete(name)));
}

// Install Event - Precache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE)
        .then(cache => cache.addAll(STATIC_ASSETS))
        .catch(error => console.log('Cache addAll failed:', error)),
      self.skipWaiting()
    ])
  );
});

// Activate Event - Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith('pwa-installer-') && 
                           !name.includes(CACHE_VERSION))
            .map(name => caches.delete(name))
        );
      }),
      manageSafariCache()
    ])
  );
});

// Fetch Event with intelligent routing
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Handle different types of requests
  if (url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(staleWhileRevalidateStrategy(event.request));
  } else if (url.hostname === 'raw.githubusercontent.com') {
    event.respondWith(cacheFirstStrategy(event.request));
  } else if (url.pathname.startsWith('/static/')) {
    event.respondWith(cacheFirstStrategy(event.request));
  } else {
    event.respondWith(networkFirstStrategy(event.request));
  }
});

// Cache Strategies
async function cacheFirstStrategy(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirstStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);
  
  return cached || fetchPromise;
}

// Background Sync for Chrome/Edge
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-install') {
    event.waitUntil(handleBackgroundInstall());
  }
});

async function handleBackgroundInstall() {
  // Handle offline installation requests
  console.log('Background sync: handling installation');
}

// Message handling for cross-browser communication
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLAIM_CLIENTS') {
    self.clients.claim();
  }
  
  if (event.data && event.data.type === 'CACHE_MANAGEMENT') {
    manageSafariCache();
  }
});

// PWA Installation Event Tracking
self.addEventListener('appinstalled', (event) => {
  console.log('PWA installed successfully');
  // Track installation success
});

// Error handling for failed installations
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

// Unhandled promise rejection
self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
