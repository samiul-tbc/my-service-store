// VIP loyalty: every 3 completed orders earns 5% off on the next order.
// Once used, the customer earns again after 3 more completed orders.
// Used rewards are counted from `vip_used_<phone10>_<ts>` marker rows in
// site_settings (written by /api/order when a VIP discount is applied).

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

export const VIP_PCT = 5;

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

const norm = (v) => String(v || '').replace(/\D/g, '').slice(-10);

export async function getVipStatus(phone) {
  const target = norm(phone);
  const empty = { completed: 0, used: 0, earned: 0, eligible: false, pct: VIP_PCT, toNext: 3 };
  if (target.length < 10) return empty;
  try {
    const [ordRes, usedRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/orders?status=eq.completed&select=whatsapp_number&limit=1000`, { cache: 'no-store', headers }),
      fetch(`${SUPABASE_URL}/rest/v1/site_settings?key=like.vip_used_${target}*&select=key`, { cache: 'no-store', headers }),
    ]);
    const ords = ordRes.ok ? await ordRes.json() : [];
    const completed = Array.isArray(ords) ? ords.filter((o) => norm(o.whatsapp_number) === target).length : 0;
    const usedRows = usedRes.ok ? await usedRes.json() : [];
    const used = Array.isArray(usedRows) ? usedRows.length : 0;
    const earned = Math.floor(completed / 3);
    const eligible = earned > used;
    const toNext = eligible ? 0 : 3 - (completed % 3);
    return { completed, used, earned, eligible, pct: VIP_PCT, toNext };
  } catch {
    return empty;
  }
}

export function vipDiscountFor(subtotal) {
  return Math.round((Number(subtotal) || 0) * VIP_PCT / 100);
}
