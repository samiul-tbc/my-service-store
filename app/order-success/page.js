'use client';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const hasTriggered = useRef(false);

  const orderId = searchParams.get('orderId') || searchParams.get('invoice_id') || 'HC-Order';
  const phone = searchParams.get('phone');
  const customerName = searchParams.get('name') || 'Customer';

  useEffect(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    // Phone number thakle sathe sathe WhatsApp SMS pathano
    if (phone && orderId) {
      fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName,
          phone: phone,
          orderId: orderId,
        }),
      })
      .then((res) => res.json())
      .then((data) => console.log('WhatsApp sent successfully:', data))
      .catch((err) => console.error('WhatsApp send error:', err));
    }
  }, [orderId, phone, customerName]);

  return (
    <div style={{ maxWidth: '440px', margin: '40px auto', padding: '16px', textAlign: 'center' }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '24px',
        padding: '32px 20px',
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.15)',
          color: '#4ade80',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          margin: '0 auto 16px',
        }}>
          ✓
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#f8fafc', margin: '0 0 8px' }}>
          পেমেন্ট সফল হয়েছে!
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 20px' }}>
          অর্ডারটি সফলভাবে ডাটাবেজে যুক্ত হয়েছে এবং কনফার্মেশন মেসেজ পাঠানো হচ্ছে।
        </p>

        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          borderRadius: '14px',
          padding: '14px',
          textAlign: 'left',
          fontSize: '13px',
          color: '#cbd5e1',
          lineHeight: '1.8',
          marginBottom: '20px',
        }}>
          <div>🆔 <strong>Order ID:</strong> <span style={{ color: '#38bdf8' }}>{orderId}</span></div>
          <div>📱 <strong>WhatsApp:</strong> {phone || 'Not available'}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            href="/orders"
            style={{
              textDecoration: 'none',
              background: '#059669',
              color: '#ffffff',
              padding: '12px',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '13px',
            }}
          >
            অর্ডার হিস্ট্রি দেখুন
          </Link>

          <Link
            href="/"
            style={{
              textDecoration: 'none',
              background: 'rgba(30, 41, 59, 0.6)',
              color: '#94a3b8',
              padding: '12px',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '13px',
            }}
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
