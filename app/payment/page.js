'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png';
const BKASH_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/BKash-Logo.png/600px-BKash-Logo.png';
const NAGAD_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Nagad_Logo.svg/600px-Nagad_Logo.svg.png';

export default function PaymentGatewayPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('hubcart_current_order');
    if (saved) {
      try {
        setOrderData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  if (!orderData) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
        <h3>কোনো অর্ডার ডাটা পাওয়া যায়নি!</h3>
        <button
          onClick={() => router.push('/')}
          style={{ marginTop: '12px', padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          হোমপেজে ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '90vh', background: '#f8fafc', maxWidth: '480px', margin: '0 auto', paddingBottom: '30px' }}>
      
      {/* টপ হেডার বার */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
          🏠
        </button>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>
          ✕
        </button>
      </div>

      {/* গোল লোগো ও ব্র্যান্ড নাম */}
      <div style={{ textAlign: 'center', padding: '32px 0 20px' }}>
        <div style={{
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px'
        }}>
          <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 4px' }}>
          Hub Cart
        </h2>
        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>
          মোট প্রদেয়: ৳{orderData.price}
        </span>
      </div>

      {/* নীল ব্যানার: মোবাইল ব্যাংকিং */}
      <div style={{ background: '#0284c7', color: '#ffffff', padding: '12px 16px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', margin: '10px 16px 16px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(2, 132, 199, 0.2)' }}>
        মোবাইল ব্যাংকিং
      </div>

      {/* bKash ও Nagad সিলেকশন কার্ড (ক্লিক করলেই পরের পেজে যাবে) */}
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
        
        {/* bKash কার্ড */}
        <div
          onClick={() => router.push('/payment/bkash')}
          style={{
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '14px',
            padding: '20px 12px',
            textAlign: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s ease, border-color 0.15s ease',
            height: '75px',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e2136e'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <img
            src={BKASH_LOGO}
            alt="bKash"
            style={{ width: '100%', maxHeight: '42px', objectFit: 'contain' }}
          />
        </div>

        {/* Nagad কার্ড */}
        <div
          onClick={() => router.push('/payment/nagad')}
          style={{
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '14px',
            padding: '20px 12px',
            textAlign: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s ease, border-color 0.15s ease',
            height: '75px',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e53935'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <img
            src={NAGAD_LOGO}
            alt="Nagad"
            style={{ width: '100%', maxHeight: '42px', objectFit: 'contain' }}
          />
        </div>

      </div>

      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#94a3b8' }}>
        👉 পেমেন্ট সম্পন্ন করতে বিকাশ বা নগদ অপশনে ট্যাপ করুন
      </div>

    </div>
  );
}
