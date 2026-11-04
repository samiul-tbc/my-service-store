import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    // UddoktaPay পেমেন্ট সম্পন্ন হলে 'COMPLETED' স্ট্যাটাস পাঠায়
    const status = body.status;
    if (status !== 'COMPLETED') {
      return NextResponse.json({ message: 'Payment not completed yet' }, { status: 200 });
    }

    // মেটাডাটা থেকে গ্রাহক ও অর্ডারের তথ্য সংগ্রহ
    const metadata = body.metadata || {};
    const orderId = metadata.order_id || body.invoice_id || `HC-${Date.now().toString().slice(-6)}`;
    const customerName = metadata.customer_name || body.full_name || 'Customer';
    const whatsappNumber = metadata.customer_phone || '';
    const serviceName = metadata.service_name || 'Product Order';
    const amount = Number(body.amount) || 0;
    const trxId = body.transaction_id || body.invoice_id || 'UddoktaPay';
    const paymentChannel = body.payment_method || 'bKash/Nagad Auto';

    const host = process.env.NEXT_PUBLIC_SITE_URL || 'https://hubcart.vercel.app';

    // ১. ডাটাবেজে অর্ডার এন্ট্রি করা (/api/order কল করা)
    try {
      await fetch(`${host}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderId,
          serviceName: serviceName,
          price: amount,
          customerName: customerName,
          whatsappNumber: whatsappNumber,
          telegramUsername: 'N/A',
          paymentMethod: `${paymentChannel} (Auto)`,
          trxId: trxId,
          status: 'Paid',
        }),
      });
    } catch (dbErr) {
      console.error('Database save error via webhook:', dbErr);
    }

    // ২. WhatsApp-এ কনফার্মেশন SMS পাঠানো
    if (whatsappNumber) {
      try {
        await fetch(`${host}/api/send-whatsapp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: customerName,
            phone: whatsappNumber,
            orderId: orderId,
            serviceName: serviceName,
          }),
        });
      } catch (waErr) {
        console.error('WhatsApp send error via webhook:', waErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Order created and SMS triggered successfully' }, { status: 200 });
  } catch (error) {
    console.error('UddoktaPay Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
