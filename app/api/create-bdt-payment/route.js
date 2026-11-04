import { NextResponse } from 'next/server';

const UDDOKTAPAY_API_KEY = process.env.UDDOKTAPAY_API_KEY;
const UDDOKTAPAY_BASE_URL = process.env.UDDOKTAPAY_BASE_URL || 'https://pay.uddoktapay.com/api/checkout-v2';

export async function POST(req) {
  try {
    const { orderId, amount, customerName, phone, serviceName, telegram } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const host = process.env.NEXT_PUBLIC_SITE_URL || 'https://hubcart.vercel.app';
    const finalOrderId = orderId || `HC-${Date.now().toString().slice(-6)}`;

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
          order_id: finalOrderId,
          customer_name: customerName || 'Customer',
          customer_phone: phone || '',
          service_name: serviceName || 'Product Order',
          telegram_username: telegram || 'নেই',
        },
        redirect_url: `${host}/order-success?orderId=${finalOrderId}`,
        cancel_url: `${host}/processedorder`,
        webhook_url: `${host}/api/uddoktapay-webhook`,
      }),
    });

    const data = await response.json();

    if (data.payment_url) {
      return NextResponse.json({ paymentUrl: data.payment_url });
    }

    return NextResponse.json({ error: data.message || 'Payment URL toiri kora jayni' }, { status: 400 });
  } catch (err) {
    console.error('BDT Payment Route Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
