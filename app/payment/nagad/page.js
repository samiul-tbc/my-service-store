'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LOGO_HUB_CART = 'https://i.postimg.cc/ZRRgvqSQ/20261030-234214.png';
const LOGO_NAGAD = 'https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png';

// আপনার ১১ ডিজিটের পার্সোনাল নগদ নম্বরটি এখানে দিন
const NAGAD_NUMBER = '01894693890';

export default function NagadPaymentPage() {
  const router = useRouter();
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
    navigator.clipboard.writeText(NAGAD_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (!trxId.trim()) {
      alert('দয়া করে নগদ TrxID লিখুন');
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
          telegramUsername: orderData.telegramUsername || 'নেই',
          paymentMethod: 'Nagad (Send Money)',
          trxId: trxId.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const generatedOrderId = data.orderId || data.order_id || data.id || orderData.id || `HC-${Date.now().toString().slice(-6)}`;

        // WhatsApp অর্ডার কনফার্মেশন অ্যালার্ট
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
        alert(data.error || data.message || 'অর্ডার সাবমিট করতে সমস্যা হয়েছে।');
      }
    } catch (err) {
      alert('সার্ভার সংযোগ সমস্যা। আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  if (!orderData) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
        অর্ডার লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', background: '#f8fafc', minHeight: '100vh', padding: '16px 16px 80px' }}>
      
      {/* হেডারে নগদ লোগো */}
      <div style={{ textAlign: 'center', padding: '12px', background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
        <img src={LOGO_NAGAD} alt="Nagad" style={{ height: '36px', objectFit: 'contain' }} />
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
        <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>Hub Cart</span>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', textAlign: 'left', marginBottom: '16px', fontSize: '22px', fontWeight: '900', color: '#0f172a' }}>
        ৳ {orderData.price}
      </div>

      <div style={{ background: '#d32f2f', borderRadius: '16px', padding: '20px 16px', color: '#ffffff', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 'bold' }}>ট্রানজেকশন আইডি দিন</h4>

        <input
          type="text"
          placeholder="TrxID (যেমন: 7K9N82P1)"
          value={trxId}
          onChange={(e) => setTrxId(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '14px', outline: 'none', color: '#000', marginBottom: '16px' }}
        />

        <div style={{ fontSize: '12px', lineHeight: '1.8', opacity: 0.95 }}>
          <div>• *167# ডায়াল করে নগদ মেনুতে যান অথবা নগদ অ্যাপ খুলুন।</div>
          <div>• Send Money -এ ক্লিক করুন।</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
            <span>• এই নম্বরে টাকা পাঠান: <strong>{NAGAD_NUMBER}</strong></span>
            <button onClick={handleCopy} style={{ background: '#ffffff', color: '#d32f2f', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
              {copied ? 'কপি হয়েছে' : 'কপি'}
            </button>
          </div>
          <div>• টাকার পরিমাণ: <strong>৳{orderData.price}</strong></div>
          <div>• নিশ্চিত করে এখন আপনার নগদ PIN লিখুন।</div>
          <div>• টাকা পাঠান এবং ট্রানজ্যাকশন আইডি কপি করুন।</div>
          <div>• ট্রানজ্যাকশন আইডি লিখে ভেরিফাই চাপুন।</div>
        </div>
      </div>

      <button
        onClick={handleVerify}
        disabled={submitting}
        style={{
          width: '100%',
          padding: '14px',
          background: '#b71c1c',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: submitting ? 'not-allowed' : 'pointer',
        }}
      >
        {submitting ? 'যাচাই করা হচ্ছে...' : 'ভেরিফাই'}
      </button>

    </div>
  );
}
