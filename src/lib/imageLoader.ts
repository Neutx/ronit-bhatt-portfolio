/**
 * next/image loader for the static export (no optimisation server).
 *
 * Card thumbnails under /images/v2/ ship a pre-built 480px variant in
 * /images/v2/480/; any request for a width up to 480 resolves to it and larger
 * widths fall back to the 720px original. Every other image passes
 * `unoptimized`, so it never reaches this loader and keeps its plain src.
 */
/** `sizes` of the carousel card thumbnails (mirrors the card size classes). */
export const CARD_IMAGE_SIZES =
  '(max-width: 640px) 202px, (max-width: 768px) 230px, (max-width: 1024px) 288px, 346px';

const V2_THUMB = /^\/images\/v2\/([^/]+\.webp)$/;

export default function imageLoader({ src, width }: { src: string; width: number }): string {
  const match = src.match(V2_THUMB);
  if (match && width <= 480) return `/images/v2/480/${match[1]}`;
  return src;
}
