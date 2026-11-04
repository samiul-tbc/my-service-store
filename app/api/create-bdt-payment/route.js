import { NextResponse } from 'next/server';

const UDDOKTAPAY_API_KEY = process.env.UDDOKTAPAY_API_KEY;
const UDDOKTAPAY_BASE_URL = process.env.UDDOKTAPAY_BASE_URL || 'https://pay.uddoktapay.com/api/checkout-v2';

export async function POST(req) {
  try {
    const { orderId, amount, customerName, phone, serviceName } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const host = process.env.NEXT_PUBLIC_SITE_URL || 'https://hubcart.vercel.app';

    const response = await fetch(UDDOKTAPAY_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'RT-UDDOKTAPAY-API-KEY': UDDOKTAPAY_API_KEY,
      },
      body: JSON.stringify({
        full_name: customerName || 'Hub Cart Customer',
        email: 'customer@hubcart.store',
        amount: String(amount),
        metadata: {
          order_id: orderId,
          customer_phone: phone,
          customer_name: customerName,
          service_name: serviceName,
        },
        redirect_url: `${host}/order-success?orderId=${orderId}`,
        cancel_url: `${host}/processedorder`,
        webhook_url: `${host}/api/uddoktapay-webhook`,
      }),
    });

    const data = await response.json();

    if (data.payment_url) {
      return NextResponse.json({ paymentUrl: data.payment_url });
    }

    return NextResponse.json({ error: data.message || 'Payment URL তৈরি করা যায়নি' }, { status: 400 });
  } catch (err) {
    console.error('BDT Payment Route Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
