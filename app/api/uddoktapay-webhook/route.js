import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    // পেমেন্ট সফল হলে UddoktaPay 'COMPLETED' স্ট্যাটাস পাঠায়
    if (body.status === 'COMPLETED') {
      const orderId = body.metadata?.order_id || body.invoice_id;
      const customerPhone = body.metadata?.customer_phone;
      const customerName = body.metadata?.customer_name || body.full_name;

      if (customerPhone) {
        await fetch('https://hubcart.vercel.app/api/send-whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: customerName,
            phone: customerPhone,
            orderId: orderId,
          }),
        });
      }
    }

    return NextResponse.json({ status: true });
  } catch (err) {
    console.error('Webhook Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
