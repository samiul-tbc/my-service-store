'use client';
import { useState } from 'react';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png';
const LOGO_BKASH = 'https://logos-world.net/wp-content/uploads/2024/10/Bkash-Logo.png';
const LOGO_NAGAD = 'https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png';

// নতুন ৪টি ক্যাটাগরি
const CATEGORIES = [
  { id: 'android-root', name: 'Android Root', icon: '⚡' },
  { id: 'android-panel', name: 'Android Panel', icon: '📱' },
  { id: 'social-package', name: 'Social Package', icon: '🚀' },
  { id: 'subscriptions', name: 'Subscriptions', icon: '💎' },
];

// ক্যাটাগরি অনুযায়ী ডেমো প্রোডাক্ট লিস্ট
const PRODUCTS = [
  {
    id: 1,
    category: 'android-root',
    title: 'Android Permanent Root Setup',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    description: 'KernelSU / Magisk রুট, SafetyNet ফিক্স ও ফুল গাইডেন্স।',
    price: 350,
    originalPrice: 450,
  },
  {
    id: 2,
    category: 'android-panel',
    title: 'Custom Android Tool Panel',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    description: 'ডিভাইস ম্যানেজমেন্ট ও অনলাইন অটোমেশন প্যানেল এক্সেস।',
    price: 850,
    originalPrice: 1000,
  },
  {
    id: 3,
    category: 'social-package',
    title: 'Premium Social Growth Pack',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80',
    description: 'অর্গানিক বুস্টিং ও ব্র্যান্ড প্রোফাইল গ্রোথ প্যাকেজ।',
    price: 250,
    originalPrice: 350,
  },
  {
    id: 4,
    category: 'subscriptions',
    title: 'VIP Premium Subscription Key',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    description: 'মাসিক ও বাৎসরিক প্রিমিয়াম টুলস লাইসেন্স সাবস্ক্রিপশন।',
    price: 550,
    originalPrice: 700,
  },
];

const PRODUCTS = [
  {
    id: 1,
    category: 'mobile',
    title: 'Android Phone Temp Root',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    description: 'KernelSU / Magisk টেম্পোরারি রুট সাপোর্ট ও গাইডেন্স।',
    price: 240,
    originalPrice: 300,
  },
  {
    id: 2,
    category: 'mobile',
    title: 'Android Permanent Root',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    description: 'Bootloader unlock, কাস্টম রম ও পার্মানেন্ট রুট সেটআপ।',
    price: 1550,
    originalPrice: 1800,
  },
  {
    id: 3,
    category: 'tools',
    title: 'VIP Flash Tool Premium Key',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    description: 'অনলাইন ফ্ল্যাশ ও আনলক টুলের অফিশিয়াল লাইসেন্স কী।',
    price: 450,
    originalPrice: 600,
  },
  {
    id: 4,
    category: 'remote',
    title: 'AnyDesk Diagnostics Support',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    description: 'লাইভ রিমোট কন্ট্রোলে সফটওয়্যার সমস্যা সমাধান।',
    price: 350,
    originalPrice: 400,
  },
];

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(null);
  const [paymentOption, setPaymentOption] = useState('Instant Pay');
  const [activeGateway, setActiveGateway] = useState('bKash');

  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const BKASH_NUMBER = '01812087109';
  const NAGAD_NUMBER = '01812080943';

  const validateBdNumber = (phone) => /^(013|014|015|016|017|018|019)\d{8}$/.test(phone.trim());

  const handleCopy = (num) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (!validateBdNumber(whatsappNumber)) {
      setPhoneError('নম্বর অবশ্যই 013-019 দিয়ে শুরু ও ১১ ডিজিট হতে হবে।');
      return;
    }
    setPhoneError('');
    if (paymentOption === 'TBC Pay') {
      sendOrder('TBC Pay (Manual Pay)', 'N/A (TBC Pay)');
    } else {
      setCheckoutStep('instant_methods');
    }
  };

  const sendOrder = async (methodUsed, trxCode) => {
    setLoading(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: selectedProduct.title,
          price: selectedProduct.price,
          customerName,
          whatsappNumber,
          telegramUsername: telegramUsername || 'N/A',
          paymentMethod: methodUsed,
          trxId: trxCode,
        }),
      });
      if (res.ok) {
        setCheckoutStep('success');
      } else {
        alert('সমস্যা হয়েছে, আবার চেষ্টা করুন।');
      }
    } catch (err) {
      alert('নেটওয়ার্ক সমস্যা।');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setSelectedProduct(null);
    setCheckoutStep(null);
    setPaymentOption('Instant Pay');
    setCustomerName('');
    setWhatsappNumber('');
    setTelegramUsername('');
    setTrxId('');
    setLoading(false);
  };

  return (
    <main>
      {/* ব্যানার */}
      <section style={{ margin: '12px 14px', background: 'radial-gradient(circle at center, #1e3a8a 0%, #030712 100%)', borderRadius: '16px', padding: '24px 16px', textAlign: 'center', color: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '4px' }}>
          <img src={LOGO_HUB_CART} alt="Logo" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>Hub Cart</h2>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: '#93c5fd', letterSpacing: '1px' }}>SHOP SMART • LIVE BETTER</p>
      </section>

      {/* ক্যাটাগরি প্রিভিউ */}
      <section style={{ padding: '0 14px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>Categories</h3>
          <Link href="/categories" style={{ textDecoration: 'none', fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>সব দেখুন →</Link>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/categories" style={{ textDecoration: 'none', flex: 1, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px' }}>💻📱</div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', marginTop: '4px' }}>Android Root</div>
          </Link>
          <Link href="/categories" style={{ textDecoration: 'none', flex: 1, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px' }}>🔑</div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', marginTop: '4px' }}>Android Panel</div>
          </Link>
        </div>
      </section>

      {/* ২ কলাম প্রোডাক্ট গ্রিড */}
      <section style={{ padding: '0 14px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 12px' }}>All Products</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {PRODUCTS.map((prod) => (
            <div key={prod.id} style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <img src={prod.image} alt={prod.title} style={{ width: '100%', height: '130px', objectFit: 'cover' }} />
              <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <h4 style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 8px', color: '#1e293b', minHeight: '32px', lineHeight: 1.3 }}>{prod.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#dc2626' }}>৳{prod.price}</span>
                    <span style={{ fontSize: '10px', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '4px' }}>৳{prod.originalPrice}</span>
                  </div>
                  <button
                    onClick={() => { setSelectedProduct(prod); setCheckoutStep('info'); }}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #0f172a', background: '#fff', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* চেকআউট মডাল */}
      {checkoutStep && selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', overflowY: 'auto' }}>
          <div style={{ background: '#ffffff', borderRadius: '18px', width: '100%', maxWidth: '440px', overflow: 'hidden' }}>
            
            {checkoutStep === 'info' && (
              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 'bold' }}>অর্ডার তথ্য দিন</h3>
                  <button onClick={resetModal} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#64748b', cursor: 'pointer' }}>✕</button>
                </div>

                <form onSubmit={handleInfoSubmit}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>আপনার নাম *</label>
                    <input required type="text" placeholder="নাম লিখুন" value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>WhatsApp Number *</label>
                    <input required type="text" maxLength={11} placeholder="017XXXXXXXX" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: phoneError ? '1px solid #ef4444' : '1px solid #cbd5e1' }} />
                    {phoneError && <span style={{ color: '#ef4444', fontSize: '11px', display: 'block', marginTop: '4px' }}>{phoneError}</span>}
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Telegram Username (ঐচ্ছিক)</label>
                    <input type="text" placeholder="@username" value={telegramUsername} onChange={(e) => setTelegramUsername(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div onClick={() => setPaymentOption('TBC Pay')} style={{ border: paymentOption === 'TBC Pay' ? '2px solid #ea580c' : '1px solid #cbd5e1', borderRadius: '12px', padding: '10px', textAlign: 'center', cursor: 'pointer' }}>
                        <img src={LOGO_HUB_CART} alt="TBC" style={{ width: '32px', height: '32px', margin: '0 auto 4px', display: 'block' }} />
                        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>TBC Pay</div>
                      </div>

                      <div onClick={() => setPaymentOption('Instant Pay')} style={{ border: paymentOption === 'Instant Pay' ? '2px solid #ea580c' : '1px solid #cbd5e1', borderRadius: '12px', padding: '10px', textAlign: 'center', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '6px' }}>
                          <img src={LOGO_BKASH} alt="bKash" style={{ height: '20px' }} />
                          <img src={LOGO_NAGAD} alt="Nagad" style={{ height: '20px' }} />
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Instant Pay</div>
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {loading ? 'প্রসেসিং...' : 'Buy Now'}
                  </button>
                </form>
              </div>
            )}

            {checkoutStep === 'instant_methods' && (
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span onClick={() => setCheckoutStep('info')} style={{ cursor: 'pointer', color: '#64748b' }}>← Back</span>
                  <span onClick={resetModal} style={{ cursor: 'pointer', color: '#64748b' }}>✕</span>
                </div>
                <h4 style={{ textAlign: 'center', margin: '0 0 16px' }}>পেমেন্ট মাধ্যম বেছে নিন</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div onClick={() => { setActiveGateway('bKash'); setCheckoutStep('gateway_verify'); }} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '16px 8px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }}>
                    <img src={LOGO_BKASH} alt="bKash" style={{ height: '30px' }} />
                  </div>
                  <div onClick={() => { setActiveGateway('Nagad'); setCheckoutStep('gateway_verify'); }} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '16px 8px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }}>
                    <img src={LOGO_NAGAD} alt="Nagad" style={{ height: '30px' }} />
                  </div>
                </div>
              </div>
            )}

            {checkoutStep === 'gateway_verify' && (
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span onClick={() => setCheckoutStep('instant_methods')} style={{ cursor: 'pointer', color: '#64748b' }}>← Back</span>
                  <span onClick={resetModal} style={{ cursor: 'pointer', color: '#64748b' }}>✕</span>
                </div>
                <div style={{ background: activeGateway === 'bKash' ? '#e2136e' : '#e52d27', color: '#fff', padding: '16px', borderRadius: '12px' }}>
                  <input type="text" placeholder="TrxID দিন" value={trxId} onChange={(e) => setTrxId(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '6px', border: 'none', marginBottom: '10px' }} />
                  <div style={{ fontSize: '12px', lineHeight: 1.7 }}>
                    নম্বর: <b>{activeGateway === 'bKash' ? BKASH_NUMBER : NAGAD_NUMBER}</b>
                    <button type="button" onClick={() => handleCopy(activeGateway === 'bKash' ? BKASH_NUMBER : NAGAD_NUMBER)} style={{ marginLeft: '8px', padding: '2px 6px', background: '#fff', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                      {copied ? 'Copied' : 'কপি'}
                    </button>
                    <br />মূল্য: ৳{selectedProduct.price}
                  </div>
                </div>
                <button type="button" disabled={!trxId.trim() || loading} onClick={() => sendOrder(activeGateway, trxId)} style={{ width: '100%', marginTop: '14px', padding: '12px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {loading ? 'ভেরিফাই হচ্ছে...' : 'ভেরিফাই ও অর্ডার কনফার্ম'}
                </button>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div style={{ padding: '34px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '44px' }}>✅</div>
                <h3 style={{ color: '#10b981', margin: '10px 0 6px' }}>অর্ডার সফল হয়েছে!</h3>
                <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>শীঘ্রই আপনার WhatsApp নম্বরে যোগাযোগ করা হবে।</p>
                <button onClick={resetModal} style={{ marginTop: '20px', padding: '10px 24px', background: '#0284c7', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}>ঠিক আছে</button>
              </div>
            )}

          </div>
        </div>
      )}
    </main>
  );
}
