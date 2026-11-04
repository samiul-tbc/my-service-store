import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    // UddoktaPay payment status check
    const status = body.status;
    if (status !== 'COMPLETED') {
      return NextResponse.json({ message: 'Payment not completed yet' }, { status: 200 });
    }

    const metadata = body.metadata || {};
    const orderId = metadata.order_id || body.invoice_id || `HC-${Date.now().toString().slice(-6)}`;
    const customerName = metadata.customer_name || body.full_name || 'Customer';
    const whatsappNumber = metadata.customer_phone || body.phone || '';
    const serviceName = metadata.service_name || 'Product Order';
    const telegramUsername = metadata.telegram_username || 'নেই';
    const amount = Number(body.amount) || 0;
    const trxId = body.transaction_id || body.invoice_id || 'Auto-Payment';
    const paymentMethod = `bKash/Nagad Auto (${body.payment_method || 'Online'})`;

    const host = process.env.NEXT_PUBLIC_SITE_URL || 'https://hubcart.vercel.app';

    // ১. bKash code-er moto Database-e order save kora
    const res = await fetch(`${host}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceName: serviceName,
        price: amount,
        customerName: customerName,
        whatsappNumber: whatsappNumber,
        telegramUsername: telegramUsername,
        paymentMethod: paymentMethod,
        trxId: trxId,
        status: 'Paid',
      }),
    });

    const data = await res.json();

    // bKash code-er moto generatedOrderId dhora
    const generatedOrderId = data.orderId || data.order_id || data.id || orderId;

    // ২. bKash code-er moto WhatsApp SMS alert pathano
    if (whatsappNumber) {
      try {
        await fetch(`${host}/api/send-whatsapp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: customerName,
            phone: whatsappNumber,
            orderId: generatedOrderId,
            serviceName: serviceName,
          }),
        });
      } catch (waErr) {
        console.error('WhatsApp alert error:', waErr);
      }
    }

    return NextResponse.json({ success: true, orderId: generatedOrderId }, { status: 200 });
  } catch (error) {
    console.error('UddoktaPay Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
