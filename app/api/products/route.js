import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

export async function GET() {
  try {
    const [prodRes, noticeRes, settingsRes] = await Promise.allSettled([
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
      fetch(`${SUPABASE_URL}/rest/v1/site_settings?key=eq.announcement&select=value`, {
        cache: 'no-store',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }),
    ]);

    let products = [];
    let notice = '';
    let flashSale = null;

    if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
      products = await prodRes.value.json();
    }

    if (noticeRes.status === 'fulfilled' && noticeRes.value.ok) {
      const noticeData = await noticeRes.value.json();
      if (Array.isArray(noticeData) && noticeData.length > 0) {
        notice = noticeData[0].value;
        const fsRow = noticeData.find((r) => r.key === 'flash_sale');
        if (fsRow && fsRow.value) { try { flashSale = JSON.parse(fsRow.value); } catch {} }
      }
    }

    // Review aggregates per product (reviews live in site_settings)
    const ratings = {};
    if (settingsRes.status === 'fulfilled' && settingsRes.value.ok) {
      const rows = await settingsRes.value.json();
      if (Array.isArray(rows)) {
        for (const row of rows) {
          if (!row.key || !row.key.startsWith('reviews_')) continue;
          try {
            const arr = JSON.parse(row.value);
            if (Array.isArray(arr) && arr.length) {
              const pid = row.key.replace('reviews_', '');
              const avg = arr.reduce((s, r) => s + (Number(r.rating) || 0), 0) / arr.length;
              ratings[pid] = { rating: Math.round(avg * 10) / 10, reviewCount: arr.length };
            }
          } catch {}
        }
      }
    }

    // Slim the payload: never ship base64 images inline — the client loads
    // them from the cached /api/img/<id> route instead.
    const slimProducts = products.map((p) => {
      const base = p && typeof p.image === 'string' && p.image.startsWith('data:')
        ? { ...p, image: `/api/img/${p.id}` }
        : p;
      const r = ratings[String(base.id)] || { rating: 0, reviewCount: 0 };
      return { ...base, rating: r.rating, reviewCount: r.reviewCount };
    });

    return NextResponse.json(
      { products: slimProducts, notice, flashSale },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message, products: [], notice: '', flashSale: null }, { status: 500 });
  }
}
