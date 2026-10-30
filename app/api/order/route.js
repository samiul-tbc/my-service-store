import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { serviceName, price, customerName, whatsappNumber, telegramUsername, paymentMethod, trxId } = body;

    if (!serviceName || !customerName || !whatsappNumber || !paymentMethod) {
      return NextResponse.json(
        { error: 'প্রয়োজনীয় সকল তথ্য পূরণ করুন।' },
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
🛒 <b>Hub Cart - নতুন অর্ডার এসেছে!</b>
────────────────────
📦 <b>সার্ভিস / পণ্য:</b> ${serviceName}
💰 <b>মূল্য:</b> ৳${price}

👤 <b>কাস্টমার:</b> ${customerName}
📞 <b>WhatsApp:</b> ${whatsappNumber}
✈️ <b>Telegram:</b> ${telegramUsername || 'দেওয়া হয়নি'}

💳 <b>পেমেন্ট মেথড:</b> ${paymentMethod}
🧾 <b>TrxID:</b> <code>${trxId || 'N/A'}</code>
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
      throw new Error('Telegram bot request failed');
    }

    return NextResponse.json({ success: true, message: 'Order submitted!' });
  } catch (error) {
    return NextResponse.json(
      { error: 'অর্ডার প্রসেসিং ব্যর্থ হয়েছে।' },
      { status: 500 }
    );
  }
}
