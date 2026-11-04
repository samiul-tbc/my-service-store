'use client';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/ZRRgvqSQ/20261030-234214.png';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const [orderInfo, setOrderInfo] = useState(null);
  const [smsSent, setSmsSent] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    // ডাবল রিকোয়েস্ট আটকানোর জন্য গার্ড
    if (hasTriggered.current) return;

    const saved = localStorage.getItem('hubcart_current_order');
    const paramOrderId = searchParams.get('orderId') || searchParams.get('invoice_id');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const finalOrderId = paramOrderId || parsed.orderId || parsed.id || `HC-${Date.now().toString().slice(-6)}`;
        const productName = parsed.serviceName || parsed.title || 'Premium Service';

        setOrderInfo({
          ...parsed,
          orderId: finalOrderId,
          serviceName: productName,
        });

        hasTriggered.current = true;

        // ঠিক ম্যানুয়ালের মতো হুবহু একই WhatsApp API কল
        fetch('/api/send-whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: parsed.customerName || 'Customer',
            phone: parsed.whatsappNumber,
            orderId: finalOrderId,
            serviceName: productName,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('Auto Payment WhatsApp Sent:', data);
            setSmsSent(true);
            // মেসেজ চলে যাওয়ার পর স্টোরেজ ক্লিন করা
            localStorage.removeItem('hubcart_current_order');
          })
          .catch((err) => {
            console.error('Auto Payment WhatsApp Error:', err);
          });
      } catch (e) {
        console.error('Order parsing error:', e);
      }
    }
  }, [searchParams]);

  return (
    <div style={{ maxWidth: '440px', margin: '40px auto', padding: '16px', textAlign: 'center' }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '24px',
        padding: '32px 20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      }}>
        {/* লোগো */}
        <img
          src={LOGO_HUB_CART}
          alt="Hub Cart"
          style={{ width: '48px', height: '48px', objectFit: 'contain', margin: '0 auto 16px' }}
        />

        {/* সাকসেস টিক আইকন */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.4)',
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
          অর্ডার সফল হয়েছে!
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 20px' }}>
          আপনার পেমেন্ট নিশ্চিত করা হয়েছে। খুব শীঘ্রই সার্ভিসটি ডেলিভারি করা হবে।
        </p>

        {orderInfo && (
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '14px',
            padding: '14px',
            textAlign: 'left',
            fontSize: '12px',
            color: '#cbd5e1',
            lineHeight: '1.8',
            marginBottom: '20px',
          }}>
            <div>🆔 <strong>অর্ডার আইডি:</strong> <span style={{ color: '#38bdf8' }}>{orderInfo.orderId}</span></div>
            <div>📦 <strong>সার্ভিস:</strong> {orderInfo.serviceName}</div>
            <div>💰 <strong>মূল্য:</strong> ৳{orderInfo.price}</div>
            <div>📱 <strong>WhatsApp:</strong> {orderInfo.whatsappNumber}</div>
            {smsSent && (
              <div style={{ color: '#4ade80', fontWeight: 'bold', marginTop: '4px' }}>
                ✓ WhatsApp-এ নিশ্চিতকরণ এসএমএস পাঠানো হয়েছে!
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {orderInfo?.orderId && (
            <Link
              href={`/invoice/${orderInfo.orderId}`}
              style={{
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '13px',
              }}
            >
              📄 ক্যাশ মেমো / ইনভয়েস দেখুন
            </Link>
          )}

          <Link
            href="/"
            style={{
              textDecoration: 'none',
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#94a3b8',
              padding: '12px',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '13px',
            }}
          >
            হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
