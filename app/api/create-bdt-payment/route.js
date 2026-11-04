import { NextResponse } from 'next/server';

const UDDOKTAPAY_API_KEY = process.env.UDDOKTAPAY_API_KEY;

// UDDOKTAPAY_API_URL অথবা UDDOKTAPAY_BASE_URL দুইটাই হ্যান্ডেল করা হয়েছে
let rawUrl = process.env.UDDOKTAPAY_API_URL || process.env.UDDOKTAPAY_BASE_URL || 'https://pay.uddoktapay.com/api/checkout-v2';
const UDDOKTAPAY_URL = rawUrl.endsWith('/api/checkout-v2') 
  ? rawUrl 
  : `${rawUrl.replace(/\/$/, '')}/api/checkout-v2`;

export async function POST(req) {
  try {
    const { orderId, amount, customerName, phone, serviceName, telegram } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    if (!UDDOKTAPAY_API_KEY) {
      console.error('UDDOKTAPAY_API_KEY missing in environment variables');
      return NextResponse.json({ error: 'UddoktaPay API Key missing in environment settings' }, { status: 500 });
    }

    const host = process.env.NEXT_PUBLIC_SITE_URL || 'https://hubcart.vercel.app';
    const finalOrderId = orderId || `HC-${Date.now().toString().slice(-6)}`;

    const payload = {
      full_name: customerName || 'Hub Cart Customer',
      email: 'customer@hubcart.store',
      amount: String(amount),
      metadata: {
        order_id: finalOrderId,
        customer_name: customerName || 'Customer',
        customer_phone: phone || '',
        service_name: serviceName || 'Product Order',
        telegram_username: telegram || 'N/A',
      },
      redirect_url: `${host}/order-success?orderId=${finalOrderId}`,
      cancel_url: `${host}/processedorder`,
      webhook_url: `${host}/api/uddoktapay-webhook`,
    };

    const response = await fetch(UDDOKTAPAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'RT-UDDOKTAPAY-API-KEY': UDDOKTAPAY_API_KEY.trim(),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.payment_url) {
      return NextResponse.json({ paymentUrl: data.payment_url });
    }

    console.error('UddoktaPay Error Response:', data);
    return NextResponse.json({ 
      error: data.message || (typeof data.errors === 'object' ? JSON.stringify(data.errors) : 'Payment gateway rejected request') 
    }, { status: 400 });

  } catch (err) {
    console.error('BDT Payment Route Exception:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
