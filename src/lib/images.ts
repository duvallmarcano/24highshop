import largeIds from '../data/product-image-sizes.json';

/**
 * The catalogue stores image ids, not paths. Everything that renders a
 * product shot builds its URL here so the storage layout stays one decision.
 *
 * The source mirror captured a 1000px crop for most products but only a
 * 200px thumbnail for the rest, so `productImage` asks for the largest crop
 * that actually exists rather than linking a file that is not there.
 */
const SIZES = [200, 1000] as const;
export type ProductImageSize = (typeof SIZES)[number];

const HAS_LARGE = new Set(largeIds as string[]);

export function hasLarge(id: string): boolean {
  return HAS_LARGE.has(id);
}

export function productImage(id: string, size: ProductImageSize = 1000): string {
  const actual = size === 1000 && !HAS_LARGE.has(id) ? 200 : size;
  return `/images/products/${id}-${actual}.webp`;
}

/** `srcset` across the crops we actually hold for this id. */
export function productSrcSet(id: string): string {
  const sizes = HAS_LARGE.has(id) ? SIZES : ([200] as const);
  return sizes.map((s) => `${productImage(id, s)} ${s}w`).join(', ');
}

export const PLACEHOLDER = '/images/layout/logo-200.webp';

export function firstImage(images: string[], size: ProductImageSize = 1000): string {
  return images.length ? productImage(images[0], size) : PLACEHOLDER;
}
