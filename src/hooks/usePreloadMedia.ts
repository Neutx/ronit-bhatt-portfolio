import { useEffect, useRef, useState } from 'react';
import { getConnection } from '@/src/lib/mediaSources';
import imageLoader, { CARD_IMAGE_SIZES } from '@/src/lib/imageLoader';

interface PreloadItem {
  videoUrl?: string;
  backgroundVideoUrl?: string;
  thumbnail?: string;
}

interface UsePreloadMediaOptions {
  items: PreloadItem[];
  currentIndex: number;
  /** Scroll direction: 'right' warms the next item, 'left' the previous one. */
  direction?: 'left' | 'right';
  preloadRange?: number; // Number of items ahead to warm (default: 1)
  /** Start only once the active background video has fired 'canplaythrough'. */
  enabled: boolean;
}

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Warms the media of the item ahead in the scroll direction, after the active
 * background video can play through and the main thread is idle.
 *
 * - Thumbnails are requested once per URL at low fetch priority.
 * - Videos are NOT fetched here. The hook returns the data URL of the next
 *   background video so the caller can warm its inactive <video> element.
 * - Skipped entirely on Save-Data or on connections slower than 4g.
 */
export function usePreloadMedia({
  items,
  currentIndex,
  direction = 'right',
  preloadRange = 1,
  enabled,
}: UsePreloadMediaOptions): string | null {
  const preloadedImagesRef = useRef<Set<string>>(new Set());
  const [warm, setWarm] = useState<{ index: number; direction: string; url: string } | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || items.length < 2) return;

    const connection = getConnection();
    if (connection?.saveData) return;
    if (connection?.effectiveType && connection.effectiveType !== '4g') return;

    const step = direction === 'left' ? -1 : 1;
    const targets: PreloadItem[] = [];
    for (let i = 1; i <= preloadRange; i++) {
      const index = (((currentIndex + step * i) % items.length) + items.length) % items.length;
      if (items[index]) targets.push(items[index]);
    }

    const run = () => {
      targets.forEach((item) => {
        const thumb = item.thumbnail;
        if (thumb && !preloadedImagesRef.current.has(thumb)) {
          preloadedImagesRef.current.add(thumb);
          const img = new Image();
          (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = 'low';
          img.decoding = 'async';
          // Same candidates as the card <Image>, so the browser warms the file
          // the card will actually request (480 variant on phones).
          img.sizes = CARD_IMAGE_SIZES;
          img.srcset = `${imageLoader({ src: thumb, width: 480 })} 480w, ${thumb} 720w`;
          img.src = thumb;
        }
      });

      const nextVideo = targets[0]?.backgroundVideoUrl || targets[0]?.videoUrl;
      if (nextVideo) setWarm({ index: currentIndex, direction, url: nextVideo });
    };

    const w = window as IdleWindow;
    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(run, { timeout: 4000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const timeoutId = window.setTimeout(run, 1500);
    return () => window.clearTimeout(timeoutId);
  }, [enabled, currentIndex, direction, items, preloadRange]);

  if (!enabled || !warm || warm.index !== currentIndex || warm.direction !== direction) {
    return null;
  }
  return warm.url;
}
