'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// আপনার নতুন লোগোর ডিরেক্ট লিংকটি এখানে বসান
const LOGO_HUB_CART = 'https://i.postimg.cc/43tnkXMF/file-00000000b9b48211aeecd64684782d91.png'; // আপনার Postimg Direct Link দিন
const LOGO_BKASH = 'https://1000logos.net/wp-content/uploads/2021/02/Bkash-logo.png';
const LOGO_NAGAD = 'https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png';

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

  // বিকাশ বা নগদ কার্ডে চাপ দিলেই সরাসরি সেই পেজে চলে যাবে
  const handleSelectMethod = (method) => {
    router.push(`/payment/${method}`);
  };

  if (!orderData) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
        <h3>কোনো অর্ডার পাওয়া যায়নি!</h3>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '90vh', background: '#f8fafc', maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', paddingBottom: '30px' }}>
      
      {/* টপ হেডার বার */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>
          🏠
        </button>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}>
          ✕
        </button>
      </div>

      {/* গোল লোগো ও Hub Cart নাম */}
      <div style={{ textAlign: 'center', padding: '26px 0 16px' }}>
        <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', overflow: 'hidden' }}>
          <img
            src={LOGO_HUB_CART}
            alt="Hub Cart"
            onError={(e) => { e.currentTarget.src = 'https://i.postimg.cc/4Y3TK6bN/5707.png'; }}
            style={{ width: '58px', height: '58px', objectFit: 'contain' }}
          />
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 4px' }}>
          Hub Cart
        </h2>
        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
          পরিশোধযোগ্য মূল্য: <strong style={{ color: '#0284c7' }}>৳{orderData.price}.00</strong>
        </span>
      </div>

      {/* নীল ব্যানার: মোবাইল ব্যাংকিং */}
      <div style={{ background: '#0284c7', color: '#ffffff', padding: '10px 16px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', margin: '10px 16px 16px', borderRadius: '8px' }}>
        মোবাইল ব্যাংকিং
      </div>

      {/* bKash ও Nagad কার্ড (সরাসরি ওয়ান-ট্যাপ রিডাইরেক্ট) */}
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
        
        {/* bKash কার্ড */}
        <div
          onClick={() => handleSelectMethod('bkash')}
          style={{
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '12px',
            padding: '14px 10px',
            textAlign: 'center',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '62px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            transition: 'transform 0.15s ease',
          }}
        >
          <img src={LOGO_BKASH} alt="bKash" style={{ maxHeight: '38px', maxWidth: '100%', objectFit: 'contain' }} />
        </div>

        {/* Nagad কার্ড */}
        <div
          onClick={() => handleSelectMethod('nagad')}
          style={{
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '12px',
            padding: '14px 10px',
            textAlign: 'center',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '62px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            transition: 'transform 0.15s ease',
          }}
        >
          <img src={LOGO_NAGAD} alt="Nagad" style={{ maxHeight: '38px', maxWidth: '100%', objectFit: 'contain' }} />
        </div>

      </div>

    </div>
  );
}
