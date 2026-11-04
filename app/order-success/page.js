'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [smsStatus, setSmsStatus] = useState('sending'); // 'sending', 'sent', 'failed'
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (hasTriggered.current) return;

    // ১. URL প্যারামিটার ও LocalStorage থেকে অর্ডারের ডেটা সংগ্রহ করা
    const urlOrderId = searchParams.get('orderId') || searchParams.get('invoice_id');
    const urlPhone = searchParams.get('phone');
    const urlName = searchParams.get('name');

    let customerPhone = urlPhone || '';
    let customerName = urlName || 'Customer';
    let finalOrderId = urlOrderId || '';

    const saved = localStorage.getItem('hubcart_current_order');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!finalOrderId) finalOrderId = parsed.id || parsed.orderId;
        if (!customerPhone) customerPhone = parsed.whatsappNumber || '';
        if (!customerName || customerName === 'Customer') customerName = parsed.customerName || 'Customer';
      } catch (e) {
        console.error('Order parse error:', e);
      }
    }

    if (!finalOrderId) {
      finalOrderId = `HC-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    setOrderId(finalOrderId);
    hasTriggered.current = true;

    // ২. ফোন নম্বর থাকলে সাথে সাথে WhatsApp SMS ট্রিগার করা
    if (customerPhone) {
      fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName,
          phone: customerPhone,
          orderId: finalOrderId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSmsStatus('sent');
          } else {
            setSmsStatus('failed');
          }
          localStorage.removeItem('hubcart_current_order');
        })
        .catch((err) => {
          console.error('WhatsApp send error:', err);
          setSmsStatus('failed');
        });
    } else {
      setSmsStatus('failed');
    }
  }, [searchParams]);

  return (
    <div style={{
      maxWidth: '440px',
      margin: '24px auto',
      padding: '0 16px 80px',
    }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '36px 20px 28px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
      }}>

        {/* সাকসেস টিক আইকন */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          border: '2px solid #10b981',
          background: 'rgba(16, 185, 129, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        {/* টাইটেল ও সাবটাইটেল */}
        <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#f8fafc', margin: '0 0 10px' }}>
          পেমেন্ট সফল হয়েছে!
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 24px' }}>
          ধন্যবাদ! আপনার অর্ডারটি নিশ্চিত করা হয়েছে এবং স্বয়ংক্রিয় প্রসেসিং শুরু হয়েছে।
        </p>

        {/* অর্ডার ডিটেইলস কার্ড */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '16px',
          padding: '16px 18px',
          marginBottom: '16px',
          fontSize: '13px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#94a3b8' }}>Order ID:</span>
            <span style={{ fontWeight: '900', color: '#38bdf8', fontSize: '15px' }}>
              {orderId || 'লোড হচ্ছে...'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#94a3b8' }}>পেমেন্ট স্ট্যাটাস:</span>
            <span style={{ color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
              ● Paid (পরিশোধিত)
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>ডেলিভারি মেথড:</span>
            <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>ইনস্ট্যান্ট অটো ডেলিভারি</span>
          </div>
        </div>

        {/* WhatsApp নোটিফিকেশন অ্যালার্ট বক্স */}
        <div style={{
          border: '1px dashed #0284c7',
          background: 'rgba(2, 132, 199, 0.08)',
          borderRadius: '14px',
          padding: '12px 14px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textAlign: 'left',
          fontSize: '12px',
          color: '#bae6fd',
          lineHeight: '1.5',
        }}>
          <span style={{ fontSize: '16px' }}>💬</span>
          <span>
            {smsStatus === 'sent' && 'আপনার WhatsApp নম্বরে অর্ডারের কনফার্মেশন মেসেজ সফলভাবে পাঠানো হয়েছে।'}
            {smsStatus === 'sending' && 'আপনার WhatsApp নম্বরে অর্ডারের বিবরণ ও ডেলিভারি মেসেজ পাঠিয়ে দেওয়া হচ্ছে...'}
            {smsStatus === 'failed' && 'অর্ডারটি কনফার্ম হয়েছে। বিস্তারিত দেখতে অর্ডার হিস্ট্রি চেক করুন।'}
          </span>
        </div>

        {/* অ্যাকশন বাটনসমূহ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => router.push('/orders')}
            style={{
              width: '100%',
              padding: '13px',
              background: '#059669',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '900',
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)',
            }}
          >
            অর্ডার হিস্ট্রি দেখুন
          </button>

          <Link
            href="/"
            style={{
              display: 'block',
              padding: '13px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              color: '#94a3b8',
              fontWeight: 'bold',
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>

      </div>
    </div>
  );
}
