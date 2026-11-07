'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LOGO_BYBIT = 'https://i.postimg.cc/vTPhzDcs/bybit5549.jpg';
const LOGO_TRC20 = 'https://cryptologos.cc/logos/tether-usdt-logo.png';

const DOLLAR_RATE = 120;

// Bybit USDT (TRC20) Wallet Address
const BYBIT_TRC20_ADDRESS = 'TJy7RE5zHs7E6Mqjr44PMuJJNXmqE9nYc1';

export default function CryptoPayPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);
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

  const calculateUSDT = (bdt) => {
    return ((Number(bdt) || 0) / DOLLAR_RATE).toFixed(2);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(BYBIT_TRC20_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!orderData) return;

    if (!trxId.trim()) {
      alert('দয়া করে Transaction Hash বা Bybit TrxID দিন!');
      return;
    }

    setLoading(true);
    const productName = orderData.serviceName || orderData.title || 'Product Order';
    const orderAmount = Number(orderData.price) || 0;
    const finalOrderId = orderData.orderId || orderData.id || `HC-${Date.now().toString().slice(-6)}`;

    try {
      // ১. ডাটাবেজে ক্রিপ্টো অর্ডার বুক করা
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: productName,
          price: orderAmount,
          customerName: orderData.customerName || 'Customer',
          whatsappNumber: orderData.whatsappNumber || '',
          telegramUsername: orderData.telegramUsername || 'নেই',
          paymentMethod: 'Crypto (Bybit USDT TRC20)',
          trxId: trxId.trim(),
          status: 'pending',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const generatedOrderId = data.orderId || data.order_id || data.id || finalOrderId;

        // ২. WhatsApp মেমো লিংকসহ মেসেজ পাঠানো
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
        alert(data.error || 'অর্ডার সাবমিট করা যায়নি। আবার চেষ্টা করুন।');
      }
    } catch (err) {
      alert('সার্ভার এরর! পুনরায় চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
        <h3>No order data found!</h3>
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

  const usdtPrice = calculateUSDT(orderData.price);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${BYBIT_TRC20_ADDRESS}`;

  return (
    <div style={{ maxWidth: '480px', margin: '20px auto', padding: '0 16px 80px' }}>
      
      {/* হেডার কার্ড */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '18px 16px',
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <img src={LOGO_BYBIT} alt="Bybit" style={{ height: '22px', borderRadius: '4px' }} />
          <img src={LOGO_TRC20} alt="USDT" style={{ height: '22px' }} />
          <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#f8fafc', margin: 0 }}>
            USDT (TRC20) Payment
          </h2>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
          Bybit বা যেকোনো ক্রিপ্টো ওয়ালেট থেকে সেন্ড করতে পারেন
        </p>

        <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(30, 41, 59, 0.7)', borderRadius: '14px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>মোট পরিশোধযোগ্য মূল্য:</span>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#38bdf8' }}>
            ${usdtPrice} USDT <span style={{ fontSize: '13px', color: '#94a3b8' }}>(৳{orderData.price})</span>
          </div>
        </div>
      </div>

      {/* QR Code & Wallet Address Box */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '20px',
        padding: '18px 16px',
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', display: 'block', marginBottom: '12px' }}>
          🌐 Network: TRON (TRC20)
        </span>

        {/* QR Code */}
        <div style={{
          background: '#ffffff',
          padding: '12px',
          borderRadius: '16px',
          display: 'inline-block',
          marginBottom: '14px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
        }}>
          <img
            src={qrCodeUrl}
            alt="USDT TRC20 QR Code"
            style={{ width: '160px', height: '160px', display: 'block' }}
          />
        </div>

        {/* Address Display & Copy */}
        <div style={{ background: '#0b0f19', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
            Deposit Wallet Address:
          </span>
          <div style={{
            fontSize: '12px',
            color: '#f8fafc',
            fontFamily: 'monospace',
            wordBreak: 'break-all',
            marginBottom: '10px',
            textAlign: 'left'
          }}>
            {BYBIT_TRC20_ADDRESS}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            style={{
              width: '100%',
              background: copied ? '#16a34a' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '10px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {copied ? '✓ Address Copied!' : 'Copy Wallet Address'}
          </button>
        </div>
      </div>

      {/* Confirmation Form */}
      <form onSubmit={handleSubmitOrder} style={{
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '16px',
      }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '6px' }}>
          Transaction Hash / TrxID দিন: *
        </label>
        <input
          type="text"
          required
          placeholder="যেমন: e6d78a9c... অথবা Bybit TrxID"
          value={trxId}
          onChange={(e) => setTrxId(e.target.value)}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            fontSize: '13px',
            outline: 'none',
            marginBottom: '14px',
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '900',
            fontSize: '15px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'অর্ডার সাবমিট হচ্ছে...' : 'Confirm Payment →'}
        </button>
      </form>

    </div>
  );
}
