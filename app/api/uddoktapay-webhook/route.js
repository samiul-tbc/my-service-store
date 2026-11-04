import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

export async function POST(req) {
  try {
    const body = await req.json();

    // UddoktaPay theke asha response data
    const {
      status,
      transaction_id,
      payment_method,
      amount,
      metadata,
    } = body;

    // Payment shofol hole
    if (status === 'COMPLETED') {
      const orderId = metadata?.order_id;
      const customerPhone = metadata?.customer_phone;
      const customerName = metadata?.customer_name;

      if (orderId) {
        // ১. Supabase-e order status 'completed' ebong TrxID update kora
        await fetch(`${SUPABASE_URL}/rest/v1/orders?order_id=eq.${orderId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
          body: JSON.stringify({
            status: 'completed',
            trx_id: transaction_id || 'UddoktaPay Auto',
            payment_method: `Auto Pay (${payment_method || 'Online'})`,
          }),
        });

        // ২. Automatic WhatsApp Message trigger kora
        const host = process.env.NEXT_PUBLIC_SITE_URL || 'https://hubcart.vercel.app';
        try {
          await fetch(`${host}/api/send-whatsapp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customerName: customerName || 'Valued Customer',
              phone: customerPhone,
              orderId: orderId,
              serviceName: 'Premium Service',
              price: amount,
            }),
          });
        } catch (waErr) {
          console.error('WhatsApp send error in webhook:', waErr);
        }
      }

      return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Payment status not completed' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
