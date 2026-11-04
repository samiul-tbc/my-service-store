import { NextResponse } from 'next/server';

const UDDOKTAPAY_API_KEY = process.env.UDDOKTAPAY_API_KEY;
const UDDOKTAPAY_BASE_URL = 'https://pay.uddoktapay.com/api/checkout-v2';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

export async function POST(req) {
  try {
    const { fullName, phone, email, amount, serviceName } = await req.json();

    // 1. Hub Cart Custom Order ID toiri kora
    const generatedOrderId = `HC-${Math.floor(1000 + Math.random() * 9000)}`;

    // 2. UddoktaPay-te pathanor agei Supabase-e order Pending hishebe save kora
    await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        order_id: generatedOrderId,
        customer_name: fullName,
        whatsapp_number: phone,
        service_name: serviceName || 'Premium Service',
        price: Number(amount),
        status: 'pending',
        payment_method: 'Auto Pay (UddoktaPay)',
        created_at: new Date().toISOString(),
      }),
    });

    // 3. UddoktaPay Payment Request toiri kora
    const response = await fetch(UDDOKTAPAY_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'RT-UDDOKTAPAY-API-KEY': UDDOKTAPAY_API_KEY,
      },
      body: JSON.stringify({
        full_name: fullName,
        email: email || 'customer@hubcart.store',
        amount: String(amount),
        metadata: {
          order_id: generatedOrderId,
          customer_phone: phone,
          customer_name: fullName,
          service_name: serviceName,
        },
        redirect_url: `https://hubcart.vercel.app/order-success?orderId=${generatedOrderId}&phone=${phone}&name=${encodeURIComponent(fullName)}`,
        cancel_url: 'https://hubcart.vercel.app/confirm-order',
        webhook_url: 'https://hubcart.vercel.app/api/uddoktapay-webhook',
      }),
    });

    const data = await response.json();

    if (data.payment_url) {
      return NextResponse.json({ payment_url: data.payment_url });
    }

    return NextResponse.json({ error: 'Payment URL toiri hoyni' }, { status: 400 });
  } catch (err) {
    console.error('Payment creation error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
