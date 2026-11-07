'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

function OrderSuccessContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [smsStatus, setSmsStatus] = useState('sending');
  const hasTriggered = useRef(false);

  // কার্ট চেকআউট সফল হলে কার্ট খালি করা
  useEffect(() => {
    try {
      if (localStorage.getItem('hubcart_pending_cart_clear') === '1') {
        localStorage.removeItem('hubcart_cart');
        localStorage.removeItem('hubcart_pending_cart_clear');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (hasTriggered.current) return;

    let finalOrderId = searchParams.get('orderId');
    let customerPhone = searchParams.get('phone') || '';
    let customerName = searchParams.get('name') || 'Customer';

    // LocalStorage থেকে ডেটা রিকভার করা
    const saved = localStorage.getItem('hubcart_current_order');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!finalOrderId) finalOrderId = parsed.orderId || parsed.id;
        if (!customerPhone) customerPhone = parsed.whatsappNumber || '';
        if (customerName === 'Customer') customerName = parsed.customerName || 'Customer';
      } catch (e) {
        console.error(e);
      }
    }

    if (!finalOrderId) {
      finalOrderId = searchParams.get('invoice_id') || `HC-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    setOrderId(finalOrderId);
    hasTriggered.current = true;

    // WhatsApp Message Trigger
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
        .catch(() => setSmsStatus('failed'));
    } else {
      setSmsStatus('failed');
    }
  }, [searchParams]);

  return (
    <div style={{ maxWidth: '440px', margin: '24px auto', padding: '0 16px 80px' }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '36px 20px 28px',
        textAlign: 'center',
      }}>
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
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#f8fafc', margin: '0 0 10px' }}>
          {t.success.title}
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 24px' }}>
          {t.success.sub}
        </p>

        <div style={{
          background: 'rgba(30, 41, 59, 0.65)',
          borderRadius: '16px',
          padding: '16px 18px',
          marginBottom: '16px',
          fontSize: '13px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#94a3b8' }}>{t.success.orderId}</span>
            <span style={{ fontWeight: '900', color: '#a6f36a', fontSize: '15px' }}>{orderId || t.success.loading}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#94a3b8' }}>{t.success.paymentStatus}</span>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>{t.success.paid}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>{t.success.deliveryMethod}</span>
            <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>{t.success.instant}</span>
          </div>
        </div>

        <div style={{
          border: '1px dashed #a6f36a',
          background: 'rgba(2, 132, 199, 0.08)',
          borderRadius: '14px',
          padding: '12px 14px',
          marginBottom: '24px',
          fontSize: '12px',
          color: '#bae6fd',
          textAlign: 'left',
        }}>
          💬 {smsStatus === 'sent' && t.success.smsSent}
          {smsStatus === 'sending' && t.success.smsSending}
          {smsStatus === 'failed' && t.success.smsFallback}
        </div>

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
              cursor: 'pointer',
            }}
          >
            {t.success.viewHistory}
          </button>
          <Link
            href="/"
            style={{
              padding: '13px',
              background: 'rgba(30, 41, 59, 0.8)',
              borderRadius: '12px',
              color: '#94a3b8',
              textDecoration: 'none',
            }}
          >
            {t.success.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#94a3b8' }}>
        {t.success.pageLoading}
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
