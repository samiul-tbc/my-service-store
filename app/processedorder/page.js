'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LOGO_HUB_CART = 'https://i.postimg.cc/ZRRgvqSQ/20261030-234214.png';
const LOGO_BKASH = 'https://1000logos.net/wp-content/uploads/2021/02/Bkash-logo.png';
const LOGO_NAGAD = 'https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png';
const LOGO_TRC20 = 'https://cryptologos.cc/logos/tether-usdt-logo.png';

const DOLLAR_RATE = 120; // 1 USD = 120 BDT

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

    const generatedOrderId = orderData.id || `HC-${Math.floor(1000 + Math.random() * 9000)}`;
    const priceInBDT = Number(orderData.price) || 0;
    const productName = orderData.serviceName || orderData.title || 'Product Order';

    // ১. লোকাল Auto Pay (bKash/Nagad Instant via UddoktaPay)
    if (selectedMethod === 'instant') {
      setLoading(true);
      try {
        // Shobar age database-e order create kora jate /orders page-e dekha jay
        await fetch('/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: generatedOrderId,
            serviceName: productName,
            price: priceInBDT,
            customerName: orderData.customerName || 'Customer',
            whatsappNumber: orderData.whatsappNumber || '',
            telegramUsername: orderData.telegramUsername || 'nei',
            paymentMethod: 'Auto Pay (UddoktaPay)',
            trxId: 'Processing Online Payment',
          }),
        });

        // UddoktaPay-te pathano
        const res = await fetch('/api/create-bdt-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: generatedOrderId,
            amount: priceInBDT,
            customerName: orderData.customerName || 'Valued Customer',
            phone: orderData.whatsappNumber || '',
            serviceName: productName,
          }),
        });

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          alert('API Route pawa jayni (404)! GitHub-e "app/api/create-bdt-payment/route.js" file check korun.');
          return;
        }

        const data = await res.json();

        if (res.ok && data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          alert(data.error || 'Payment gateway connection fail!');
        }
      } catch (err) {
        alert('Server error: Payment shuru kora jayni.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // ২. লোকাল Manual Pay (bKash / Nagad Manual TrxID page)
    if (selectedMethod === 'manual_mfs') {
      router.push('/payment/bkash');
      return;
    }

    // ৩. Crypto Pay (USDT TRC-20 via NOWPayments)
    if (selectedMethod === 'crypto') {
      setLoading(true);
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
          alert('Crypto API Route pawa jayni!');
          return;
        }

        const data = await res.json();

        if (res.ok && data.invoiceUrl) {
          window.location.href = data.invoiceUrl;
        } else {
          alert(data.error || 'Crypto invoice toiri kora jayni.');
        }
      } catch (err) {
        alert('Server error: Crypto payment shuru kora jayni.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // ৪. TBC Pay (Manual Later)
    if (selectedMethod === 'tbc') {
      setLoading(true);
      try {
        const res = await fetch('/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceName: productName,
            price: priceInBDT,
            customerName: orderData.customerName,
            whatsappNumber: orderData.whatsappNumber,
            telegramUsername: orderData.telegramUsername || 'N/A',
            paymentMethod: 'TBC Pay (Manual Later)',
            trxId: 'Manual Contact',
          }),
        });

        const data = await res.json();

        if (res.ok) {
          const newOrderId = data.orderId || data.order_id || data.id || generatedOrderId;

          // WhatsApp notification
          try {
            await fetch('/api/send-whatsapp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                customerName: orderData.customerName,
                phone: orderData.whatsappNumber,
                orderId: newOrderId,
                serviceName: productName,
              }),
            });
          } catch (waErr) {
            console.error('WhatsApp alert error:', waErr);
          }

          alert('✅ TBC Pay order submit hoyeche! Amader team apnar sathe jogajog korbe.');
          localStorage.removeItem('hubcart_current_order');
          router.push(`/order-success?orderId=${newOrderId}`);
        } else {
          alert(data.error || 'Order submit korte problem hoyeche.');
        }
      } catch (err) {
        alert('Server error');
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  if (!orderData) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
        <h3>Kono order pawa jayni!</h3>
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
          Homepage-e phire jan
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

      {/* 2x2 Grid Layout: 4 Options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
        
        {/* ১. Auto Pay (bKash / Nagad Instant) */}
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

          <div style={{ padding: '14px 6px', textAlign: 'center', minHeight: '82px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '6px' }}>
              <img src={LOGO_BKASH} alt="bKash" style={{ height: '16px', objectFit: 'contain' }} />
              <img src={LOGO_NAGAD} alt="Nagad" style={{ height: '16px', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0284c7' }}>Auto Pay</span>
          </div>

          <div style={{ background: '#f1f5f9', padding: '6px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#475569' }}>
            Instant Gateway
          </div>
        </div>

        {/* ২. Manual Pay (bKash / Nagad Manual) */}
        <div
          onClick={() => setSelectedMethod('manual_mfs')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: selectedMethod === 'manual_mfs' ? '2px solid #ff7a00' : '1px solid #e2e8f0',
            overflow: 'hidden',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          {selectedMethod === 'manual_mfs' && (
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

          <div style={{ padding: '14px 6px', textAlign: 'center', minHeight: '82px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '6px' }}>
              <img src={LOGO_BKASH} alt="bKash" style={{ height: '16px', objectFit: 'contain' }} />
              <img src={LOGO_NAGAD} alt="Nagad" style={{ height: '16px', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#d97706' }}>Manual Pay</span>
          </div>

          <div style={{ background: '#f1f5f9', padding: '6px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#475569' }}>
            Send Money (TrxID)
          </div>
        </div>

        {/* ৩. Crypto Pay (USDT TRC20) */}
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

          <div style={{ padding: '14px 6px', textAlign: 'center', minHeight: '82px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src={LOGO_TRC20} alt="USDT TRC20" style={{ height: '24px', width: '24px', objectFit: 'contain', marginBottom: '6px' }} />
            <span style={{ fontSize: '12px', fontWeight: '900', color: '#16a34a' }}>USDT (TRC20)</span>
          </div>

          <div style={{ background: '#f1f5f9', padding: '6px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#475569' }}>
            Instant Crypto
          </div>
        </div>

        {/* ৪. TBC Pay (Manual Later) */}
        <div
          onClick={() => setSelectedMethod('tbc')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: selectedMethod === 'tbc' ? '2px solid #ff7a00' : '1px solid #e2e8f0',
            overflow: 'hidden',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          {selectedMethod === 'tbc' && (
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

          <div style={{ padding: '14px 6px', textAlign: 'center', minHeight: '82px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '32px', height: '32px', objectFit: 'contain', marginBottom: '6px' }} />
            <span style={{ fontSize: '12px', fontWeight: '900', color: '#0f172a' }}>TBC Pay</span>
          </div>

          <div style={{ background: '#f1f5f9', padding: '6px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#475569' }}>
            Direct Contact
          </div>
        </div>

      </div>

      {/* Product Price Summary */}
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

      {/* Proceed Button */}
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
            : selectedMethod === 'instant'
              ? `Pay ৳${orderData.price} (Auto)`
              : selectedMethod === 'manual_mfs'
                ? `ম্যানুয়াল পেমেন্ট করুন`
                : 'অর্ডার সাবমিট করুন'}
      </button>

    </div>
  );
}
