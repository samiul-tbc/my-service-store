import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { orderId, amountUSD, customerName, phone } = await req.json();

    if (!orderId || !amountUSD) {
      return NextResponse.json({ error: 'Order ID ও Amount প্রয়োজন' }, { status: 400 });
    }

    const res = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: amountUSD,
        price_currency: 'usd',
        pay_currency: 'usdttrc20', // ডিফল্ট USDT TRC-20
        order_id: String(orderId),
        order_description: `Order #${orderId} - ${customerName || 'Customer'}`,
        ipn_callback_url: 'https://hubcart.vercel.app/api/crypto-webhook',
        success_url: `https://hubcart.vercel.app/order-success?orderId=${orderId}`,
        cancel_url: `https://hubcart.vercel.app/checkout`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || 'Invoice তৈরি ব্যর্থ হয়েছে' }, { status: res.status });
    }

    return NextResponse.json({ invoiceUrl: data.invoice_url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
