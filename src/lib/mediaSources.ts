/**
 * Resolves the responsive variant of a background video and its poster.
 *
 * Asset layout (see the media pipeline):
 *   /videos/<name>.webm  ->  /videos/v2/1080/<name>.webm  (desktop)
 *                            /videos/v2/720/<name>.webm   (<=1024px or Save-Data)
 *                            /posters/<name>.webp
 *
 * These read matchMedia / navigator.connection, so call them only inside
 * effects or event handlers, never during render (hydration safety).
 */

const VIDEO_PATTERN = /^\/videos\/([^/]+)\.webm$/;

type NetworkInformationLike = { saveData?: boolean; effectiveType?: string };

export function getConnection(): NetworkInformationLike | undefined {
  if (typeof navigator === 'undefined') return undefined;
  return (navigator as unknown as { connection?: NetworkInformationLike }).connection;
}

export function isCompactViewport(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(max-width: 1024px)').matches;
}

export function pickVideoSrc(url: string): string {
  if (typeof window === 'undefined') return url;
  const match = url.match(VIDEO_PATTERN);
  if (!match) return url;
  const dir = isCompactViewport() || getConnection()?.saveData ? '720' : '1080';
  return `/videos/v2/${dir}/${match[1]}.webm`;
}

export function posterFor(url: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const match = url.match(VIDEO_PATTERN);
  return match ? `/posters/${match[1]}.webp` : undefined;
}
