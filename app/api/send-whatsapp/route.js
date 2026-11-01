import { NextResponse } from 'next/server';

const PHONE_ID = process.env.WHATSAPP_PHONE_ID || '1375047549643574';
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

export async function POST(req) {
  try {
    const { customerName, phone, orderId, serviceName, price } = await req.json();

    if (!phone || !orderId) {
      return NextResponse.json({ error: 'ফোন নম্বর বা অর্ডার আইডি অনুপস্থিত' }, { status: 400 });
    }

    // বাংলাদেশের নম্বর ফরম্যাট নিশ্চিত করা (880...)
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = `88${cleanPhone}`;
    } else if (!cleanPhone.startsWith('88')) {
      cleanPhone = `880${cleanPhone}`;
    }

    // Meta WhatsApp Cloud API-তে রিকোয়েস্ট পাঠানো
    const metaRes = await fetch(`https://graph.facebook.com/v21.0/${PHONE_ID}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'template',
        template: {
          name: 'order_confirmation',
          language: {
            code: 'en_US',
          },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: customerName || 'Customer' },
                { type: 'text', text: String(orderId) },
              ],
            },
          ],
        },
      }),
    });

    const metaData = await metaRes.json();

    if (!metaRes.ok) {
      console.error('Meta API Error:', metaData);
      return NextResponse.json({ error: metaData.error?.message || 'মেসেজ পাঠানো যায়নি' }, { status: metaRes.status });
    }

    return NextResponse.json({ success: true, metaData });
  } catch (err) {
    console.error('Send WhatsApp Route Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
