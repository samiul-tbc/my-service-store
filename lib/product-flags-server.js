// Product publish/featured flags — stored in site_settings as versioned
// keys (product_flags_<timestamp>). The publishable key can INSERT new rows
// but cannot UPDATE existing ones, so each save writes a NEW version and
// readers always take the newest. Shape: { "<productId>": { published, featured } }

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

export async function readProductFlags() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/site_settings?key=like.product_flags_*&select=key,value`,
      { cache: 'no-store', headers }
    );
    if (!res.ok) return {};
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return {};
    let latest = rows[0];
    for (const row of rows) {
      if (row.key > latest.key) latest = row;
    }
    const parsed = JSON.parse(latest.value || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export async function writeProductFlags(flags) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ key: `product_flags_${Date.now()}`, value: JSON.stringify(flags) }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
