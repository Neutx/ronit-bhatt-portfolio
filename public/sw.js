// Service Worker for Media Caching
// Version 1.0.0
const CACHE_NAME = 'ronit-portfolio-v1';
const MEDIA_CACHE_NAME = 'ronit-portfolio-media-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== MEDIA_CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control of all pages immediately
});

// Fetch event - cache-first strategy for media, network-first for HTML/JS
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle media files (videos and images) with cache-first strategy
  if (url.pathname.match(/\.(webm|webp|jpg|jpeg|png|gif|mp4)$/i)) {
    event.respondWith(
      caches.open(MEDIA_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached version immediately
            return cachedResponse;
          }
          // If not cached, fetch from network and cache it
          return fetch(request)
            .then((response) => {
              // Only cache successful responses
              if (response.status === 200) {
                // Clone the response because it can only be consumed once
                const responseToCache = response.clone();
                cache.put(request, responseToCache);
              }
              return response;
            })
            .catch(() => {
              // If fetch fails, return a placeholder or error
              return new Response('Media not available', {
                status: 404,
                headers: { 'Content-Type': 'text/plain' },
              });
            });
        });
      })
    );
    return;
  }

  // Handle HTML, JS, CSS with network-first strategy
  if (url.pathname.match(/\.(html|js|css|json)$/i) || url.pathname === '/') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || new Response('Offline', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' },
            });
          });
        })
    );
    return;
  }

  // For all other requests, try network first, then cache
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
  );
});

// Message handler for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

