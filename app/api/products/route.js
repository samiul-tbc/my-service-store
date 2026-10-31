import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

export async function GET() {
  try {
    const [prodRes, noticeRes] = await Promise.allSettled([
      fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id.desc`, {
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

    if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
      products = await prodRes.value.json();
    }

    if (noticeRes.status === 'fulfilled' && noticeRes.value.ok) {
      const noticeData = await noticeRes.value.json();
      if (Array.isArray(noticeData) && noticeData.length > 0) {
        notice = noticeData[0].value;
      }
    }

    return NextResponse.json({ products, notice });
  } catch (err) {
    return NextResponse.json({ error: err.message, products: [], notice: '' }, { status: 500 });
  }
}
