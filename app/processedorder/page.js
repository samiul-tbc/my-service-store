'use client';

import { useState } from 'react';

export default function ProcessedOrderPage() {
  const [selectedMethod, setSelectedMethod] = useState('instant');
  const [loading, setLoading] = useState(false);

  // আপনার অর্ডার ডাটা (স্টেট বা প্রপস থেকে আসা মান)
  const [orderData, setOrderData] = useState({
    id: 'HC-514801',
    price: 1550,
    customerName: 'Samiul',
    whatsappNumber: '017XXXXXXXX',
  });

  const bdtAmount = Number(orderData.price) || 0;
  const cryptoAmountUSD = (bdtAmount / 120).toFixed(2); // ১ ডলার = ১২০ টাকা

  const handleProceed = async () => {
    setLoading(true);

    try {
      // ১. BDT অটো পেমেন্ট (bKash/Nagad via UddoktaPay)
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

        const data = await res.json();

        if (res.ok && data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          alert(data.error || 'পেমেন্ট গেটওয়েতে সংযোগ করা সম্ভব হয়নি');
        }
        return;
      }

      // ২. ক্রিপ্টো পেমেন্ট (USDT TRC-20 via NOWPayments)
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

        const data = await res.json();

        if (res.ok && data.invoiceUrl) {
          window.location.href = data.invoiceUrl;
        } else {
          alert(data.error || 'ক্রিপ্টো ইনভয়েস তৈরি করা যায়নি');
        }
        return;
      }
    } catch (err) {
      alert('সার্ভার এরর: পেমেন্ট শুরু করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', backgroundColor: '#090d16', color: '#ffffff', padding: '16px 16px 90px 16px' }}>
      <div style={{ maxWidth: '440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px 0' }}>
            Payment Method Select Korun
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            অর্ডারটি সম্পন্ন করতে পেমেন্ট মাধ্যম বেছে নিন
          </p>
        </div>

        {/* Order Summary Card */}
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
            <span style={{ fontWeight: '600', color: '#e5e7eb' }}>{orderData.id}</span>
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

        {/* Payment Methods */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Option 1: Instant Pay (bKash, Nagad, Rocket) */}
          <div
            onClick={() => setSelectedMethod('instant')}
            style={{
              padding: '16px',
              borderRadius: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              backgroundColor: selectedMethod === 'instant' ? '#0f291e' : '#111827',
              border: selectedMethod === 'instant' ? '2px solid #10b981' : '1px solid #1f2937',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '20px',
                height: '20px',
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

          {/* Option 2: Crypto Pay (USDT TRC20) */}
          <div
            onClick={() => setSelectedMethod('crypto')}
            style={{
              padding: '16px',
              borderRadius: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              backgroundColor: selectedMethod === 'crypto' ? '#0f291e' : '#111827',
              border: selectedMethod === 'crypto' ? '2px solid #10b981' : '1px solid #1f2937',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '20px',
                height: '20px',
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

        {/* Action Button */}
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
            transition: 'background-color 0.2s ease'
          }}
        >
          {loading ? 'Processing...' : `Pay ${selectedMethod === 'instant' ? `৳${bdtAmount}` : `$${cryptoAmountUSD} USDT`}`}
        </button>

      </div>
    </div>
  );
}
