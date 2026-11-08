import { NextResponse } from 'next/server';
import { findCoupon, couponDiscount } from '../../../lib/coupons-server';
import { getVipStatus, vipDiscountFor } from '../../../lib/vip-server';
import { insertSettingVersion } from '../../../lib/settings-store';

const SUPABASE_URL = 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

export async function POST(req) {
  try {
    const body = await req.json();
    const { serviceName, price, customerName, whatsappNumber, telegramUsername, paymentMethod, trxId, couponCode, subtotal } = body;

    if (!serviceName || !customerName || !whatsappNumber) {
      return NextResponse.json({ error: 'প্রয়োজনীয় সকল তথ্য পূরণ করুন' }, { status: 400 });
    }

    // কুপন থাকলে সার্ভার সাইডে আবার যাচাই — ক্লায়েন্টের পাঠানো ছাড় বিশ্বাস করা হয় না
    let finalPrice = Number(price) || 0;
    let couponNote = '';
    if (couponCode && Number(subtotal) > 0) {
      try {
        const coupon = await findCoupon(couponCode);
        if (coupon && !(coupon.min && Number(subtotal) < Number(coupon.min))) {
          const discount = couponDiscount(coupon, Number(subtotal));
          finalPrice = Number(subtotal) - discount;
          couponNote = `${String(coupon.code).toUpperCase()} (-৳${discount})`;
        }
      } catch (e) { console.error('Coupon re-validation error:', e); }
    }

    // VIP loyalty: কুপন না থাকলে, প্রতি ৩টি completed অর্ডারে একবার ৫% ছাড়
    let vipNote = '';
    let vipApplied = false;
    if (!couponNote && Number(subtotal) > 0) {
      try {
        const vip = await getVipStatus(whatsappNumber);
        if (vip.eligible) {
          const discount = vipDiscountFor(Number(subtotal));
          if (discount > 0) {
            finalPrice = Number(subtotal) - discount;
            vipNote = `VIP 5% (-৳${discount})`;
            vipApplied = true;
          }
        }
      } catch (e) { console.error('VIP check error:', e); }
    }

    // Duplicate TrxID যাচাই — একই TrxID আগের কোনো অর্ডারে থাকলে সতর্কতা
    let dupNote = '';
    const trxClean = String(trxId || '').trim();
    if (trxClean && trxClean.toUpperCase() !== 'N/A') {
      try {
        const dupRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?trx_id=ilike.${encodeURIComponent(trxClean)}&select=order_id,service_name&limit=3`, {
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        });
        if (dupRes.ok) {
          const dups = await dupRes.json();
          if (Array.isArray(dups) && dups.length > 0) {
            dupNote = `Duplicate TrxID! আগের অর্ডার: ${dups[0].order_id}`;
          }
        }
      } catch (e) { console.error('Dup TrxID check error:', e); }
    }

    // ৪ ডিজিটের ইউনিক অর্ডার আইডি তৈরি (যেমন: HC-7391)
    const orderId = `HC-${Math.floor(1000 + Math.random() * 9000)}`;

    // ১. Supabase ডাটাবেজে অর্ডার সেভ
    await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        order_id: orderId,
        service_name: serviceName,
        price: finalPrice,
        customer_name: customerName,
        whatsapp_number: whatsappNumber,
        telegram_username: telegramUsername || 'দেওয়া হয়নি',
        payment_method: paymentMethod,
        trx_id: trxId || 'N/A',
        status: 'pending',
      }),
    });

    // VIP ছাড় ব্যবহার হলে marker রেখে দেওয়া (পরের ৩ অর্ডারের আগে আর পাবে না)
    if (vipApplied) {
      try {
        const phoneKey = String(whatsappNumber || '').replace(/\D/g, '').slice(-10);
        if (phoneKey) await insertSettingVersion(`vip_used_${phoneKey}`, orderId);
      } catch (e) { console.error('VIP marker error:', e); }
    }

    // ২. Telegram বট নোটিফিকেশন
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (BOT_TOKEN && CHAT_ID) {
      const message = `🛒 <b>Hub Cart - নতুন অর্ডার এসেছে!</b>\n\n` +
        `🆔 <b>অর্ডার আইডি:</b> <code>${orderId}</code>\n` +
        `📦 <b>সার্ভিস / পণ্য:</b> ${serviceName}\n` +
        `💰 <b>মূল্য:</b> ৳${finalPrice}${couponNote ? ` (কুপন: ${couponNote})` : ''}${vipNote ? ` (VIP: ${vipNote})` : ''}\n\n` +
        `👤 <b>কাস্টমার:</b> ${customerName}\n` +
        `📞 <b>WhatsApp:</b> ${whatsappNumber}\n` +
        `✈️ <b>Telegram:</b> ${telegramUsername || 'দেওয়া হয়নি'}\n\n` +
        `💳 <b>পেমেন্ট মেথড:</b> ${paymentMethod}\n` +
        `🔢 <b>TrxID:</b> <code>${trxId || 'N/A'}</code>\n\n` +
        `${dupNote ? `⚠️ <b>সতর্কতা:</b> ${dupNote}\n` : ''}⚡ <b>স্ট্যাটাস:</b> ⏳ Pending`;

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      });
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('Order API Error:', error);
    return NextResponse.json({ error: 'সার্ভার এরর হয়েছে' }, { status: 500 });
  }
}
