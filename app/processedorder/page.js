'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png';

export default function ProcessedOrderPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('instant'); // 'tbc' or 'instant'
  const [loading, setLoading] = useState(false);

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

  const handleProceed = async () => {
    if (!orderData) return;

    if (selectedMethod === 'tbc') {
      // TBC Pay: ম্যানুয়াল পেমেন্ট হিসাবে টেলিগ্রাম বটে চলে যাবে
      setLoading(true);
      try {
        const res = await fetch('/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceName: orderData.serviceName,
            price: orderData.price,
            customerName: orderData.customerName,
            whatsappNumber: orderData.whatsappNumber,
            telegramUsername: orderData.telegramUsername,
            paymentMethod: 'TBC Pay (Manual Later)',
            trxId: 'Manual Contact',
          }),
        });
        if (res.ok) {
          alert('✅ TBC Pay অর্ডার সাবমিট হয়েছে! খুব দ্রুত আমাদের টিম আপনার সাথে যোগাযোগ করে টাকা ও সার্ভিস কনফার্ম করবে।');
          localStorage.removeItem('hubcart_current_order');
          router.push('/');
        } else {
          alert('অর্ডার সাবমিট করতে সমস্যা হয়েছে।');
        }
      } catch (err) {
        alert('সার্ভার এরর');
      } finally {
        setLoading(false);
      }
    } else {
      // Instant Pay: সরাসরি পেমেন্ট গেটওয়ে পেজে নিয়ে যাবে
      router.push('/payment');
    }
  };

  if (!orderData) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
        <h3>কোনো অর্ডার পাওয়া যায়নি!</h3>
        <button onClick={() => router.push('/')} style={{ marginTop: '10px', padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px' }}>
          হোমপেজে ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '480px', margin: '20px auto', padding: '0 16px 80px' }}>
      
      {/* হেডার: Select one option (ছবি ৪-এর হুবহু স্টাইল) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ff7a00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '15px' }}>
          3
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#f8fafc', margin: 0 }}>
          Select one option
        </h2>
      </div>

      {/* দুটি পেমেন্ট কার্ড (TBC Pay ও Instant Pay) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
        
        {/* ১. TBC Pay (ম্যানুয়ালি টাকা নেওয়ার জন্য) */}
        <div
          onClick={() => setSelectedMethod('tbc')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: selectedMethod === 'tbc' ? '2px solid #ff7a00' : '1px solid #e2e8f0',
            overflow: 'hidden',
            cursor: 'pointer',
            position: 'relative',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {selectedMethod === 'tbc' && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '24px', background: '#ff7a00', clipPath: 'polygon(0 0, 100% 0, 0 100%)', display: 'flex', alignItems: 'flex-start', padding: '2px' }}>
              <span style={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>✓</span>
            </div>
          )}

          <div style={{ padding: '20px 10px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80px' }}>
            <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '42px', height: '42px', objectFit: 'contain', marginBottom: '6px' }} />
            <span style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a' }}>TBC Pay</span>
          </div>

          <div style={{ background: '#f1f5f9', padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>
            TBC Pay (Manual)
          </div>
        </div>

        {/* ২. Instant Pay (বিকাশ ও নগদ সম্বলিত) */}
        <div
          onClick={() => setSelectedMethod('instant')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: selectedMethod === 'instant' ? '2px solid #ff7a00' : '1px solid #e2e8f0',
            overflow: 'hidden',
            cursor: 'pointer',
            position: 'relative',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {selectedMethod === 'instant' && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '24px', background: '#ff7a00', clipPath: 'polygon(0 0, 100% 0, 0 100%)', display: 'flex', alignItems: 'flex-start', padding: '2px' }}>
              <span style={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>✓</span>
            </div>
          )}

          <div style={{ padding: '16px 6px', textAlign: 'center', minHeight: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
              <span style={{ padding: '3px 6px', background: '#e2136e', color: '#fff', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>bKash</span>
              <span style={{ padding: '3px 6px', background: '#e53935', color: '#fff', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>Nagad</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#0284c7' }}>Auto Payment</span>
          </div>

          <div style={{ background: '#f1f5f9', padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>
            Instant Pay
          </div>
        </div>

      </div>

      {/* ইনফো বক্স (ছবি ৪-এর নিচের অংশের মতো) */}
      <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '13px' }}>
          <span>ℹ️</span>
          <span>প্রোডাক্ট কিনতে আপনার প্রয়োজন: <strong style={{ color: '#ff7a00', fontSize: '15px' }}>৳ {orderData.price}</strong></span>
        </div>
      </div>

      {/* Buy Now বাটন (ছবি ৪-এর মতো অরেঞ্জ বাটন) */}
      <button
        onClick={handleProceed}
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px',
          background: '#ff7a00',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '900',
          fontSize: '16px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(255, 122, 0, 0.4)',
        }}
      >
        {loading ? 'প্রসেসিং হচ্ছে...' : selectedMethod === 'tbc' ? 'অর্ডার সাবমিট করুন' : 'Buy Now'}
      </button>

    </div>
  );
}
