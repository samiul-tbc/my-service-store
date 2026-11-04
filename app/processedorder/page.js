'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LOGO_HUB_CART = 'https://i.postimg.cc/ZRRgvqSQ/20261030-234214.png';
const LOGO_BKASH = 'https://1000logos.net/wp-content/uploads/2021/02/Bkash-logo.png';
const LOGO_NAGAD = 'https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png';
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

    const orderId = orderData.orderId || orderData.id;
    const priceInBDT = Number(orderData.price) || 0;
    const productName = orderData.serviceName || orderData.title || 'Product Order';

    // ১. bKash & Nagad (Manual Pay) -> app/payment/page.js
    if (selectedMethod === 'manual_mfs') {
      router.push('/payment');
      return;
    }

    // ২. bKash & Nagad (Auto Pay) - Not Recommended
    if (selectedMethod === 'instant') {
      setLoading(true);
      try {
        const res = await fetch('/api/create-bdt-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderId,
            amount: priceInBDT,
            customerName: orderData.customerName || 'Customer',
            phone: orderData.whatsappNumber || '',
            serviceName: productName,
          }),
        });

        const data = await res.json();
        if (res.ok && data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          alert('Gateway server error. Manual Pay bebohar korun.');
        }
      } catch (err) {
        alert('Server connection error.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // ৩. Crypto Pay (Auto) - Not Recommended
    if (selectedMethod === 'crypto') {
      setLoading(true);
      try {
        const priceInUSD = Number(calculateUSDT(orderData.price));
        const res = await fetch('/api/create-crypto-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderId,
            amountUSD: priceInUSD,
            customerName: orderData.customerName,
            phone: orderData.whatsappNumber,
          }),
        });

        const data = await res.json();
        if (res.ok && data.invoiceUrl) {
          window.location.href = data.invoiceUrl;
        } else {
          alert('Crypto invoice toiri kora jayni.');
        }
      } catch (err) {
        alert('Crypto server error.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // ৪. TBC Pay (Manual Pay) - RECOMMENDED (বিকাশ পেজের মতো নিখুঁত ডাটাবেজ ও WhatsApp সিঙ্ক)
    if (selectedMethod === 'tbc') {
      setLoading(true);
      try {
        const res = await fetch('/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceName: productName,
            price: priceInBDT,
            customerName: orderData.customerName || 'Customer',
            whatsappNumber: orderData.whatsappNumber || '',
            telegramUsername: orderData.telegramUsername || 'নেই',
            paymentMethod: 'TBC Pay (Manual)',
            trxId: 'Manual Contact',
          }),
        });

        const data = await res.json();

        if (res.ok) {
          // বিকাশ পেজের মতো সার্ভার থেকে আসা আসল অর্ডার আইডি নেওয়া
          const generatedOrderId = data.orderId || data.order_id || data.id || orderData.id || `HC-${Date.now().toString().slice(-6)}`;

          // WhatsApp SMS পাঠানো (সঠিক Order ID সহ)
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
          alert(data.error || data.message || 'অর্ডার সাবমিট করতে সমস্যা হয়েছে।');
        }
      } catch (err) {
        alert('সার্ভার সংযোগ সমস্যা। আবার চেষ্টা করুন।');
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
        
        {/* ১. bKash & Nagad (Manual) - RECOMMENDED */}
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
          <div style={{ padding: '12px 6px', textAlign: 'center', minHeight: '74px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
              <img src={LOGO_BKASH} alt="bKash" style={{ height: '16px', objectFit: 'contain' }} />
              <img src={LOGO_NAGAD} alt="Nagad" style={{ height: '16px', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#15803d' }}>Manual Pay</span>
          </div>
          <div style={{ background: '#dcfce7', padding: '6px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#166534' }}>
            bKash / Nagad
          </div>
        </div>

        {/* ২. bKash & Nagad (Auto) - NOT RECOMMENDED */}
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
          <div style={{ padding: '12px 6px', textAlign: 'center', minHeight: '74px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
              <img src={LOGO_BKASH} alt="bKash" style={{ height: '16px', objectFit: 'contain' }} />
              <img src={LOGO_NAGAD} alt="Nagad" style={{ height: '16px', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Auto Pay</span>
          </div>
          <div style={{ background: '#fee2e2', padding: '6px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#991b1b' }}>
            bKash / Nagad
          </div>
        </div>

        {/* ৩. Crypto Pay (Auto) - NOT RECOMMENDED */}
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
          <div style={{ padding: '12px 6px', textAlign: 'center', minHeight: '74px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src={LOGO_TRC20} alt="USDT" style={{ height: '22px', width: '22px', marginBottom: '6px' }} />
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Crypto Pay</span>
          </div>
          <div style={{ background: '#fee2e2', padding: '6px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#991b1b' }}>
            Auto (TRC20)
          </div>
        </div>

        {/* ৪. TBC Pay (Manual Pay) - RECOMMENDED */}
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
          <div style={{ padding: '12px 6px', textAlign: 'center', minHeight: '74px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '28px', height: '28px', marginBottom: '6px' }} />
            <span style={{ fontSize: '12px', fontWeight: '900', color: '#0f172a' }}>TBC Pay</span>
          </div>
          <div style={{ background: '#dcfce7', padding: '6px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#166534' }}>
            Manual Contact
          </div>
        </div>

      </div>

      {/* Product Price Summary */}
      <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '13px' }}>
          <span>ℹ️ Product Mullo:</span>
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
          ? 'Processing hocche...'
          : selectedMethod === 'manual_mfs'
            ? 'Manual Payment Korun'
            : selectedMethod === 'tbc'
              ? 'TBC Pay Nishchit Korun'
              : selectedMethod === 'instant'
                ? `Pay ৳${orderData.price} (Auto)`
                : `Pay $${usdtAmount} USDT`}
      </button>

    </div>
  );
}
