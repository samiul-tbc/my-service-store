import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';
const ADMIN_PIN = process.env.ADMIN_PIN;

// সার্ভার সাইড পিন যাচাইকরণ
function verifyAuth(req) {
  const pin = req.headers.get('x-admin-pin');
  if (!ADMIN_PIN) return true; // যদি Vercel-এ পিন সেট না থাকে তবে পাস করবে
  return pin === ADMIN_PIN;
}

// ১. ডেটা ফেচ (Orders, Products, Notice)
export async function GET(req) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'অননুমোদিত অ্যাক্সেস' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  try {
    // সব প্রোডাক্টের রিভিউ (site_settings-এ reviews_<id> কী-তে JSON)
    if (type === 'reviews') {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=key,value`, {
        cache: 'no-store',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      const rows = await res.json();
      const groups = [];
      if (Array.isArray(rows)) {
        for (const row of rows) {
          if (!row.key || !row.key.startsWith('reviews_')) continue;
          let reviews = [];
          try { const p = JSON.parse(row.value); if (Array.isArray(p)) reviews = p; } catch {}
          groups.push({ productId: Number(row.key.replace('reviews_', '')), reviews });
        }
      }
      return NextResponse.json({ groups });
    }

    if (type === 'autodelivery') {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=key,value`, {
        cache: 'no-store',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      const rows = await res.json();
      const configs = {};
      if (Array.isArray(rows)) {
        for (const row of rows) {
          if (!row.key || !row.key.startsWith('autodelivery_')) continue;
          try { configs[row.key.replace('autodelivery_', '')] = JSON.parse(row.value); } catch {}
        }
      }
      return NextResponse.json({ configs });
    }

    if (type === 'offers') {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?key=eq.coupons&select=key,value`, {
        cache: 'no-store',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      const rows = await res.json();
      let coupons = [];
      if (Array.isArray(rows)) {
        for (const row of rows) {
          if (row.key === 'coupons') { try { const v = JSON.parse(row.value); if (Array.isArray(v)) coupons = v; } catch {} }
        }
      }
      return NextResponse.json({ coupons });
    }

    let endpoint = '';
    if (type === 'orders') endpoint = `${SUPABASE_URL}/rest/v1/orders?select=*&order=id.desc`;
    else if (type === 'products') endpoint = `${SUPABASE_URL}/rest/v1/products?select=*&order=id.desc`;
    else if (type === 'notice') endpoint = `${SUPABASE_URL}/rest/v1/site_settings?key=eq.announcement&select=value`;
    else return NextResponse.json({ error: 'ভুল টাইপ' }, { status: 400 });

    const res = await fetch(endpoint, {
      cache: 'no-store',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ২. ডাটা তৈরি ও আপডেট (Add Product, Update Product, Notice)
export async function POST(req) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'অননুমোদিত অ্যাক্সেস' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, payload } = body;

    // নতুন প্রোডাক্ট যোগ করা
    if (action === 'add-product') {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());
      return NextResponse.json({ success: true });
    }

    // প্রোডাক্ট এডিট ও আপডেট করা
    if (action === 'update-product') {
      const { id, title, price, original_price, description, category } = payload;

      if (!id) {
        return NextResponse.json({ error: 'প্রোডাক্ট ID প্রয়োজন' }, { status: 400 });
      }

      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          title,
          price: Number(price),
          original_price: original_price ? Number(original_price) : null,
          description: description || '',
          category: category || 'android-root',
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      return NextResponse.json({ success: true });
    }

    // হোমপেজ নোটিশ আপডেট
    if (action === 'update-notice') {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({ key: 'announcement', value: payload }),
      });

      if (!res.ok) throw new Error(await res.text());
      return NextResponse.json({ success: true });
    }

    // অটো-ডেলিভারি সেটিংস সেভ (প্রোডাক্ট অনুযায়ী)
    if (action === 'save-autodelivery') {
      const { productId, config } = payload || {};
      if (!productId) return NextResponse.json({ error: 'productId প্রয়োজন' }, { status: 400 });
      const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({ key: `autodelivery_${productId}`, value: JSON.stringify(config || {}) }),
      });
      if (!res.ok) throw new Error(await res.text());
      return NextResponse.json({ success: true });
    }

    // ডেলিভারি করা কন্টেন্ট সেভ (অর্ডার অনুযায়ী — কাস্টমার ট্র্যাক পেজে দেখবে)
    if (action === 'save-delivered') {
      const { orderId, content } = payload || {};
      if (!orderId) return NextResponse.json({ error: 'orderId প্রয়োজন' }, { status: 400 });
      const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({ key: `delivered_${orderId}`, value: String(content || '') }),
      });
      if (!res.ok) throw new Error(await res.text());
      return NextResponse.json({ success: true });
    }

    // কুপন তালিকা সেভ (Offers ট্যাব)
    if (action === 'save-coupons') {
      const list = Array.isArray(payload) ? payload : [];
      const clean = list.map((c) => ({
        code: String(c.code || '').trim().toUpperCase().slice(0, 24),
        type: c.type === 'pct' ? 'pct' : 'flat',
        value: Math.max(0, Number(c.value) || 0),
        min: Math.max(0, Number(c.min) || 0),
        active: c.active !== false,
      })).filter((c) => c.code && c.value > 0);
      const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({ key: 'coupons', value: JSON.stringify(clean) }),
      });
      if (!res.ok) throw new Error(await res.text());
      return NextResponse.json({ success: true, coupons: clean });
    }


    return NextResponse.json({ error: 'অবৈধ অ্যাকশন' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ৩. অর্ডার স্ট্যাটাস আপডেট (Patch)
export async function PATCH(req) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'অননুমোদিত অ্যাক্সেস' }, { status: 401 });
  }

  try {
    const { orderDbId, status } = await req.json();

    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${orderDbId}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error(await res.text());
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ৪. ডিলিট অপারেশন (Product ও Order Delete)
export async function DELETE(req) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'অননুমোদিত অ্যাক্সেস' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    // একটি রিভিউ ডিলিট (reviews_<productId> JSON থেকে index সরানো)
    if (type === 'review') {
      const productId = searchParams.get('productId');
      const index = Number(searchParams.get('index'));
      if (!productId || Number.isNaN(index)) {
        return NextResponse.json({ error: 'productId/index মিসিং' }, { status: 400 });
      }
      const key = `reviews_${productId}`;
      const getRes = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?key=eq.${encodeURIComponent(key)}&select=value`, {
        cache: 'no-store',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      const rows = await getRes.json();
      let reviews = [];
      if (Array.isArray(rows) && rows.length && rows[0].value) {
        try { const p = JSON.parse(rows[0].value); if (Array.isArray(p)) reviews = p; } catch {}
      }
      if (index < 0 || index >= reviews.length) {
        return NextResponse.json({ error: 'রিভিউ পাওয়া যায়নি' }, { status: 404 });
      }
      reviews.splice(index, 1);
      const upRes = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?on_conflict=key`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify([{ key, value: JSON.stringify(reviews) }]),
      });
      if (!upRes.ok) throw new Error(await upRes.text());
      return NextResponse.json({ success: true, count: reviews.length });
    }

    if (!type || !id) return NextResponse.json({ error: 'ID মিসিং' }, { status: 400 });

    const endpoint = type === 'order' 
      ? `${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`
      : `${SUPABASE_URL}/rest/v1/products?id=eq.${id}`;

    const res = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!res.ok) throw new Error(await res.text());
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
