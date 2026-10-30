'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png';
const BKASH_NUMBER = '01894693890'; // আপনার বিকাশ নম্বর

export default function BkashPaymentPage() {
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
        console.error(e);
      }
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(BKASH_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (!trxId.trim()) {
      alert('দয়া করে বিকাশ TrxID লিখুন');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: orderData.serviceName,
          price: orderData.price,
          customerName: orderData.customerName,
          whatsappNumber: orderData.whatsappNumber,
          telegramUsername: orderData.telegramUsername,
          paymentMethod: 'bKash (Instant Pay)',
          trxId: trxId.trim(),
        }),
      });

      if (res.ok) {
        alert('✅ আপনার বিকাশ পেমেন্ট অর্ডার সফলভাবে সাবমিট হয়েছে! খুব দ্রুত সার্ভিস চালু করা হবে।');
        localStorage.removeItem('hubcart_current_order');
        router.push('/');
      } else {
        alert('অর্ডার সাবমিট করতে সমস্যা হয়েছে।');
      }
    } catch (err) {
      alert('সার্ভার এরর');
    } finally {
      setSubmitting(false);
    }
  };

  if (!orderData) return <div style={{ textAlign: 'center', padding: '50px' }}>লোড হচ্ছে...</div>;

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', background: '#f8fafc', minHeight: '100vh', padding: '16px' }}>
      
      {/* বিকাশ লোগো হেডার */}
      <div style={{ textAlign: 'center', padding: '16px', background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
        <h2 style={{ margin: 0, color: '#e2136e', fontSize: '24px', fontWeight: '900' }}>bKash</h2>
      </div>

      {/* Hub Cart ব্র্যান্ডিং বক্স */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
        <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>Hub Cart</span>
      </div>

      {/* টাকার পরিমাণ বক্স */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', textAlign: 'left', marginBottom: '16px', fontSize: '22px', fontWeight: '900', color: '#0f172a' }}>
        ৳ {orderData.price}
      </div>

      {/* ম্যাজেন্টা বিকাশ পেমেন্ট নির্দেশিকা কার্ড (ছবি ৩-এর হুবহু) */}
      <div style={{ background: '#e2136e', borderRadius: '16px', padding: '20px 16px', color: '#ffffff', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 'bold' }}>ট্রানজেকশন আইডি দিন</h4>

        <input
          type="text"
          placeholder="ট্রানজেকশন আইডি দিন"
          value={trxId}
          onChange={(e) => setTrxId(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '14px', outline: 'none', color: '#000', marginBottom: '16px' }}
        />

        <div style={{ fontSize: '12px', lineHeight: '1.8', opacity: 0.95 }}>
          <div>• *247# ডায়াল করে আপনার bKash মোবাইল মেনুতে যান অথবা bKash অ্যাপ খুলুন।</div>
          <div>• Send Money -এ ক্লিক করুন।</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
            <span>• এই নম্বরে টাকা পাঠান: <strong>{BKASH_NUMBER}</strong></span>
            <button onClick={handleCopy} style={{ background: '#ffffff', color: '#e2136e', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
              {copied ? 'কপি হয়েছে' : 'কপি'}
            </button>
          </div>
          <div>• টাকার পরিমাণ: <strong>{orderData.price}</strong></div>
          <div>• নিশ্চিত করে এখন আপনার bKash PIN লিখুন।</div>
          <div>• টাকা পাঠান এবং ট্রানজ্যাকশন আইডি কপি করুন।</div>
          <div>• ট্রানজ্যাকশন আইডি লিখে ভেরিফাই চাপুন।</div>
        </div>
      </div>

      {/* ভেরিফাই বাটন */}
      <button
        onClick={handleVerify}
        disabled={submitting}
        style={{
          width: '100%',
          padding: '14px',
          background: '#9e0048',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        {submitting ? 'যাচাই করা হচ্ছে...' : 'ভেরিফাই'}
      </button>

    </div>
  );
}
