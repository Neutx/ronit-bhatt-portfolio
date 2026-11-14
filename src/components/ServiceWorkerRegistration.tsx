'use client';

import { useEffect } from 'react';

// The media-caching service worker has been retired (it did not honor Range
// requests, which broke video playback on iOS). HTTP caching is handled by
// Cache-Control headers in vercel.json. This component only removes any
// worker left over from earlier visits, after load and when the main thread
// is idle so it never competes with initial rendering.
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const unregisterAll = () => {
      navigator.serviceWorker
        ?.getRegistrations()
        .then((rs) => {
          if (rs.length === 0) return;
          rs.forEach((r) => r.unregister());
          // Unregistering can win the race against the self-destructing
          // sw.js update, so drop the old worker's media caches here too.
          if ('caches' in window) {
            return caches
              .keys()
              .then((ks) =>
                Promise.all(
                  ks
                    .filter((k) => k.startsWith('ronit-portfolio-'))
                    .map((k) => caches.delete(k))
                )
              );
          }
        })
        .catch(() => {});
    };

    const schedule = () => {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(unregisterAll);
      } else {
        timeoutId = setTimeout(unregisterAll, 3000);
      }
    };

    if (document.readyState === 'complete') {
      schedule();
    } else {
      window.addEventListener('load', schedule, { once: true });
    }

    return () => {
      window.removeEventListener('load', schedule);
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
