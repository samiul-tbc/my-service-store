import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const event = await req.json();

    // পেমেন্ট সফলভাবে শেষ হলে (finished)
    if (event.payment_status === 'finished') {
      const orderId = event.order_id;

      // কাস্টমারের WhatsApp-এ নোটিফিকেশন ট্রিগার করা
      await fetch('https://hubcart.vercel.app/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: event.customer_name || 'Valued Customer',
          phone: event.customer_phone || '', 
          orderId: orderId,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
