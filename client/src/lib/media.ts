import type { CMSMedia } from "shared";

/**
 * Picks the best available URL for a piece of media.
 *
 * The CMS generates resized variants on upload (thumbnail, square, small,
 * medium, large, xlarge). The original file is whatever was dropped in and
 * can be enormous — the card's cover photo was 21 MB — so a sized variant is
 * always preferred when one exists.
 *
 * Falls back to the original when the media predates the image sizes.
 */
export function pickMediaUrl(
  media: CMSMedia | null | undefined,
  preferred: readonly string[] = [],
): string | null {
  if (!media) return null;
  const sizes = media.sizes ?? {};
  for (const name of preferred) {
    const url = sizes[name]?.url;
    if (url) return url;
  }
  return media.url ?? null;
}
