import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

// Serves a product's image (stored in Supabase as a base64 data URI) as a real,
// cacheable image response, so pages never ship the base64 payload in JSON.
export async function GET(request, { params }) {
  try {
    const id = Number(params?.id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}&select=image`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (!res.ok) {
      return NextResponse.json({ error: 'Image lookup failed' }, { status: 404 });
    }
    const rows = await res.json();
    const image = Array.isArray(rows) && rows.length > 0 ? rows[0].image : null;
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    if (typeof image === 'string' && image.startsWith('data:')) {
      const match = image.match(/^data:([^;,]+)?(;base64)?,([\s\S]*)$/);
      if (!match) {
        return NextResponse.json({ error: 'Invalid image data' }, { status: 404 });
      }
      const mime = match[1] || 'application/octet-stream';
      const buffer = match[2]
        ? Buffer.from(match[3], 'base64')
        : Buffer.from(decodeURIComponent(match[3]), 'utf8');
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mime,
          'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
        },
      });
    }

    if (typeof image === 'string' && /^https?:\/\//i.test(image)) {
      return NextResponse.redirect(image, 302);
    }

    return NextResponse.json({ error: 'Unsupported image format' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
