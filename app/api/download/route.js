import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { fetchLatestSetting, insertSettingVersion } from '../../../lib/settings-store';

// One-time (limited) download gate for paid source files.
// The real file lives OUTSIDE public/ (delivery-private/) and is only
// served here after verifying: order exists + status completed + the
// buyer's phone matches the order + a per-product download config
// exists (site_settings `downloadcfg_<productId>` = {file, name, limit}).
// Every successful download writes a `dlcount_<orderId>_<ts>` marker row;
// once the markers reach the limit, the gate closes for good.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

const headers = {
  'Content-Type': 'application/json',
};

const last10 = (p) => String(p || '').replace(/\D/g, '').slice(-10);

async function sb(pathname) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`, {
    cache: 'no-store',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) return null;
  return res.json();
}

async function resolveDownload(order) {
  const products = await sb('products?select=id,title');
  if (!Array.isArray(products)) return null;
  const prod = products.find((p) => p.title && order.service_name && order.service_name.includes(p.title));
  if (!prod) return null;
  const raw = await fetchLatestSetting(`downloadcfg_${prod.id}`);
  if (!raw) return null;
  try {
    const cfg = JSON.parse(raw);
    if (cfg && cfg.file) return { prod, cfg };
  } catch {}
  return null;
}

async function countDownloads(orderId) {
  const rows = await sb(`site_settings?key=like.${encodeURIComponent(`dlcount_${orderId}`)}*&select=key`);
  if (!Array.isArray(rows)) return 0;
  const re = new RegExp(`^dlcount_${orderId}_\\d+$`);
  return rows.filter((r) => re.test(r.key || '')).length;
}

export async function POST(req) {
  let body = {};
  try { body = await req.json(); } catch {}
  const orderId = String(body.orderId || '').trim().toUpperCase();
  const phone = last10(body.phone);
  const action = body.action === 'download' ? 'download' : 'info';

  if (!orderId || phone.length < 10) {
    return NextResponse.json({ available: false, reason: 'input' }, { status: 400 });
  }

  const orders = await sb(`orders?order_id=eq.${encodeURIComponent(orderId)}&select=*`);
  const order = Array.isArray(orders) && orders.length ? orders[0] : null;
  if (!order) return NextResponse.json({ available: false, reason: 'notfound' }, { status: 404 });
  if (last10(order.whatsapp_number) !== phone) {
    return NextResponse.json({ available: false, reason: 'phone' }, { status: 403 });
  }
  if ((order.status || '').toLowerCase() !== 'completed') {
    return NextResponse.json({ available: false, reason: 'status' }, { status: 403 });
  }

  const found = await resolveDownload(order);
  if (!found) return NextResponse.json({ available: false, reason: 'nodl' });

  const limit = Math.max(1, parseInt(found.cfg.limit, 10) || 3);
  const used = await countDownloads(orderId);
  const remaining = Math.max(0, limit - used);

  if (action === 'info') {
    return NextResponse.json({ available: remaining > 0, remaining, limit, ...(remaining > 0 ? {} : { reason: 'limit' }) });
  }

  if (remaining <= 0) {
    return NextResponse.json({ available: false, reason: 'limit' }, { status: 403 });
  }

  const safeFile = path.basename(String(found.cfg.file));
  let buf;
  try {
    buf = await readFile(path.join(process.cwd(), 'delivery-private', safeFile));
  } catch {
    return NextResponse.json({ available: false, reason: 'file' }, { status: 500 });
  }

  await insertSettingVersion(`dlcount_${orderId}`, new Date().toISOString());

  const name = String(found.cfg.name || safeFile).replace(/[^\w.\- ]/g, '') || 'download.html';
  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${name}"`,
      'Content-Length': String(buf.length),
      'Cache-Control': 'no-store',
    },
  });
}
