import { useEffect, useRef } from 'react';

interface PreloadItem {
  videoUrl?: string;
  backgroundVideoUrl?: string;
  thumbnail?: string;
}

interface UsePreloadMediaOptions {
  items: PreloadItem[];
  currentIndex: number;
  preloadRange?: number; // Number of adjacent items to preload (default: 1)
}

/**
 * Custom hook to preload media files (videos and images) for adjacent carousel items
 * This prevents black screens when switching between carousel items
 */
export function usePreloadMedia({
  items,
  currentIndex,
  preloadRange = 1,
}: UsePreloadMediaOptions) {
  const preloadedRef = useRef<Set<string>>(new Set());
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const linkElementsRef = useRef<Map<string, HTMLLinkElement>>(new Map());

  useEffect(() => {
    // Check if we're on a slow connection - skip preloading if so
    if (typeof window !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        const effectiveType = connection.effectiveType;
        // Skip preloading on slow connections (2g, slow-2g)
        if (effectiveType === '2g' || effectiveType === 'slow-2g') {
          return;
        }
      }
    }

    // Calculate indices to preload
    const indicesToPreload: number[] = [];
    for (let i = -preloadRange; i <= preloadRange; i++) {
      if (i === 0) continue; // Skip current item
      const index = (currentIndex + i + items.length) % items.length;
      indicesToPreload.push(index);
    }

    // Preload media for adjacent items
    indicesToPreload.forEach((index) => {
      const item = items[index];
      if (!item) return;

      // Preload background video
      const videoUrl = item.backgroundVideoUrl || item.videoUrl;
      if (videoUrl && !preloadedRef.current.has(videoUrl)) {
        preloadedRef.current.add(videoUrl);
        const controller = new AbortController();
        abortControllersRef.current.set(videoUrl, controller);

        // Check if link already exists
        if (!linkElementsRef.current.has(videoUrl)) {
          // Use link preload for better browser optimization
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'video';
          link.href = videoUrl;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
          linkElementsRef.current.set(videoUrl, link);
        }

        // Also fetch to ensure it's in cache
        fetch(videoUrl, {
          signal: controller.signal,
          cache: 'force-cache',
        }).catch(() => {
          // Ignore errors - preload is best effort
        });
      }

      // Preload thumbnail image
      if (item.thumbnail && !preloadedRef.current.has(item.thumbnail)) {
        preloadedRef.current.add(item.thumbnail);
        const controller = new AbortController();
        abortControllersRef.current.set(item.thumbnail, controller);

        // Check if link already exists
        if (!linkElementsRef.current.has(item.thumbnail)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = item.thumbnail;
          document.head.appendChild(link);
          linkElementsRef.current.set(item.thumbnail, link);
        }

        fetch(item.thumbnail, {
          signal: controller.signal,
          cache: 'force-cache',
        }).catch(() => {
          // Ignore errors
        });
      }
    });

    // Cleanup: Cancel preloads for items that are no longer adjacent
    const allUrls = new Set<string>();
    indicesToPreload.forEach((index) => {
      const item = items[index];
      if (item) {
        const videoUrl = item.backgroundVideoUrl || item.videoUrl;
        if (videoUrl) allUrls.add(videoUrl);
        if (item.thumbnail) allUrls.add(item.thumbnail);
      }
    });

    // Cancel preloads that are no longer needed
    abortControllersRef.current.forEach((controller, url) => {
      if (!allUrls.has(url)) {
        controller.abort();
        abortControllersRef.current.delete(url);
        preloadedRef.current.delete(url);
      }
    });

    // Cleanup function
    return () => {
      // Don't cancel on cleanup - let preloads complete
      // This ensures media is ready for next visit
    };
  }, [currentIndex, items, preloadRange]);
}

