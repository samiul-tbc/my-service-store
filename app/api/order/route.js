import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { serviceName, price, customerName, contact, paymentMethod, trxId } = body;

    // Contact ebong Service name baadhye hobe
    if (!serviceName || !contact || !paymentMethod) {
      return NextResponse.json(
        { error: 'Proyojonio sob tothyo puron korun.' },
        { status: 400 }
      );
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return NextResponse.json(
        { error: 'Server configuration error.' },
        { status: 500 }
      );
    }

    const message = `
🛒 <b>নতুন অর্ডার এসেছে!</b>
────────────────────
📦 <b>পণ্য/সার্ভিস:</b> ${serviceName}
💰 <b>মূল্য:</b> ৳${price}

👤 <b>কাস্টমার:</b> ${customerName || 'N/A'}
📱 <b>যোগাযোগ (TG/WA):</b> ${contact}

💳 <b>পদ্ধতি:</b> ${paymentMethod}
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
      throw new Error('Telegram request failed');
    }

    return NextResponse.json({ success: true, message: 'Order submitted!' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Order processing fail hoyeche.' },
      { status: 500 }
    );
  }
}
