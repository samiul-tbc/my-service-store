import { NextResponse } from 'next/server';
import { readProductFlags, writeProductFlags } from '../../../lib/product-flags-server';
import { fetchLatestSetting, insertSettingVersion, pickLatestSetting } from '../../../lib/settings-store';

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
      const latest = {};
      if (Array.isArray(rows)) {
        for (const row of rows) {
          const m = row.key && row.key.match(/^reviews_(\d+)(?:_(\d+))?$/);
          if (!m) continue;
          const ver = m[2] || '';
          if (!latest[m[1]] || ver > latest[m[1]].ver) latest[m[1]] = { ver, value: row.value };
        }
      }
      const groups = Object.entries(latest).map(([pid, entry]) => {
        let reviews = [];
        try { const p = JSON.parse(entry.value); if (Array.isArray(p)) reviews = p; } catch {}
        return { productId: Number(pid), reviews };
      });
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
      const latestCfg = {};
      if (Array.isArray(rows)) {
        for (const row of rows) {
          const m = row.key && row.key.match(/^autodelivery_(\d+)(?:_(\d+))?$/);
          if (!m) continue;
          const ver = m[2] || '';
          if (!latestCfg[m[1]] || ver > latestCfg[m[1]].ver) latestCfg[m[1]] = { ver, value: row.value };
        }
      }
      const configs = {};
      for (const [pid, entry] of Object.entries(latestCfg)) {
        try { configs[pid] = JSON.parse(entry.value); } catch {}
      }
      return NextResponse.json({ configs });
    }

    if (type === 'offers') {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?key=like.coupons*&select=key,value`, {
        cache: 'no-store',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      const rows = await res.json();
      let coupons = [];
      const rawCoupons = pickLatestSetting(rows, 'coupons');
      if (rawCoupons) { try { const v = JSON.parse(rawCoupons); if (Array.isArray(v)) coupons = v; } catch {} }
      return NextResponse.json({ coupons });
    }

    if (type === 'product-flags') {
      const flags = await readProductFlags();
      return NextResponse.json({ flags });
    }

    if (type === 'notice') {
      const value = await fetchLatestSetting('announcement');
      return NextResponse.json([{ value: value || '' }]);
    }

    let endpoint = '';
    if (type === 'orders') endpoint = `${SUPABASE_URL}/rest/v1/orders?select=*&order=id.desc`;
    else if (type === 'products') endpoint = `${SUPABASE_URL}/rest/v1/products?select=*&order=id.desc`;
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
      const ok = await insertSettingVersion('announcement', String(payload || ''));
      if (!ok) throw new Error('notice save failed');
      return NextResponse.json({ success: true });
    }

    // অটো-ডেলিভারি সেটিংস সেভ (প্রোডাক্ট অনুযায়ী)
    if (action === 'save-autodelivery') {
      const { productId, config } = payload || {};
      if (!productId) {
        return NextResponse.json({ error: 'productId required' }, { status: 400 });
      }
      const ok = await insertSettingVersion(`autodelivery_${productId}`, JSON.stringify(config || {}));
      if (!ok) throw new Error('autodelivery save failed');
      return NextResponse.json({ success: true });
    }

    // ডেলিভারি করা কন্টেন্ট সেভ (অর্ডার অনুযায়ী — কাস্টমার ট্র্যাক পেজে দেখবে)
    if (action === 'save-delivered') {
      const { orderId, content } = payload || {};
      if (!orderId) {
        return NextResponse.json({ error: 'orderId required' }, { status: 400 });
      }
      const ok = await insertSettingVersion(`delivered_${orderId}`, String(content || ''));
      if (!ok) throw new Error('delivered save failed');
      return NextResponse.json({ success: true });
    }

    // Telegram order alert — test message (env: TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)
    if (action === 'test-telegram') {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      if (!token || !chatId) {
        return NextResponse.json({ error: 'env_missing' }, { status: 400 });
      }
      try {
        const tg = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: 'Hub Cart: Telegram order alert test — kaj korche! Notun order ele ekhane message ashbe.', parse_mode: 'HTML' }),
        });
        const data = await tg.json().catch(() => null);
        if (!tg.ok || !data || !data.ok) {
          return NextResponse.json({ error: 'telegram_failed', detail: (data && data.description) || '' }, { status: 502 });
        }
        return NextResponse.json({ ok: true });
      } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
      }
    }

    // প্রোডাক্ট Published / Featured টগল (versioned flags — INSERT-only storage)
    if (action === 'set-product-flag') {
      const productId = String((payload && payload.productId) || '');
      const flag = payload && payload.flag === 'featured' ? 'featured' : 'published';
      if (!productId) {
        return NextResponse.json({ error: 'productId required' }, { status: 400 });
      }
      const flags = await readProductFlags();
      const current = flags[productId] || {};
      flags[productId] = {
        published: current.published !== false,
        featured: !!current.featured,
        [flag]: !!(payload && payload.value),
      };
      const ok = await writeProductFlags(flags);
      if (!ok) {
        return NextResponse.json({ error: 'save_failed' }, { status: 502 });
      }
      return NextResponse.json({ success: true, flags });
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
      const ok = await insertSettingVersion('coupons', JSON.stringify(clean));
      if (!ok) throw new Error('coupons save failed');
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
      const rawReview = await fetchLatestSetting(key);
      let reviews = [];
      if (rawReview) {
        try { const p = JSON.parse(rawReview); if (Array.isArray(p)) reviews = p; } catch {}
      }
      if (index < 0 || index >= reviews.length) {
        return NextResponse.json({ error: 'রিভিউ পাওয়া যায়নি' }, { status: 404 });
      }
      reviews.splice(index, 1);
      const okDel = await insertSettingVersion(key, JSON.stringify(reviews));
      if (!okDel) throw new Error('review delete save failed');
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
