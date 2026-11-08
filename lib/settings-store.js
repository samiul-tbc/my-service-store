// Versioned settings storage on top of site_settings.
//
// The publishable key can INSERT new site_settings rows but cannot UPDATE
// existing ones (RLS), so every "save" writes a NEW row under
// `<baseKey>_<timestamp>` and every reader takes the newest version,
// falling back to the original base row when no version exists yet.
// This keeps admin saves (notice, coupons, reviews, auto-delivery,
// delivered content) working without a service-role key.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

// Pure helper: from rows of a settings family, return the newest value
// for baseKey (the base row itself counts as the oldest version).
export function pickLatestSetting(rows, baseKey) {
  if (!Array.isArray(rows)) return null;
  let best = null;
  for (const row of rows) {
    if (!row || typeof row.key !== 'string') continue;
    if (row.key === baseKey) {
      if (!best) best = row;
      continue;
    }
    if (row.key.startsWith(baseKey + '_')) {
      const suffix = row.key.slice(baseKey.length + 1);
      if (/^\d+$/.test(suffix) && (!best || row.key > best.key)) best = row;
    }
  }
  return best ? best.value : null;
}

export async function fetchLatestSetting(baseKey) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/site_settings?key=like.${encodeURIComponent(baseKey)}*&select=key,value`,
      { cache: 'no-store', headers }
    );
    if (!res.ok) return null;
    return pickLatestSetting(await res.json(), baseKey);
  } catch {
    return null;
  }
}

export async function insertSettingVersion(baseKey, value) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ key: `${baseKey}_${Date.now()}`, value: String(value) }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
