import { NextResponse } from 'next/server';
import { findCoupon, couponDiscount } from '../../../lib/coupons-server';

export async function POST(req) {
  try {
    const { code, subtotal } = await req.json();
    const st = Number(subtotal) || 0;
    if (!code || st <= 0) {
      return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
    }
    const coupon = await findCoupon(code);
    if (!coupon) {
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    }
    if (coupon.min && st < Number(coupon.min)) {
      return NextResponse.json({ ok: false, error: 'min_not_met', min: Number(coupon.min) }, { status: 400 });
    }
    const discount = couponDiscount(coupon, st);
    return NextResponse.json({
      ok: true,
      code: String(coupon.code).toUpperCase(),
      type: coupon.type === 'pct' ? 'pct' : 'flat',
      value: Number(coupon.value) || 0,
      discount,
      finalTotal: st - discount,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
