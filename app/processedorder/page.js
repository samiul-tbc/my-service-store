'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';

const LOGO_HUB_CART = '/logo-icon.png';
const LOGO_BKASH = 'https://1000logos.net/wp-content/uploads/2021/02/Bkash-logo.png';
const LOGO_NAGAD = 'https://i.postimg.cc/3xv1gSBL/Nagad-Logo-wine.png';
const LOGO_ROCKET = 'https://i.postimg.cc/vBM08r5J/vecteezy-rocket-color-logo-mobile-banking-icon-68706013.png';
const LOGO_UPAY = 'https://i.postimg.cc/Gh9qphTM/upay-logo-mobile-banking-app-icon-transparent-background-free-png.png';
const LOGO_TRC20 = 'https://cryptologos.cc/logos/tether-usdt-logo.png';

const DOLLAR_RATE = 120;

export default function ProcessedOrderPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [orderData, setOrderData] = useState(null);
  const [checked, setChecked] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('manual_mfs');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hubcart_current_order');
    if (saved) {
      try {
        setOrderData(JSON.parse(saved));
      } catch (e) {
        console.error('Order load error:', e);
      }
    }
    setChecked(true);
  }, []);

  const calculateUSDT = (bdtPrice) => {
    const bdt = Number(bdtPrice) || 0;
    return (bdt / DOLLAR_RATE).toFixed(2);
  };

  const handleProceed = async () => {
    if (!orderData) return;

    const productName = orderData.serviceName || orderData.title || 'Product Order';
    const orderAmount = Number(orderData.price) || 0;

    // ১. Manual Pay -> সরাসরি বিকাশ/নগদ পেমেন্ট পেজে যাবে (অর্ডার ও মেসেজ পরে হবে)
    if (selectedMethod === 'manual_mfs') {
      router.push('/payment');
      return;
    }

    // ২. Crypto Pay -> সরাসরি ক্রিপ্টো পেজে যাবে (অর্ডার ও মেসেজ TrxID দেওয়ার পর হবে)
    if (selectedMethod === 'crypto') {
      router.push('/crypto-pay');
      return;
    }

    // ৩. TBC Pay -> সরাসরি ডাটাবেজে এন্ট্রি ও মেসেজ
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
            telegramUsername: orderData.telegramUsername || t.success.none,
            paymentMethod: 'TBC Pay (Manual)',
            trxId: 'Manual Contact',
            couponCode: orderData.couponCode || '',
            subtotal: orderData.subtotal || orderAmount,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          const generatedOrderId = data.orderId || data.order_id || data.id || orderData.id || `HC-${Date.now().toString().slice(-6)}`;

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
            console.error('WhatsApp alert error:', waErr);
          }

          localStorage.removeItem('hubcart_current_order');
          router.push(`/order-success?orderId=${generatedOrderId}`);
        } else {
          alert(data.error || data.message || 'Failed to submit order. Please try again.');
        }
      } catch (err) {
        alert('Server connection error. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  if (!checked) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
        <h3>Loading...</h3>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
        <h3>No order found!</h3>
        <button
          onClick={() => router.push('/')}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            background: '#a6f36a',
            color: '#10170c',
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
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#a6f36a', color: '#10170c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          3
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#f8fafc', margin: 0 }}>
          Select payment option
        </h2>
      </div>

      {/* Grid Methods */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
        
        {/* ১. Manual Pay */}
        <div
          onClick={() => setSelectedMethod('manual_mfs')}
          style={{
            gridColumn: 'span 2',
            background: '#ffffff',
            borderRadius: '16px',
            border: selectedMethod === 'manual_mfs' ? '2px solid #16a34a' : '1px solid #e2e8f0',
            cursor: 'pointer',
            overflow: 'hidden',
            boxShadow: selectedMethod === 'manual_mfs' ? '0 0 10px rgba(22, 163, 74, 0.4)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ background: '#16a34a', color: '#ffffff', fontSize: '9px', fontWeight: '900', textAlign: 'center', padding: '4px 0' }}>
            RECOMMENDED
          </div>
          <div style={{ padding: '14px 8px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <img src={LOGO_BKASH} alt="bKash" style={{ height: '18px', objectFit: 'contain' }} />
              <img src={LOGO_NAGAD} alt="Nagad" style={{ height: '18px', objectFit: 'contain' }} />
              <img src={LOGO_ROCKET} alt="Rocket" style={{ height: '19px', objectFit: 'contain' }} />
              <img src={LOGO_UPAY} alt="Upay" style={{ height: '17px', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#15803d' }}>Manual Pay</span>
          </div>
          <div style={{ background: '#dcfce7', padding: '6px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#166534' }}>
            bKash / Nagad / Rocket / Upay (Send Money)
          </div>
        </div>

        {/* ২. Crypto Pay */}
        <div
          onClick={() => setSelectedMethod('crypto')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: selectedMethod === 'crypto' ? '2px solid #ff7a00' : '1px solid #e2e8f0',
            cursor: 'pointer',
            overflow: 'hidden',
            boxShadow: selectedMethod === 'crypto' ? '0 0 10px rgba(255, 122, 0, 0.3)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ padding: '20px 4px 14px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src={LOGO_TRC20} alt="USDT" style={{ height: '22px', width: '22px', marginBottom: '6px' }} />
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>Crypto Pay</span>
          </div>
          <div style={{ background: '#f1f5f9', padding: '6px', textAlign: 'center', fontSize: '10px', fontWeight: 'bold', color: '#475569' }}>
            Bybit / TRC20
          </div>
        </div>

        {/* ৩. TBC Pay */}
        <div
          onClick={() => setSelectedMethod('tbc')}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: selectedMethod === 'tbc' ? '2px solid #16a34a' : '1px solid #e2e8f0',
            cursor: 'pointer',
            overflow: 'hidden',
            boxShadow: selectedMethod === 'tbc' ? '0 0 10px rgba(22, 163, 74, 0.4)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ padding: '20px 4px 14px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '26px', height: '26px', marginBottom: '6px' }} />
            <span style={{ fontSize: '12px', fontWeight: '900', color: '#0f172a' }}>TBC Pay</span>
          </div>
          <div style={{ background: '#f1f5f9', padding: '6px', textAlign: 'center', fontSize: '10px', fontWeight: 'bold', color: '#475569' }}>
            Manual Contact
          </div>
        </div>

      </div>

      {/* Product Price Summary */}
      <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
        {Number(orderData.discount) > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '13px', marginBottom: '8px' }}>
              <span>{t.shop.subtotalLabel}</span>
              <span style={{ fontWeight: 'bold', color: '#f8fafc' }}>৳ {orderData.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '13px', marginBottom: '8px' }}>
              <span>{t.shop.discount}{orderData.couponCode ? ` (${orderData.couponCode})` : ''}</span>
              <span style={{ fontWeight: 'bold', color: '#f87171' }}>−৳ {orderData.discount}</span>
            </div>
          </>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '13px' }}>
          <span>ℹ {t.success.productPrice}</span>
          <span style={{ fontWeight: 'bold', color: '#f8fafc' }}>
            ৳ {orderData.price}
            {selectedMethod === 'crypto' && ` (≈ $${usdtAmount} USDT)`}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleProceed}
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px',
          background: (selectedMethod === 'manual_mfs' || selectedMethod === 'tbc') ? '#16a34a' : '#f59e0b',
          color: (selectedMethod === 'manual_mfs' || selectedMethod === 'tbc') ? '#ffffff' : '#1c1005',
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
              : `Pay $${usdtAmount} USDT (Crypto)`}
      </button>

    </div>
  );
}
