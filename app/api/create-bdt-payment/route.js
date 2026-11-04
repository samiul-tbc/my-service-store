import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { orderId, amount, customerName, phone, serviceName, telegram } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const apiKey = (process.env.UDDOKTAPAY_API_KEY || '').trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'Vercel-এ UDDOKTAPAY_API_KEY সেট করা নেই।' }, { status: 500 });
    }

    // URL ক্লিন ও অটো-ফিক্স করা (কোনো ডাবল পাথ যেন তৈরি না হয়)
    let rawUrl = (process.env.UDDOKTAPAY_API_URL || process.env.UDDOKTAPAY_BASE_URL || 'https://pay.uddoktapay.com').trim().replace(/\/+$/, '');

    let targetUrl;
    if (rawUrl.includes('/checkout-v2')) {
      targetUrl = rawUrl;
    } else if (rawUrl.endsWith('/api')) {
      targetUrl = `${rawUrl}/checkout-v2`;
    } else {
      targetUrl = `${rawUrl}/api/checkout-v2`;
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

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'RT-UDDOKTAPAY-API-KEY': apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (response.ok && data?.payment_url) {
      return NextResponse.json({ paymentUrl: data.payment_url });
    }

    // গেটওয়ে থেকে কোনো এরর আসলে তা সুন্দরভাবে পাঠানো
    const errorMessage = data?.message || data?.error || (response.status === 404 ? `UddoktaPay URL খুঁজে পাওয়া যায়নি: ${targetUrl}` : 'গেটওয়ে সংযোগে সমস্যা হয়েছে');

    return NextResponse.json({ error: errorMessage }, { status: response.status || 400 });

  } catch (err) {
    console.error('BDT Payment Route Exception:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
