'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';

const LOGO_HUB_CART = '/logo-icon.png';
const LOGO_UPAY = 'https://i.postimg.cc/Gh9qphTM/upay-logo-mobile-banking-app-icon-transparent-background-free-png.png';
const UPAY_NUMBER = '01894693890';

export default function UpayPaymentPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const brandName = lang === 'en' ? 'Upay' : 'Upay';
  const [orderData, setOrderData] = useState(null);
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hubcart_current_order');
    if (saved) {
      try {
        setOrderData(JSON.parse(saved));
      } catch (e) {
        console.error('Order load error:', e);
      }
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(UPAY_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (!trxId.trim()) {
      alert(t.pay.alertTrx.replaceAll('{brand}', brandName));
      return;
    }

    setSubmitting(true);
    try {
      const productName = orderData.serviceName || orderData.title || 'Product Order';
      const orderAmount = Number(orderData.price) || 0;

      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: productName,
          price: orderAmount,
          customerName: orderData.customerName || 'Customer',
          whatsappNumber: orderData.whatsappNumber || '',
          telegramUsername: orderData.telegramUsername || t.pay.none,
          paymentMethod: 'Upay (Send Money)',
          trxId: trxId.trim(),
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
        alert(data.error || data.message || t.pay.alertSubmitFail);
      }
    } catch (err) {
      alert(t.pay.alertServer);
    } finally {
      setSubmitting(false);
    }
  };

  if (!orderData) {
    return <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>{t.pay.loading}</div>;
  }

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', background: '#f8fafc', minHeight: '100vh', padding: '16px 16px 80px' }}>
      <div style={{ textAlign: 'center', padding: '12px', background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
        <img src={LOGO_UPAY} alt="Upay" style={{ height: '36px', objectFit: 'contain' }} />
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
        <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>Hub Cart</span>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', textAlign: 'left', marginBottom: '16px', fontSize: '22px', fontWeight: '900', color: '#0f172a' }}>
        ৳ {orderData.price}
      </div>

      <div style={{ background: '#002f6c', borderRadius: '16px', padding: '20px 16px', color: '#ffffff', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 'bold' }}>{t.pay.enterTrx}</h4>

        <input
          type="text"
          placeholder={t.pay.trxPlaceholder}
          value={trxId}
          onChange={(e) => setTrxId(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '14px', outline: 'none', color: '#000', marginBottom: '16px' }}
        />

        <div style={{ fontSize: '12px', lineHeight: '1.8', opacity: 0.95 }}>
          <div>{t.pay.stepDial.replaceAll('{brand}', brandName).replace('*247#', '*268#')}</div>
          <div>{t.pay.stepSendMenu}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
            <span>{t.pay.stepSendTo} <strong>{UPAY_NUMBER}</strong></span>
            <button onClick={handleCopy} style={{ background: '#ffffff', color: '#002f6c', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
              {copied ? t.pay.copied : t.pay.copy}
            </button>
          </div>
          <div>{t.pay.stepAmount} <strong>৳{orderData.price}</strong></div>
          <div>{t.pay.stepPin.replaceAll('{brand}', brandName)}</div>
          <div>{t.pay.stepVerify}</div>
        </div>
      </div>

      <button
        onClick={handleVerify}
        disabled={submitting}
        style={{
          width: '100%',
          padding: '14px',
          background: '#001c40',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: submitting ? 'not-allowed' : 'pointer',
        }}
      >
        {submitting ? t.pay.verifying : t.pay.verify}
      </button>
    </div>
  );
}
