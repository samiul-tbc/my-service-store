import { NextResponse } from 'next/server';
import { getVipStatus, vipDiscountFor } from '../../../lib/vip-server';

export async function POST(req) {
  try {
    const { phone, subtotal } = await req.json();
    const st = await getVipStatus(phone);
    return NextResponse.json({
      ...st,
      discount: st.eligible ? vipDiscountFor(subtotal) : 0,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
