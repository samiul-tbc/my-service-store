import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { orderId, amount, customerName, phone } = body;

    if (!amount) {
      return NextResponse.json({ error: 'Order amount proyojon' }, { status: 400 });
    }

    const cleanOrderId = orderId || `HC-${Date.now().toString().slice(-6)}`;
    const apiKey = process.env.UDDOKTAPAY_API_KEY || 'vBpZtnIaHhpwaGZHctzfmuVkQGquI';
    const apiUrl = process.env.UDDOKTAPAY_API_URL || 'https://hubcart.paymently.io/api/checkout-v2';

    const payload = {
      full_name: customerName || 'Valued Customer',
      email: 'customer@hubcart.com',
      amount: String(amount),
      metadata: {
        order_id: String(cleanOrderId),
        customer_phone: String(phone || ''),
        customer_name: String(customerName || 'Customer'),
      },
      redirect_url: `https://hubcart.vercel.app/order-success?orderId=${cleanOrderId}`,
      cancel_url: `https://hubcart.vercel.app/processedorder`,
      webhook_url: `https://hubcart.vercel.app/api/uddoktapay-webhook`,
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'RT-UDDOKTAPAY-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data?.status && data?.payment_url) {
      return NextResponse.json({ paymentUrl: data.payment_url });
    }

    return NextResponse.json(
      { error: data?.message || 'UddoktaPay URL toiri korte pareni' },
      { status: 400 }
    );
  } catch (error) {
    console.error('UddoktaPay Server Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
