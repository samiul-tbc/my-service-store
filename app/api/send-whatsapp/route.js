import { NextResponse } from 'next/server';

const PHONE_ID = process.env.WHATSAPP_PHONE_ID || '1322554240951963';
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// আন্তর্জাতিক ফোন নম্বর ফরম্যাট হেল্পার
function formatPhoneNumber(phone) {
  if (!phone) return '';

  // সব ধরনের চিহ্ন (+, -, স্পেস) সরিয়ে শুধু সংখ্যা রাখা
  let digits = String(phone).replace(/[^0-9]/g, '');

  // যদি কেউ ভুলে লোকাল বিডি নম্বর (যেমন: 018XXXXXXXX - ১১ ডিজিট) দেয়, তবে 88 যুক্ত করা
  if (digits.startsWith('0') && digits.length === 11) {
    digits = `88${digits}`;
  } 
  // যদি কেউ কান্ট্রি কোড ও শূন্য ছাড়া শুধু 1XXXXXXXXX (১০ ডিজিট) দেয়
  else if (/^1[3-9]\d{8}$/.test(digits)) {
    digits = `880${digits}`;
  }

  // আন্তর্জাতিক নম্বর (যেমন: নেপালের 977..., ভারতের 91..., ইউএসএর 1...) অপরিবর্তিত থাকবে
  return digits;
}

export async function POST(req) {
  try {
    const { customerName, phone, orderId } = await req.json();

    if (!phone || !orderId) {
      return NextResponse.json({ error: 'ফোন নম্বর বা অর্ডার আইডি অনুপস্থিত' }, { status: 400 });
    }

    // আন্তর্জাতিক ফরম্যাটিং নিশ্চিত করা
    const cleanPhone = formatPhoneNumber(phone);

    // আজকের তারিখ (যেমন: Nov 4, 2026)
    const orderDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    // ইনভয়েস লিংক
    const invoiceUrl = `https://hubcart.vercel.app/invoice/${orderId}`;

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
          name: 'hubcart_order_confirmation',
          language: {
            code: 'en',
          },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: customerName || 'Customer' },
                { type: 'text', text: String(orderId) },
                { type: 'text', text: orderDate },
                { type: 'text', text: invoiceUrl },
              ],
            },
          ],
        },
      }),
    });

    const metaData = await metaRes.json();

    if (!metaRes.ok) {
      console.error('Meta API Error:', metaData);
      return NextResponse.json(
        { error: metaData.error?.message || 'মেসেজ পাঠানো যায়নি' },
        { status: metaRes.status }
      );
    }

    return NextResponse.json({ success: true, metaData, sentTo: cleanPhone });
  } catch (err) {
    console.error('Send WhatsApp Route Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
