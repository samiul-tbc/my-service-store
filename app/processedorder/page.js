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

    // ১. Manual Pay (Recommended)
    if (selectedMethod === 'manual_mfs') {
      router.push('/payment/bkash');
      return;
    }

    // ২. Auto Pay
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
          alert('Payment gateway-te shomoshsha hoyeche. Manual pay bebohar korun.');
        }
      } catch (err) {
        alert('Server connection error.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // ৩. Crypto Pay
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

    // ৪. TBC Pay
    if (selectedMethod === 'tbc') {
      alert('Order submit hoyeche! Shob info My Orders page-e dekhte paben.');
      router.push('/orders');
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ff7a00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          3
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#f8fafc', margin: 0 }}>
          Select payment option
        </h2>
      </div>

      <div style={{
        background: 'rgba(234, 179, 8, 0.1)',
        border: '1px solid rgba(234, 179, 8, 0.3)',
        borderRadius: '12px',
        padding: '12px 14px',
        marginBottom: '18px',
        fontSize: '12px',
        color: '#fef08a',
        lineHeight: '1.5',
      }}>
        💡 <strong>Poramorsho:</strong> Druto ebong nishchit verification-er jonno <strong>Manual Pay (Send Money)</strong> method bebohar korar onurodh kora hocche.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {/* ১. Manual Pay */}
        <div
          onClick={() => setSelectedMethod('manual_mfs')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: selectedMethod === 'manual_mfs' ? '2px solid #16a34a' : '1px solid #e2e8f0',
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div style={{ background: '#16a34a', color: '#ffffff', fontSize: '9px', fontWeight: '900', textAlign: 'center', padding: '2px 0' }}>
            ⭐ RECOMMENDED
          </div>
          <div style={{ padding: '12px 6px', textAlign: 'center', minHeight: '76px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
              <img src={LOGO_BKASH} alt="bKash" style={{ height: '16px', objectFit: 'contain' }} />
              <img src={LOGO_NAGAD} alt="Nagad" style={{ height: '16px', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#15803d' }}>Manual Pay</span>
          </div>
          <div style={{ background: '#dcfce7', padding: '6px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#166534' }}>
            Send Money (TrxID)
          </div>
        </div>

        {/* ২. Auto Pay */}
        <div
          onClick={() => setSelectedMethod('instant')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: selectedMethod === 'instant' ? '2px solid #ef4444' : '1px solid #e2e8f0',
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
            opacity: 0.85,
          }}
        >
          <div style={{ background: '#ef4444', color: '#ffffff', fontSize: '9px', fontWeight: '900', textAlign: 'center', padding: '2px 0' }}>
            ⚠️ Not Recommended
          </div>
          <div style={{ padding: '12px 6px', textAlign: 'center', minHeight: '76px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
              <img src={LOGO_BKASH} alt="bKash" style={{ height: '16px', objectFit: 'contain' }} />
              <img src={LOGO_NAGAD} alt="Nagad" style={{ height: '16px', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Auto Pay</span>
          </div>
          <div style={{ background: '#fee2e2', padding: '6px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#991b1b' }}>
            Gateway Issues
          </div>
        </div>

        {/* ৩. Crypto Pay */}
        <div
          onClick={() => setSelectedMethod('crypto')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: selectedMethod === 'crypto' ? '2px solid #ef4444' : '1px solid #e2e8f0',
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
            opacity: 0.85,
          }}
        >
          <div style={{ background: '#ef4444', color: '#ffffff', fontSize: '9px', fontWeight: '900', textAlign: 'center', padding: '2px 0' }}>
            ⚠️ Not Recommended
          </div>
          <div style={{ padding: '12px 6px', textAlign: 'center', minHeight: '76px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src={LOGO_TRC20} alt="USDT" style={{ height: '22px', width: '22px', marginBottom: '6px' }} />
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>USDT (TRC20)</span>
          </div>
          <div style={{ background: '#fee2e2', padding: '6px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#991b1b' }}>
            Instant Crypto
          </div>
        </div>

        {/* ৪. TBC Pay */}
        <div
          onClick={() => setSelectedMethod('tbc')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: selectedMethod === 'tbc' ? '2px solid #ff7a00' : '1px solid #e2e8f0',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
        >
          <div style={{ background: '#f1f5f9', color: '#64748b', fontSize: '9px', fontWeight: '900', textAlign: 'center', padding: '2px 0' }}>
            💬 Direct Support
          </div>
          <div style={{ padding: '12px 6px', textAlign: 'center', minHeight: '76px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '28px', height: '28px', marginBottom: '6px' }} />
            <span style={{ fontSize: '12px', fontWeight: '900', color: '#0f172a' }}>TBC Pay</span>
          </div>
          <div style={{ background: '#f1f5f9', padding: '6px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#475569' }}>
            Direct Contact
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '13px' }}>
          <span>ℹ️ Product Mullo:</span>
          <span style={{ fontWeight: 'bold', color: '#f8fafc' }}>
            ৳ {orderData.price}
            {selectedMethod === 'crypto' && ` (≈ $${usdtAmount} USDT)`}
          </span>
        </div>
      </div>

      <button
        onClick={handleProceed}
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px',
          background: selectedMethod === 'manual_mfs' ? '#16a34a' : '#ff7a00',
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
            ? 'Manual Payment Korun (Recommended)'
            : selectedMethod === 'instant'
              ? `Pay ৳${orderData.price} (Auto)`
              : selectedMethod === 'crypto'
                ? `Pay $${usdtAmount} USDT`
                : 'Order Nishchit Korun'}
      </button>
    </div>
  );
}
