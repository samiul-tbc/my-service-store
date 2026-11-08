import { NextResponse } from 'next/server';
import { insertSettingVersion } from '../../../lib/settings-store';

// Logs a search query that returned no results (customer demand signals).
export async function POST(req) {
  try {
    const { q } = await req.json();
    const clean = String(q || '').replace(/[<>"'`]/g, '').trim().slice(0, 60);
    if (clean.length >= 2) {
      await insertSettingVersion('searchlog', clean);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
