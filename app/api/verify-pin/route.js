import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { pin } = await req.json();
    const correctPin = process.env.ADMIN_PIN;

    // সার্ভারে গোপন পিন যাচাই
    if (correctPin && pin.trim() === correctPin.trim()) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'ভুল পিন কোড' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'সার্ভার সমস্যা' }, { status: 500 });
  }
}
