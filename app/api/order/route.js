import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { serviceName, price, customerName, contact, deviceModel, paymentMethod, trxId } = body;

    if (!serviceName || !customerName || !contact || !trxId) {
      return NextResponse.json(
        { error: 'সবগুলো প্রয়োজনীয় ঘর পূরণ করুন।' },
        { status: 400 }
      );
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return NextResponse.json(
        { error: 'সার্ভার কনফিগারেশন ত্রুটি।' },
        { status: 500 }
      );
    }

    const message = `
⚡ <b>নতুন অর্ডার এসেছে!</b>
────────────────────
🛠️ <b>সার্ভিস:</b> ${serviceName}
💰 <b>মূল্য:</b> ৳${price}

👤 <b>কাস্টমার:</b> ${customerName}
📱 <b>যোগাযোগ (TG/WA):</b> ${contact}
💻 <b>ডিভাইস / রিকোয়ারমেন্ট:</b> ${deviceModel || 'N/A'}

💳 <b>পেমেন্ট মাধ্যম:</b> ${paymentMethod}
🧾 <b>TrxID:</b> <code>${trxId}</code>
────────────────────
⏰ <i>${new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })}</i>
`;

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    if (!telegramRes.ok) {
      throw new Error('Telegram bot API request failed');
    }

    return NextResponse.json({ success: true, message: 'অর্ডার সফল হয়েছে!' });
  } catch (error) {
    return NextResponse.json(
      { error: 'অর্ডার প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' },
      { status: 500 }
    );
  }
}
