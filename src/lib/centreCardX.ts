/**
 * framer-motion transformTemplate for carousel cards positioned at left: 50%.
 * Prepends translateX(-50%) so each card column is centred on its own rendered
 * width (a single-line title wider than the card no longer skews the card),
 * leaving the animated x/y/scale to express the offset of the card centre.
 */
export function centreCardX(_: unknown, generated: string): string {
  return generated === 'none' || generated === ''
    ? 'translateX(-50%)'
    : `translateX(-50%) ${generated}`;
}
