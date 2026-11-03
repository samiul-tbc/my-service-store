import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'API Route Active!' });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { orderId, amount, customerName, phone } = body;

    const cleanOrderId = orderId || `HC-${Date.now().toString().slice(-6)}`;

    // Vercel theke API key ebong URL read kora
    const apiKey = process.env.UDDOKTAPAY_API_KEY;
    const rawUrl = process.env.UDDOKTAPAY_API_URL || 'https://hubcart.paymently.io/api';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Vercel environment variables-e UDDOKTAPAY_API_KEY pawa jayni!' },
        { status: 500 }
      );
    }

    // Base URL er sheshe checkout endpoint auto-adjust kora
    const cleanBaseUrl = rawUrl.replace(/\/+$/, ''); // Shesh-er slash bad deya
    const apiUrl = cleanBaseUrl.endsWith('/checkout-v2')
      ? cleanBaseUrl
      : `${cleanBaseUrl}/checkout-v2`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'RT-UDDOKTAPAY-API-KEY': apiKey,
        'RT-PAYMENTLY-API-KEY': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        full_name: customerName || 'Valued Customer',
        email: 'customer@hubcart.com',
        amount: String(amount),
        metadata: {
          order_id: String(cleanOrderId),
          customer_phone: String(phone || ''),
          customer_name: String(customerName || ''),
        },
        redirect_url: `https://hubcart.vercel.app/order-success?orderId=${cleanOrderId}`,
        cancel_url: `https://hubcart.vercel.app/processedorder`,
        webhook_url: `https://hubcart.vercel.app/api/uddoktapay-webhook`,
      }),
    });

    const data = await response.json();

    if (data?.status && data?.payment_url) {
      return NextResponse.json({ paymentUrl: data.payment_url });
    }

    return NextResponse.json(
      { error: data?.message || 'Payment gateway response error' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
