// Hub Cart — client-side shop helpers: wishlist, recently viewed, coupon math.
// All state lives in localStorage; no account needed.

const WISH_KEY = 'hubcart_wishlist';
const RECENT_KEY = 'hubcart_recent';

function readList(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(v) ? v : [];
  } catch { return []; }
}

export function getWishlist() {
  return readList(WISH_KEY).map(Number).filter(Boolean);
}

export function isWished(id) {
  return getWishlist().includes(Number(id));
}

export function toggleWishlist(id) {
  const nid = Number(id);
  const list = getWishlist();
  const next = list.includes(nid) ? list.filter((x) => x !== nid) : [nid, ...list];
  try { localStorage.setItem(WISH_KEY, JSON.stringify(next)); } catch {}
  return next.includes(nid);
}

export function getRecent() {
  return readList(RECENT_KEY);
}

export function pushRecent(product) {
  if (!product || !product.id) return;
  const slim = {
    id: product.id,
    title: product.title,
    price: product.price,
    original_price: product.original_price,
    image: product.image,
    category: product.category,
  };
  const list = readList(RECENT_KEY).filter((p) => Number(p.id) !== Number(product.id));
  list.unshift(slim);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 8))); } catch {}
}

// Coupon math — mirrors the server logic in /api/coupon and /api/order.
export function couponDiscount(coupon, subtotal) {
  if (!coupon) return 0;
  const st = Number(subtotal) || 0;
  let d = 0;
  if (coupon.type === 'pct') d = Math.round(st * (Number(coupon.value) || 0) / 100);
  else d = Number(coupon.value) || 0;
  return Math.max(0, Math.min(d, st));
}
