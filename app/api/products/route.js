import { NextResponse } from 'next/server';
import { pickLatestSetting } from '../../../lib/settings-store';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

export async function GET() {
  try {
    const [prodRes, settingsRes, noticeRes] = await Promise.allSettled([
      fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id.desc`, {
        cache: 'no-store',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }),
      fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=key,value`, {
        cache: 'no-store',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }),
      fetch(`${SUPABASE_URL}/rest/v1/site_settings?key=like.announcement*&select=key,value`, {
        cache: 'no-store',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }),
    ]);

    let products = [];
    let notice = '';

    if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
      products = await prodRes.value.json();
    }

    if (noticeRes.status === 'fulfilled' && noticeRes.value.ok) {
      const noticeData = await noticeRes.value.json();
      notice = pickLatestSetting(noticeData, 'announcement') || '';
    }

    // Review aggregates per product (reviews live in site_settings)
    const ratings = {};
    const downloadIds = new Set();
    let productFlags = {};
    const latestReviews = {};
    let latestFlagKey = '';
    if (settingsRes.status === 'fulfilled' && settingsRes.value.ok) {
      const rows = await settingsRes.value.json();
      if (Array.isArray(rows)) {
        for (const row of rows) {
          if (!row.key) continue;
          if (row.key.startsWith('product_flags_')) {
            if (!latestFlagKey || row.key > latestFlagKey) {
              latestFlagKey = row.key;
              try { productFlags = JSON.parse(row.value) || {}; } catch {}
            }
            continue;
          }
          const dm = row.key.match(/^downloadcfg_(\d+)(?:_\d+)?$/);
          if (dm) { downloadIds.add(dm[1]); continue; }
          const rm = row.key.match(/^reviews_(\d+)(?:_(\d+))?$/);
          if (!rm) continue;
          const ver = rm[2] || '';
          if (!latestReviews[rm[1]] || ver > latestReviews[rm[1]].ver) {
            latestReviews[rm[1]] = { ver, value: row.value };
          }
        }
      }
    }

    for (const [pid, entry] of Object.entries(latestReviews)) {
      try {
        const arr = JSON.parse(entry.value);
        if (Array.isArray(arr) && arr.length) {
          const avg = arr.reduce((sm, r) => sm + (Number(r.rating) || 0), 0) / arr.length;
          ratings[pid] = { rating: Math.round(avg * 10) / 10, reviewCount: arr.length };
        }
      } catch {}
    }

    // Slim the payload: never ship base64 images inline — the client loads
    // them from the cached /api/img/<id> route instead.
    const slimProducts = products.map((p) => {
      const base = p && typeof p.image === 'string' && p.image.startsWith('data:')
        ? { ...p, image: `/api/img/${p.id}` }
        : p;
      const r = ratings[String(base.id)] || { rating: 0, reviewCount: 0 };
      return { ...base, rating: r.rating, reviewCount: r.reviewCount, featured: !!((productFlags[String(base.id)] || {}).featured), infoForm: !!((productFlags[String(base.id)] || {}).infoForm), hasDownload: downloadIds.has(String(base.id)) };
    });

    const visibleProducts = slimProducts
      .filter((p) => (productFlags[String(p.id)] || {}).published !== false)
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return NextResponse.json(
      { products: visibleProducts, notice },
      { headers: { 'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=40' } }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message, products: [], notice: '' }, { status: 500 });
  }
}
