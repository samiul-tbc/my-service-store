'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png';

export default function PaymentGatewayPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(''); // 'bkash' or 'nagad'

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

  const handlePayClick = () => {
    if (!selectedMethod) {
      alert('দয়া করে বিকাশ অথবা নগদ সিলেক্ট করুন');
      return;
    }
    router.push(`/payment/${selectedMethod}`);
  };

  if (!orderData) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
        <h3>কোনো অর্ডার ডাটা পাওয়া যায়নি!</h3>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '90vh', background: '#f8fafc', maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '20px' }}>
      
      <div>
        {/* টপ হেডার বার */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>
            🏠
          </button>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}>
            ✕
          </button>
        </div>

        {/* গোল লোগো ও Hub Cart নাম (ছবি ৫-এর হুবহু) */}
        <div style={{ textAlign: 'center', padding: '30px 0 20px' }}>
          <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
            Hub Cart
          </h2>
        </div>

        {/* নীল ব্যানার: মোবাইল ব্যাংকিং */}
        <div style={{ background: '#0284c7', color: '#ffffff', padding: '10px 16px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', margin: '10px 16px 16px', borderRadius: '8px' }}>
          মোবাইল ব্যাংকিং
        </div>

        {/* bKash ও Nagad সিলেকশন কার্ড */}
        <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
          
          {/* bKash কার্ড */}
          <div
            onClick={() => setSelectedMethod('bkash')}
            style={{
              background: '#ffffff',
              border: selectedMethod === 'bkash' ? '2px solid #e2136e' : '1px solid #cbd5e1',
              borderRadius: '12px',
              padding: '16px 10px',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: '900', color: '#e2136e' }}>bKash</span>
          </div>

          {/* Nagad কার্ড */}
          <div
            onClick={() => setSelectedMethod('nagad')}
            style={{
              background: '#ffffff',
              border: selectedMethod === 'nagad' ? '2px solid #e53935' : '1px solid #cbd5e1',
              borderRadius: '12px',
              padding: '16px 10px',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: '900', color: '#e53935' }}>নগদ</span>
          </div>

        </div>
      </div>

      {/* নিচের ফিক্সড "পে করুন [টাকা]" বাটন */}
      <div style={{ padding: '16px' }}>
        <button
          onClick={handlePayClick}
          style={{
            width: '100%',
            padding: '14px',
            background: '#0284c7',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
          }}
        >
          পে করুন {orderData.price}.00
        </button>
      </div>

    </div>
  );
}
