// Retired service worker. Kept at this URL so previously installed workers
// update to it, clear their caches, unregister, and reload controlled pages.
// It intercepts no requests: everything goes to the network / HTTP cache.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) =>
  e.waitUntil(
    (async () => {
      for (const k of await caches.keys()) await caches.delete(k);
      await self.registration.unregister();
      const cs = await self.clients.matchAll({ type: 'window' });
      for (const c of cs) c.navigate(c.url);
    })()
  )
);
