// Server-side coupon lookup + math, shared by /api/coupon (public validate)
import { pickLatestSetting } from './settings-store.js';
// and /api/order (re-validation before an order is stored).

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

export async function findCoupon(code) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?key=like.coupons*&select=key,value`, {
    cache: 'no-store',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) return null;
  const rows = await res.json();
  const raw = pickLatestSetting(rows, 'coupons');
  if (!raw) return null;
  let coupons = [];
  try { const p = JSON.parse(raw); if (Array.isArray(p)) coupons = p; } catch {}
  const wanted = String(code || '').trim().toUpperCase();
  return coupons.find((c) => c && c.active !== false && String(c.code || '').toUpperCase() === wanted) || null;
}

export function couponDiscount(coupon, subtotal) {
  const st = Number(subtotal) || 0;
  let d = 0;
  if (coupon.type === 'pct') d = Math.round(st * (Number(coupon.value) || 0) / 100);
  else d = Number(coupon.value) || 0;
  return Math.max(0, Math.min(d, st));
}
