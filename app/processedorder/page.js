'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LOGO_HUB_CART = 'https://i.postimg.cc/ZRRgvqSQ/20261030-234214.png';
const LOGO_BKASH = 'https://1000logos.net/wp-content/uploads/2021/02/Bkash-logo.png';
const LOGO_NAGAD = 'https://i.postimg.cc/3xv1gSBL/Nagad-Logo-wine.png';
const LOGO_ROCKET = 'https://i.postimg.cc/vBM08r5J/vecteezy-rocket-color-logo-mobile-banking-icon-68706013.png';
const LOGO_UPAY = 'https://i.postimg.cc/Gh9qphTM/upay-logo-mobile-banking-app-icon-transparent-background-free-png.png';
const LOGO_TRC20 = 'https://cryptologos.cc/logos/tether-usdt-logo.png';

const DOLLAR_RATE = 120;

export default function ProcessedOrderPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('manual_mfs');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hubcart_current_order');
    if (saved) {
      try {
        setOrderData(JSON.parse(saved));
      } catch (e) {
        console.error('Order parse error:', e);
      }
    }
  }, []);

  const calculateUSDT = (bdtPrice) => {
    const bdt = Number(bdtPrice) || 0;
    return (bdt / DOLLAR_RATE).toFixed(2);
  };

  const handleProceed = async () => {
    if (!orderData) return;

    const productName = orderData.serviceName || orderData.title || 'Product Order';
    const orderAmount = Number(orderData.price) || 0;
    const finalOrderId = orderData.orderId || orderData.id || `HC-${Date.now().toString().slice(-6)}`;

    // ১. Manual Pay -> app/payment/page.js
    if (selectedMethod === 'manual_mfs') {
      router.push('/payment');
      return;
    }

    // ২. Auto Pay (Shudhu gateway-te redirect hobe; kono order ba sms ekhon jabe na)
    if (selectedMethod === 'instant') {
      setLoading(true);
      try {
        const res = await fetch('/api/create-bdt-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: finalOrderId,
            amount: orderAmount,
            customerName: orderData.customerName || 'Customer',
            phone: orderData.whatsappNumber || '',
            serviceName: productName,
            telegram: orderData.telegramUsername || 'নেই',
          }),
        });

        const data = await res.json();
        if (res.ok && data.paymentUrl) {
          localStorage.removeItem('hubcart_current_order');
          window.location.href = data.paymentUrl;
        } else {
          alert(data.error || 'Payment gateway connection error. Please use Manual Pay.');
        }
      } catch (err) {
        alert('Server connection error. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // ৩. TBC Pay (Manual contact - TrxID charai instant confirm)
    if (selectedMethod === 'tbc') {
      setLoading(true);
      try {
        const res = await fetch('/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceName: productName,
            price: orderAmount,
            customerName: orderData.customerName || 'Customer',
            whatsappNumber: orderData.whatsappNumber || '',
            telegramUsername: orderData.telegramUsername || 'নেই',
            paymentMethod: 'TBC Pay (Manual)',
            trxId: 'Manual Contact',
          }),
        });

        const data = await res.json();

        if (res.ok) {
          const generatedOrderId = data.orderId || data.order_id || data.id || finalOrderId;

          try {
            await fetch('/api/send-whatsapp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                customerName: orderData.customerName,
                phone: orderData.whatsappNumber,
                orderId: generatedOrderId,
                serviceName: productName,
              }),
            });
          } catch (waErr) {
            console.error('WhatsApp send error:', waErr);
          }

          localStorage.removeItem('hubcart_current_order');
          router.push(`/order-success?orderId=${generatedOrderId}`);
        } else {
          alert(data.error || data.message || 'Failed to submit order.');
        }
      } catch (err) {
        alert('Server connection error. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // ৪. Crypto Pay
    if (selectedMethod === 'crypto') {
      setLoading(true);
      try {
        const priceInUSD = Number(calculateUSDT(orderData.price));
        const res = await fetch('/api/create-crypto-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: finalOrderId,
            amountUSD: priceInUSD,
            customerName: orderData.customerName,
            phone: orderData.whatsappNumber,
          }),
        });

        const data = await res.json();
        if (res.ok && data.invoiceUrl) {
          window.location.href = data.invoiceUrl;
        } else {
          alert('Could not generate crypto invoice.');
        }
      } catch (err) {
        alert('Crypto server connection error.');
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  if (!orderData) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
        <h3>No order found!</h3>
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
          Back to Home
        </button>
      </div>
    );
  }

  const usdtAmount = calculateUSDT(orderData.price);

  return (
    <div style={{ maxWidth: '480px', margin: '20px auto', padding: '0 16px 80px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ff7a00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          3
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#f8fafc', margin: 0 }}>
          Select payment option
        </h2>
      </div>

      {/* Grid Methods */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
        
        {/* 1. Manual Pay */}
        <div
          onClick={() => setSelectedMethod('manual_mfs')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: selectedMethod === 'manual_mfs' ? '2px solid #16a34a' : '1px solid #e2e8f0',
            cursor: 'pointer',
            overflow: 'hidden',
            boxShadow: selectedMethod === 'manual_mfs' ? '0 0 10px rgba(22, 163, 74, 0.4)' : 'none',
          }}
        >
          <div style={{ background: '#16a34a', color: '#ffffff', fontSize: '9px', fontWeight: '900', textAlign: 'center', padding: '3px 0' }}>
            ⭐ RECOMMENDED
          </div>
          <div style={{ padding: '10px 4px', textAlign: 'center', minHeight: '74px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <img src={LOGO_BKASH} alt="bKash" style={{ height: '14px', objectFit: 'contain' }} />
              <img src={LOGO_NAGAD} alt="Nagad" style={{ height: '14px', objectFit: 'contain' }} />
              <img src={LOGO_ROCKET} alt="Rocket" style={{ height: '15px', objectFit: 'contain' }} />
              <img src={LOGO_UPAY} alt="Upay" style={{ height: '13px', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#15803d' }}>Manual Pay</span>
          </div>
          <div style={{ background: '#dcfce7', padding: '6px', textAlign: 'center', fontSize: '10px', fontWeight: 'bold', color: '#166534' }}>
            bKash / Nagad / Rocket / Upay
          </div>
        </div>

        {/* 2. Auto Pay */}
        <div
          onClick={() => setSelectedMethod('instant')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: selectedMethod === 'instant' ? '2px solid #ef4444' : '1px solid #e2e8f0',
            cursor: 'pointer',
            overflow: 'hidden',
            opacity: selectedMethod === 'instant' ? 1 : 0.8,
          }}
        >
          <div style={{ background: '#ef4444', color: '#ffffff', fontSize: '9px', fontWeight: '900', textAlign: 'center', padding: '3px 0' }}>
            ⚠️ Not Recommended
          </div>
          <div style={{ padding: '10px 4px', textAlign: 'center', minHeight: '74px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
              <img src={LOGO_BKASH} alt="bKash" style={{ height: '15px', objectFit: 'contain' }} />
              <img src={LOGO_NAGAD} alt="Nagad" style={{ height: '15px', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Auto Pay</span>
          </div>
          <div style={{ background: '#fee2e2', padding: '6px', textAlign: 'center', fontSize: '10px', fontWeight: 'bold', color: '#991b1b' }}>
            bKash / Nagad
          </div>
        </div>

        {/* 3. Crypto Pay */}
        <div
          onClick={() => setSelectedMethod('crypto')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: selectedMethod === 'crypto' ? '2px solid #ef4444' : '1px solid #e2e8f0',
            cursor: 'pointer',
            overflow: 'hidden',
            opacity: selectedMethod === 'crypto' ? 1 : 0.8,
          }}
        >
          <div style={{ background: '#ef4444', color: '#ffffff', fontSize: '9px', fontWeight: '900', textAlign: 'center', padding: '3px 0' }}>
            ⚠️ Not Recommended
          </div>
          <div style={{ padding: '10px 4px', textAlign: 'center', minHeight: '74px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src={LOGO_TRC20} alt="USDT" style={{ height: '20px', width: '20px', marginBottom: '4px' }} />
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Crypto Pay</span>
          </div>
          <div style={{ background: '#fee2e2', padding: '6px', textAlign: 'center', fontSize: '10px', fontWeight: 'bold', color: '#991b1b' }}>
            Auto (TRC20)
          </div>
        </div>

        {/* 4. TBC Pay */}
        <div
          onClick={() => setSelectedMethod('tbc')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: selectedMethod === 'tbc' ? '2px solid #16a34a' : '1px solid #e2e8f0',
            cursor: 'pointer',
            overflow: 'hidden',
            boxShadow: selectedMethod === 'tbc' ? '0 0 10px rgba(22, 163, 74, 0.4)' : 'none',
          }}
        >
          <div style={{ background: '#16a34a', color: '#ffffff', fontSize: '9px', fontWeight: '900', textAlign: 'center', padding: '3px 0' }}>
            ⭐ RECOMMENDED
          </div>
          <div style={{ padding: '10px 4px', textAlign: 'center', minHeight: '74px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '26px', height: '26px', marginBottom: '4px' }} />
            <span style={{ fontSize: '12px', fontWeight: '900', color: '#0f172a' }}>TBC Pay</span>
          </div>
          <div style={{ background: '#dcfce7', padding: '6px', textAlign: 'center', fontSize: '10px', fontWeight: 'bold', color: '#166534' }}>
            Manual Contact
          </div>
        </div>

      </div>

      {/* Product Price Summary */}
      <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '13px' }}>
          <span>ℹ️ প্রোডাক্ট মূল্য:</span>
          <span style={{ fontWeight: 'bold', color: '#f8fafc' }}>
            ৳ {orderData.price}
            {selectedMethod === 'crypto' && ` (≈ $${usdtAmount} USDT)`}
          </span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleProceed}
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px',
          background: (selectedMethod === 'manual_mfs' || selectedMethod === 'tbc') ? '#16a34a' : '#ff7a00',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '900',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading
          ? 'Processing...'
          : selectedMethod === 'manual_mfs'
            ? 'Manual Pay'
            : selectedMethod === 'tbc'
              ? 'TBC Pay'
              : selectedMethod === 'instant'
                ? `Pay ৳${orderData.price} (Auto)`
                : `Pay $${usdtAmount} USDT`}
      </button>

    </div>
  );
}
