'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LOGO_BKASH = 'https://1000logos.net/wp-content/uploads/2021/02/Bkash-logo.png';
const LOGO_NAGAD = 'https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png';
const LOGO_TRC20 = 'https://cryptologos.cc/logos/tether-usdt-logo.png';

const DOLLAR_RATE = 120; // ১ ডলার = ১২০ টাকা

export default function ProcessedOrderPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('instant');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hubcart_current_order');
    if (saved) {
      try {
        setOrderData(JSON.parse(saved));
      } catch (e) {
        console.error('Order data parse error:', e);
      }
    }
  }, []);

  const calculateUSDT = (bdtPrice) => {
    const bdt = Number(bdtPrice) || 0;
    return (bdt / DOLLAR_RATE).toFixed(2);
  };

  const handleProceed = async () => {
    if (!orderData) return;

    setLoading(true);
    const generatedOrderId = orderData.id || `HC-${Date.now().toString().slice(-6)}`;
    const priceInBDT = Number(orderData.price) || 0;

    // ১. লোকাল Instant Pay (bKash/Nagad/Rocket Auto via UddoktaPay)
    if (selectedMethod === 'instant') {
      try {
        const res = await fetch('/api/create-bdt-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: generatedOrderId,
            amount: priceInBDT,
            customerName: orderData.customerName || 'Valued Customer',
            phone: orderData.whatsappNumber || '',
          }),
        });

        // 404 বা HTML এরর হ্যান্ডলিং
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          alert('API Route পাওয়া যায়নি (404)! দয়া করে GitHub-এ "app/api/create-bdt-payment/route.js" ফাইলটি সঠিক পাথে আছে কিনা চেক করুন।');
          return;
        }

        const data = await res.json();

        if (res.ok && data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          alert(data.error || 'পেমেন্ট গেটওয়েতে সংযোগ করা যায়নি');
        }
      } catch (err) {
        alert('সার্ভার এরর: পেমেন্ট শুরু করা যায়নি।');
      } finally {
        setLoading(false);
      }
      return;
    }

    // ২. ক্রিপ্টো পেমেন্ট (USDT TRC-20 via NOWPayments)
    if (selectedMethod === 'crypto') {
      try {
        const priceInUSD = orderData.priceUSD
          ? Number(orderData.priceUSD)
          : Number(calculateUSDT(orderData.price));

        const res = await fetch('/api/create-crypto-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: generatedOrderId,
            amountUSD: priceInUSD,
            customerName: orderData.customerName,
            phone: orderData.whatsappNumber,
          }),
        });

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          alert('Crypto API Route পাওয়া যায়নি!');
          return;
        }

        const data = await res.json();

        if (res.ok && data.invoiceUrl) {
          window.location.href = data.invoiceUrl;
        } else {
          alert(data.error || 'ক্রিপ্টো ইনভয়েস তৈরিতে সমস্যা হয়েছে।');
        }
      } catch (err) {
        alert('সার্ভার এরর: ক্রিপ্টো পেমেন্ট শুরু করা যায়নি।');
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  if (!orderData) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
        <h3>কোনো অর্ডার পাওয়া যায়নি!</h3>
        <button
          onClick={() => router.push('/')}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            background: '#ff7a00',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          হোমপেজে ফিরে যান
        </button>
      </div>
    );
  }

  const usdtAmount = calculateUSDT(orderData.price);

  return (
    <div style={{ maxWidth: '480px', margin: '20px auto', padding: '0 16px 80px' }}>
      
      {/* Header Step */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#ff7a00',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '15px',
          }}
        >
          3
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#f8fafc', margin: 0 }}>
          Select payment option
        </h2>
      </div>

      {/* Payment Options Grid (২টি অটোমেটেড অপশন) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
        
        {/* Instant Auto Pay (bKash, Nagad) */}
        <div
          onClick={() => setSelectedMethod('instant')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: selectedMethod === 'instant' ? '2px solid #ff7a00' : '1px solid #e2e8f0',
            overflow: 'hidden',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          {selectedMethod === 'instant' && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '22px',
                height: '22px',
                background: '#ff7a00',
                clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                display: 'flex',
                alignItems: 'flex-start',
                padding: '2px',
              }}
            >
              <span style={{ color: '#fff', fontSize: '9px', fontWeight: 'bold' }}>✓</span>
            </div>
          )}

          <div style={{ padding: '16px 6px', textAlign: 'center', minHeight: '85px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
              <img src={LOGO_BKASH} alt="bKash" style={{ height: '18px', objectFit: 'contain' }} />
              <img src={LOGO_NAGAD} alt="Nagad" style={{ height: '18px', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0284c7' }}>Auto Pay</span>
          </div>

          <div style={{ background: '#f1f5f9', padding: '6px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#475569' }}>
            bKash / Nagad
          </div>
        </div>

        {/* Crypto Pay (USDT TRC20) */}
        <div
          onClick={() => setSelectedMethod('crypto')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: selectedMethod === 'crypto' ? '2px solid #ff7a00' : '1px solid #e2e8f0',
            overflow: 'hidden',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          {selectedMethod === 'crypto' && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '22px',
                height: '22px',
                background: '#ff7a00',
                clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                display: 'flex',
                alignItems: 'flex-start',
                padding: '2px',
              }}
            >
              <span style={{ color: '#fff', fontSize: '9px', fontWeight: 'bold' }}>✓</span>
            </div>
          )}

          <div style={{ padding: '16px 6px', textAlign: 'center', minHeight: '85px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src={LOGO_TRC20} alt="USDT TRC20" style={{ height: '26px', width: '26px', objectFit: 'contain', marginBottom: '6px' }} />
            <span style={{ fontSize: '12px', fontWeight: '900', color: '#16a34a' }}>USDT (TRC20)</span>
          </div>

          <div style={{ background: '#f1f5f9', padding: '6px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#475569' }}>
            Crypto
          </div>
        </div>

      </div>

      {/* মূল্য বিবরণ */}
      <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '13px' }}>
          <span>ℹ️ প্রোডাক্ট মূল্য:</span>
          <span style={{ fontWeight: 'bold', color: '#f8fafc' }}>
            ৳ {orderData.price} 
            {selectedMethod === 'crypto' && (
              <span style={{ color: '#10b981', marginLeft: '6px' }}>
                (≈ ${usdtAmount} USDT)
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Buy Button */}
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
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 15px rgba(255, 122, 0, 0.4)',
        }}
      >
        {loading 
          ? 'প্রসেসিং হচ্ছে...' 
          : selectedMethod === 'crypto' 
            ? `Pay $${usdtAmount} USDT` 
            : `Pay ৳${orderData.price}`}
      </button>

    </div>
  );
}
