'use client';

import { useState, useEffect } from 'react';

export default function ProcessedOrderPage() {
  const [selectedMethod, setSelectedMethod] = useState('instant');
  const [loading, setLoading] = useState(false);

  const [orderData, setOrderData] = useState({
    id: '',
    price: 0,
    customerName: '',
    whatsappNumber: '',
  });

  // Product page theke asha real data load kora (URL ba LocalStorage)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlPrice = params.get('price') || params.get('amount');
      const urlId = params.get('id') || params.get('orderId');
      const urlName = params.get('name');
      const urlPhone = params.get('phone');

      const saved =
        localStorage.getItem('currentOrder') ||
        localStorage.getItem('pendingOrder') ||
        localStorage.getItem('orderData') ||
        localStorage.getItem('order');

      const parsed = saved ? JSON.parse(saved) : {};

      const finalPrice = Number(urlPrice || parsed.price || parsed.amount || 5);
      const finalId = urlId || parsed.id || parsed.orderId || `HC-${Date.now().toString().slice(-6)}`;
      const finalName = urlName || parsed.customerName || parsed.name || 'Samiul Islam';
      const finalPhone = urlPhone || parsed.whatsappNumber || parsed.phone || '01893432478';

      setOrderData({
        id: finalId,
        price: finalPrice,
        customerName: finalName,
        whatsappNumber: finalPhone,
      });
    } catch (e) {
      setOrderData({
        id: `HC-${Date.now().toString().slice(-6)}`,
        price: 5,
        customerName: 'Samiul Islam',
        whatsappNumber: '01893432478',
      });
    }
  }, []);

  const bdtAmount = Number(orderData.price) || 0;
  const cryptoAmountUSD = (bdtAmount / 120).toFixed(2);

  const handleProceed = async () => {
    setLoading(true);

    try {
      // ১. Instant Auto Pay (bKash/Nagad/Rocket)
      if (selectedMethod === 'instant') {
        const res = await fetch('/api/create-bdt-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.id,
            amount: bdtAmount,
            customerName: orderData.customerName,
            phone: orderData.whatsappNumber,
          }),
        });

        // 404 / 500 error jeno crash na kore
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          alert('API Route khuje pawa jacche na! GitHub-e "app/api/create-bdt-payment/route.js" file-ti ache kina check korun.');
          return;
        }

        const data = await res.json();

        if (res.ok && data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          alert(data.error || 'UddoktaPay theke kono URL pawa jayni');
        }
        return;
      }

      // ২. Crypto Pay (USDT TRC20)
      if (selectedMethod === 'crypto') {
        const res = await fetch('/api/create-crypto-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.id,
            amountUSD: cryptoAmountUSD,
            customerName: orderData.customerName,
            phone: orderData.whatsappNumber,
          }),
        });

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          alert('Crypto API Route khuje pawa jacche na!');
          return;
        }

        const data = await res.json();

        if (res.ok && data.invoiceUrl) {
          window.location.href = data.invoiceUrl;
        } else {
          alert(data.error || 'Crypto invoice toiri kora jayni');
        }
        return;
      }
    } catch (err) {
      alert('Network ba server problem: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', backgroundColor: '#090d16', color: '#ffffff', padding: '16px 16px 90px 16px' }}>
      <div style={{ maxWidth: '440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px 0' }}>
            Payment Method Select Korun
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            Order-ti shompurno korte payment maddhom beche nin
          </p>
        </div>

        {/* Order Summary */}
        <div style={{
          backgroundColor: '#111827',
          border: '1px solid #1f2937',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#9ca3af' }}>
            <span>Order ID:</span>
            <span style={{ fontWeight: '600', color: '#e5e7eb' }}>{orderData.id || 'HC-TEST'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1f2937', paddingTop: '10px' }}>
            <span style={{ fontSize: '14px', color: '#9ca3af' }}>Payable Amount:</span>
            <span style={{ fontSize: '22px', fontWeight: '800', color: '#10b981' }}>৳{bdtAmount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
            <span>Crypto Equivalent:</span>
            <span style={{ color: '#38bdf8' }}>${cryptoAmountUSD} USDT (Rate: ৳120 = $1)</span>
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Instant Pay */}
          <div
            onClick={() => setSelectedMethod('instant')}
            style={{
              padding: '16px',
              borderRadius: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: selectedMethod === 'instant' ? '#0f291e' : '#111827',
              border: selectedMethod === 'instant' ? '2px solid #10b981' : '1px solid #1f2937',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: selectedMethod === 'instant' ? '6px solid #10b981' : '2px solid #4b5563',
                backgroundColor: '#ffffff'
              }} />
              <div>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: '#ffffff' }}>Instant Pay (Auto)</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>bKash, Nagad, Rocket</p>
              </div>
            </div>
            <span style={{ fontWeight: '700', fontSize: '16px', color: '#10b981' }}>৳{bdtAmount}</span>
          </div>

          {/* Crypto Pay */}
          <div
            onClick={() => setSelectedMethod('crypto')}
            style={{
              padding: '16px',
              borderRadius: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: selectedMethod === 'crypto' ? '#0f291e' : '#111827',
              border: selectedMethod === 'crypto' ? '2px solid #10b981' : '1px solid #1f2937',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: selectedMethod === 'crypto' ? '6px solid #10b981' : '2px solid #4b5563',
                backgroundColor: '#ffffff'
              }} />
              <div>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: '#ffffff' }}>Crypto Pay (Instant)</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>USDT (TRC-20)</p>
              </div>
            </div>
            <span style={{ fontWeight: '700', fontSize: '15px', color: '#38bdf8' }}>${cryptoAmountUSD} USDT</span>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleProceed}
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '8px',
            padding: '16px',
            borderRadius: '14px',
            backgroundColor: loading ? '#047857' : '#059669',
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '16px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)',
          }}
        >
          {loading ? 'Processing...' : `Pay ${selectedMethod === 'instant' ? `৳${bdtAmount}` : `$${cryptoAmountUSD} USDT`}`}
        </button>

      </div>
    </div>
  );
}
