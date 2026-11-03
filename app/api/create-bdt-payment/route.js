import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { orderId, amount, customerName, phone } = await req.json();

    if (!orderId || !amount) {
      return NextResponse.json({ error: 'Order ID ও Amount আবশ্যক' }, { status: 400 });
    }

    const apiUrl = process.env.UDDOKTAPAY_API_URL || 'https://hubcart.paymently.io/api/checkout-v2';
    const apiKey = process.env.UDDOKTAPAY_API_KEY || 'vBpZtnIaHhpwaGZHctzfmuVkQGquI';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'RT-UDDOKTAPAY-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: customerName || 'Valued Customer',
        email: 'customer@hubcart.com',
        amount: String(amount),
        metadata: {
          order_id: String(orderId),
          customer_phone: String(phone || ''),
          customer_name: String(customerName || 'Customer'),
        },
        redirect_url: `https://hubcart.vercel.app/order-success?orderId=${orderId}`,
        cancel_url: `https://hubcart.vercel.app/processedorder`,
        webhook_url: `https://hubcart.vercel.app/api/uddoktapay-webhook`,
      }),
    });

    const data = await response.json();

    if (data.status && data.payment_url) {
      return NextResponse.json({ paymentUrl: data.payment_url });
    }

    return NextResponse.json(
      { error: data.message || 'পেমেন্ট শুরু করা যায়নি' },
      { status: 400 }
    );
  } catch (error) {
    console.error('UddoktaPay API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
