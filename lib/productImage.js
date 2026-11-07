// Returns a lightweight src for a product image.
// Base64 data URIs stored in the DB are served through the cached
// /api/img/<id> route instead of being inlined into page payloads.
export function productImageSrc(product, fallback) {
  if (!product || !product.image) return fallback;
  if (typeof product.image === 'string' && product.image.startsWith('data:')) {
    return `/api/img/${product.id}`;
  }
  return product.image;
}
