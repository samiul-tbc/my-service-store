import { NextResponse } from 'next/server';

// Product reviews — stored in the existing site_settings key/value table
// under key `reviews_<productId>` as a JSON array string. No new table needed.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: 'Bearer ' + SUPABASE_KEY,
  'Content-Type': 'application/json',
};

const keyFor = (productId) => `reviews_${productId}`;

async function readReviews(productId) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/site_settings?key=eq.${encodeURIComponent(keyFor(productId))}&select=value`,
    { cache: 'no-store', headers }
  );
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0 || !data[0].value) return [];
  try {
    const parsed = JSON.parse(data[0].value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function clean(str, max) {
  return String(str || '')
    .replace(/[<>"'`]/g, '')
    .trim()
    .slice(0, max);
}

export async function GET(request) {
  try {
    const productId = Number(new URL(request.url).searchParams.get('productId'));
    if (!productId || productId < 1) {
      return NextResponse.json({ error: 'Invalid productId' }, { status: 400 });
    }
    const reviews = await readReviews(productId);
    const count = reviews.length;
    const avg = count ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / count : 0;
    // Verified Buyer: the reviewer's phone matches a completed order for this product.
    const norm = (v) => String(v || '').replace(/\D/g, '').slice(-10);
    let verifiedPhones = new Set();
    try {
      const [prodRes, ordRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${productId}&select=title`, { cache: 'no-store', headers }),
        fetch(`${SUPABASE_URL}/rest/v1/orders?status=eq.completed&select=whatsapp_number,service_name&limit=1000`, { cache: 'no-store', headers }),
      ]);
      const prods = prodRes.ok ? await prodRes.json() : [];
      const title = Array.isArray(prods) && prods[0] ? String(prods[0].title || '').toLowerCase() : '';
      const ords = ordRes.ok ? await ordRes.json() : [];
      if (title && Array.isArray(ords)) {
        for (const o of ords) {
          if (String(o.service_name || '').toLowerCase().includes(title)) verifiedPhones.add(norm(o.whatsapp_number));
        }
      }
    } catch {}
    const safe = reviews.map((r) => ({
      name: r.name, rating: r.rating, text: r.text, date: r.date,
      verified: r.phone ? verifiedPhones.has(norm(r.phone)) : false,
    }));
    return NextResponse.json({ reviews: safe, count, avg: Math.round(avg * 10) / 10 });
  } catch (err) {
    return NextResponse.json({ error: err.message, reviews: [], count: 0, avg: 0 }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const productId = Number(body.productId);
    const name = clean(body.name, 60);
    const text = clean(body.text, 600);
    const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 0)));

    if (!productId || productId < 1 || !name || !text || !rating) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    const phone = String(body.phone || '').replace(/[^\d+]/g, '').slice(0, 20);
    const existing = await readReviews(productId);
    const review = { name, rating, text, date: new Date().toISOString(), ...(phone ? { phone } : {}) };
    const updated = [review, ...existing].slice(0, 50);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?on_conflict=key`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify([{ key: keyFor(productId), value: JSON.stringify(updated) }]),
    });

    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json({ error: 'Could not save review', detail: detail.slice(0, 200) }, { status: 502 });
    }

    return NextResponse.json({ ok: true, review, count: updated.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
