'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'HC-' + Math.floor(100000 + Math.random() * 900000);

  return (
    <div
      style={{
        maxWidth: '440px',
        width: '100%',
        backgroundColor: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '20px',
        padding: '30px 20px',
        textAlign: 'center',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Success Green Badge */}
      <div
        style={{
          width: '74px',
          height: '74px',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          border: '2px solid #10b981',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px auto',
        }}
      >
        <svg
          width="38"
          height="38"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* Heading */}
      <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#f8fafc', margin: '0 0 6px 0' }}>
        পেমেন্ট সফল হয়েছে!
      </h2>
      <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 22px 0', lineHeight: '1.5' }}>
        ধন্যবাদ! আপনার অর্ডারটি নিশ্চিত করা হয়েছে এবং স্বয়ংক্রিয় প্রসেসিং শুরু হয়েছে।
      </p>

      {/* Order Info Card */}
      <div
        style={{
          backgroundColor: '#0b1120',
          border: '1px solid #1e293b',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '18px',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#94a3b8' }}>Order ID:</span>
          <span style={{ color: '#38bdf8', fontWeight: '700' }}>{orderId}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#94a3b8' }}>পেমেন্ট স্ট্যাটাস:</span>
          <span style={{ color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            Paid (পরিশোধিত)
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#94a3b8' }}>ডেলিভারি মেথড:</span>
          <span style={{ color: '#e2e8f0', fontWeight: '600' }}>ইনস্ট্যান্ট অটো ডেলিভারি</span>
        </div>
      </div>

      {/* Notification Note */}
      <div
        style={{
          backgroundColor: 'rgba(56, 189, 248, 0.08)',
          border: '1px dashed #0284c7',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '24px',
          fontSize: '13px',
          color: '#7dd3fc',
          lineHeight: '1.4',
        }}
      >
        💬 আপনার WhatsApp নম্বরে অর্ডারের বিবরণ ও ডেলিভারি মেসেজ পাঠিয়ে দেওয়া হচ্ছে।
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link
          href="/orders"
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#059669',
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '15px',
            borderRadius: '12px',
            textDecoration: 'none',
            display: 'block',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
          }}
        >
          অর্ডার হিস্ট্রি দেখুন
        </Link>

        <Link
          href="/"
          style={{
            width: '100%',
            padding: '13px',
            backgroundColor: 'transparent',
            border: '1px solid #334155',
            color: '#94a3b8',
            fontWeight: '600',
            fontSize: '14px',
            borderRadius: '12px',
            textDecoration: 'none',
            display: 'block',
          }}
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div
      style={{
        minHeight: '85vh',
        backgroundColor: '#090d16',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px 85px 16px',
      }}
    >
      <Suspense fallback={<div style={{ color: '#ffffff', fontSize: '14px' }}>লোড হচ্ছে...</div>}>
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}
