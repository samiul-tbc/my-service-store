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

// ২. ডাটা তৈরি (নতুন প্রোডাক্ট ও নোটিশ আপডেট)
export async function POST(req) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'অননুমোদিত অ্যাক্সেস' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, payload } = body;

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
