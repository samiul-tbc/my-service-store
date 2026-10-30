'use client';
import { useState } from 'react';

// লোগোর সরাসরি ইমেজ লিংকসমূহ
const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png'; // PostImg Direct Link
const LOGO_BKASH = 'https://logos-world.net/wp-content/uploads/2024/10/Bkash-Logo.png';
const LOGO_NAGAD = 'https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png';

// প্রোডাক্ট লিস্ট
const PRODUCTS = [
  {
    id: 1,
    title: 'Android Firmware & Root Support',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    description: 'KernelSU / Magisk root, Bootloader unlock এবং SafetyNet bypass সাপোর্ট।',
    price: 155,
  },
  {
    id: 2,
    title: 'Custom Tool Premium Key',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    description: 'VIP Automation & Flash Tool এর অফিশিয়াল এক্টিভেশন লাইসেন্স কী।',
    price: 350,
  },
  {
    id: 3,
    title: 'Remote Device Diagnostics',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    description: 'AnyDesk / UltraViewer এর মাধ্যমে সরাসরি ডিভাইস সফটওয়্যার ফিক্সিং।',
    price: 500,
  },
];

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  // পেজ ভিউ নিয়ন্ত্রণ: 'home' | 'info_page' | 'gateway_methods' | 'gateway_verify' | 'success'
  const [currentView, setCurrentView] = useState('home');
  const [paymentOption, setPaymentOption] = useState('Instant Pay'); // 'TBC Pay' | 'Instant Pay'
  const [activeGateway, setActiveGateway] = useState('bKash');       // 'bKash' | 'Nagad'

  // ফর্মের ফিল্ডসমূহ
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // বিকাশ ও নগদ নম্বর
  const BKASH_NUMBER = '01812087109';
  const NAGAD_NUMBER = '01812080943';

  // বাংলাদেশি ১১ ডিজিট ভ্যালিডেশন (013, 014, 015, 016, 017, 018, 019)
  const validateBdNumber = (phone) => {
    const regex = /^(013|014|015|016|017|018|019)\d{8}$/;
    return regex.test(phone.trim());
  };

  const handleCopy = (num) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    setCurrentView('info_page');
    setPhoneError('');
  };

  const handleInfoFormSubmit = (e) => {
    e.preventDefault();
    if (!validateBdNumber(whatsappNumber)) {
      setPhoneError('নম্বর অবশ্যই 013, 014, 015, 016, 017, 018 বা 019 দিয়ে শুরু এবং মোট ১১ ডিজিট হতে হবে।');
      return;
    }
    setPhoneError('');

    if (paymentOption === 'TBC Pay') {
      // TBC Pay সিলেক্ট করলে টাকা লাগবে না, সরাসরি বটে অর্ডার চলে যাবে
      sendOrderToTelegram('TBC Pay (Manual Pay)', 'N/A (TBC Pay)');
    } else {
      // Instant Pay সিলেক্ট করলে ২য় পেজে মোবাইল ব্যাংকিং ইন্টারফেস খুলবে
      setCurrentView('gateway_methods');
    }
  };

  const sendOrderToTelegram = async (methodUsed, trxCode) => {
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

      const data = await res.json();
      if (res.ok) {
        setCurrentView('success');
      } else {
        alert(data.error || 'অর্ডার পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (err) {
      alert('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setSelectedProduct(null);
    setCurrentView('home');
    setPaymentOption('Instant Pay');
    setActiveGateway('bKash');
    setCustomerName('');
    setWhatsappNumber('');
    setTelegramUsername('');
    setTrxId('');
    setPhoneError('');
    setLoading(false);
  };

  return (
    <main style={{ minHeight: '100vh', background: '#0a0d16', color: '#f1f5f9', fontFamily: 'sans-serif', padding: '20px 14px' }}>
      <div style={{ maxWidth: '940px', margin: '0 auto' }}>

        {/* ================= ১. হোম পেজ (প্রোডাক্ট ক্যাটালগ) ================= */}
        {currentView === 'home' && (
          <div>
            <header style={{ textAlign: 'center', marginBottom: '35px', marginTop: '10px' }}>
              <img
                src={LOGO_HUB_CART}
                alt="Hub Cart"
                referrerPolicy="no-referrer"
                style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '14px', marginBottom: '10px' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <h1 style={{ fontSize: '28px', color: '#38bdf8', margin: '0 0 4px', fontWeight: 'bold' }}>Hub Cart</h1>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>SHOP SMART • LIVE BETTER</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
              {PRODUCTS.map((prod) => (
                <div key={prod.id} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <img src={prod.image} alt={prod.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', margin: '0 0 8px', color: '#f8fafc' }}>{prod.title}</h3>
                      <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>{prod.description}</p>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                      <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#10b981', marginBottom: '12px' }}>৳ {prod.price}</div>
                      <button
                        onClick={() => handleSelectProduct(prod)}
                        style={{ width: '100%', padding: '12px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
                      >
                        অর্ডার করুন
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= ২. কাস্টমার ইনফো পেজ ================= */}
        {currentView === 'info_page' && selectedProduct && (
          <div style={{ maxWidth: '460px', margin: '15px auto', background: '#ffffff', borderRadius: '16px', color: '#1e293b', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <button onClick={() => setCurrentView('home')} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '15px', cursor: 'pointer', fontWeight: 'bold' }}>← ব্যাকে যান</button>
              <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '16px' }}>অর্ডার বিবরণ</span>
              <button onClick={resetFlow} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>{selectedProduct.title}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>ডিজিটাল সার্ভিস</div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0284c7' }}>৳{selectedProduct.price}</div>
              </div>

              <form onSubmit={handleInfoFormSubmit}>
                {/* নাম ফিল্ড */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>আপনার নাম *</label>
                  <input
                    required
                    type="text"
                    placeholder="আপনার নাম লিখুন"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                {/* WhatsApp নম্বর */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>WhatsApp Number *</label>
                  <input
                    required
                    type="text"
                    maxLength={11}
                    placeholder="017XXXXXXXX বা 018XXXXXXXX"
                    value={whatsappNumber}
                    onChange={(e) => {
                      setWhatsappNumber(e.target.value);
                      if (phoneError) setPhoneError('');
                    }}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: phoneError ? '1px solid #ef4444' : '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                  {phoneError && (
                    <span style={{ display: 'block', color: '#ef4444', fontSize: '11px', marginTop: '4px', lineHeight: 1.4 }}>{phoneError}</span>
                  )}
                </div>

                {/* Telegram Username */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>Telegram Username (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                {/* মেথড অপশন (TBC Pay vs Instant Pay) */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ background: '#ea580c', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>3</span>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>Select one option</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    
                    {/* অপশন ১: TBC Pay (Hub Cart লোগো সহ) */}
                    <div
                      onClick={() => setPaymentOption('TBC Pay')}
                      style={{
                        border: paymentOption === 'TBC Pay' ? '2px solid #ea580c' : '1px solid #cbd5e1',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                        background: '#ffffff',
                      }}
                    >
                      {paymentOption === 'TBC Pay' && (
                        <div style={{ position: 'absolute', top: 0, left: 0, background: '#ea580c', color: '#fff', fontSize: '10px', padding: '2px 7px', borderBottomRightRadius: '8px', fontWeight: 'bold' }}>✓</div>
                      )}
                      <div style={{ padding: '12px 10px 10px', textAlign: 'center' }}>
                        <div style={{ height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                          <img
                            src={LOGO_HUB_CART}
                            alt="Hub Cart"
                            referrerPolicy="no-referrer"
                            style={{ height: '42px', width: '42px', objectFit: 'contain' }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#0f172a' }}>TBC Pay</div>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '6px', textAlign: 'center', fontSize: '12px', color: '#64748b', borderTop: '1px solid #e2e8f0', fontWeight: 'bold' }}>
                        Wallet Pay
                      </div>
                    </div>

                    {/* অপশন ২: Instant Pay (বিকাশ ও নগদ লোগো সহ) */}
                    <div
                      onClick={() => setPaymentOption('Instant Pay')}
                      style={{
                        border: paymentOption === 'Instant Pay' ? '2px solid #ea580c' : '1px solid #cbd5e1',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                        background: '#ffffff',
                      }}
                    >
                      {paymentOption === 'Instant Pay' && (
                        <div style={{ position: 'absolute', top: 0, left: 0, background: '#ea580c', color: '#fff', fontSize: '10px', padding: '2px 7px', borderBottomRightRadius: '8px', fontWeight: 'bold' }}>✓</div>
                      )}
                      <div style={{ padding: '12px 8px 10px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', height: '45px', marginBottom: '6px' }}>
                          <img
                            src={LOGO_BKASH}
                            alt="bKash"
                            referrerPolicy="no-referrer"
                            style={{ height: '24px', maxWidth: '48px', objectFit: 'contain' }}
                          />
                          <img
                            src={LOGO_NAGAD}
                            alt="Nagad"
                            referrerPolicy="no-referrer"
                            style={{ height: '26px', maxWidth: '48px', objectFit: 'contain' }}
                          />
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#0284c7' }}>Auto Payment</div>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '6px', textAlign: 'center', fontSize: '12px', color: '#64748b', borderTop: '1px solid #e2e8f0', fontWeight: 'bold' }}>
                        Instant Pay
                      </div>
                    </div>

                  </div>
                </div>

                {paymentOption === 'TBC Pay' && (
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 12px', borderRadius: '8px', marginBottom: '18px', fontSize: '12px', color: '#1e40af', lineHeight: 1.5 }}>
                    ℹ️ <b>TBC Pay:</b> কোনো টাকা দেওয়া লাগবে না। Buy Now চাপলে অর্ডার জমা হবে এবং আমরা পরবর্তীতে আপনার সাথে যোগাযোগ করে পেমেন্ট গ্রহণ করব।
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', padding: '13px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {loading ? 'প্রসেসিং হচ্ছে...' : 'Buy Now'}
                </button>
              </form>
            </div>

          </div>
        )}

        {/* ================= ৩. INSTANT PAY মেথড ইন্টারফেস ================= */}
        {currentView === 'gateway_methods' && selectedProduct && (
          <div style={{ maxWidth: '440px', margin: '20px auto', background: '#f8fafc', borderRadius: '16px', color: '#1e293b', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', minHeight: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
                <span onClick={() => setCurrentView('info_page')} style={{ cursor: 'pointer', fontSize: '18px', color: '#64748b' }}>🏠</span>
                <span onClick={resetFlow} style={{ cursor: 'pointer', fontSize: '18px', color: '#64748b' }}>✕</span>
              </div>

              {/* Hub Cart ব্র্যান্ড লোগো ও নাম */}
              <div style={{ textAlign: 'center', padding: '24px 16px 14px' }}>
                <img
                  src={LOGO_HUB_CART}
                  alt="Hub Cart"
                  referrerPolicy="no-referrer"
                  style={{ width: '70px', height: '70px', objectFit: 'contain', margin: '0 auto 8px', display: 'block', borderRadius: '12px' }}
                />
                <div style={{ fontSize: '19px', fontWeight: 'bold', color: '#0f172a' }}>Hub Cart</div>
              </div>

              <div style={{ background: '#0284c7', color: '#fff', textAlign: 'center', padding: '9px', fontWeight: 'bold', fontSize: '14px', margin: '8px 18px', borderRadius: '5px' }}>
                মোবাইল ব্যাংকিং
              </div>

              {/* বিকাশ ও নগদ বাটন */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', padding: '14px 18px' }}>
                
                {/* bKash Selection */}
                <div
                  onClick={() => {
                    setActiveGateway('bKash');
                    setCurrentView('gateway_verify');
                  }}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '16px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    height: '55px',
                  }}
                >
                  <img src={LOGO_BKASH} alt="bKash" referrerPolicy="no-referrer" style={{ height: '32px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

                {/* Nagad Selection */}
                <div
                  onClick={() => {
                    setActiveGateway('Nagad');
                    setCurrentView('gateway_verify');
                  }}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '16px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    height: '55px',
                  }}
                >
                  <img src={LOGO_NAGAD} alt="Nagad" referrerPolicy="no-referrer" style={{ height: '34px', maxWidth: '100%', objectFit: 'contain' }} />
                </div>

              </div>
            </div>

            <div style={{ padding: '18px' }}>
              <button
                onClick={() => setCurrentView('gateway_verify')}
                style={{ width: '100%', padding: '14px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                পে করুন {selectedProduct.price}.00
              </button>
            </div>

          </div>
        )}

        {/* ================= ৪. গেটওয়ে ভেরিফাই ইন্টারফেস ================= */}
        {currentView === 'gateway_verify' && selectedProduct && (
          <div style={{ maxWidth: '440px', margin: '20px auto', background: '#f8fafc', borderRadius: '16px', color: '#1e293b', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
            
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
              <span onClick={() => setCurrentView('gateway_methods')} style={{ cursor: 'pointer', color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>← Back</span>
              <div style={{ height: '30px', display: 'flex', alignItems: 'center' }}>
                <img
                  src={activeGateway === 'bKash' ? LOGO_BKASH : LOGO_NAGAD}
                  alt={activeGateway}
                  referrerPolicy="no-referrer"
                  style={{ height: '28px', objectFit: 'contain' }}
                />
              </div>
              <span onClick={resetFlow} style={{ cursor: 'pointer', color: '#64748b', fontSize: '18px' }}>✕</span>
            </div>

            {/* Hub Cart & Price Summary */}
            <div style={{ padding: '14px 18px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={LOGO_HUB_CART} alt="Hub Cart" referrerPolicy="no-referrer" style={{ width: '38px', height: '38px', objectFit: 'contain', borderRadius: '8px' }} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>Hub Cart</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{selectedProduct.title}</div>
                </div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>
                ৳ {selectedProduct.price}
              </div>
            </div>

            {/* লাল বা গোলাপি ইনস্ট্রাকশন বক্স */}
            <div style={{ margin: '16px', padding: '18px', borderRadius: '12px', color: '#ffffff', background: activeGateway === 'bKash' ? '#e2136e' : '#e52d27' }}>
              
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>ট্রানজেকশন আইডি দিন</label>
              <input
                type="text"
                placeholder="ট্রানজেকশন আইডি দিন"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '11px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#1e293b', fontWeight: 'bold', marginBottom: '14px' }}
              />

              <div style={{ fontSize: '12px', lineHeight: 1.8, opacity: 0.95 }}>
                <div>• {activeGateway === 'bKash' ? '*247# ডায়াল করে আপনার bKash মোবাইল মেনুতে যান অথবা bKash অ্যাপ খুলুন।' : '*167# ডায়াল করে আপনার NAGAD মোবাইল মেনুতে যান অথবা NAGAD অ্যাপে যান।'}</div>
                <div>• <b>Send Money</b> -এ ক্লিক করুন।</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                  <span>• এই নম্বরে টাকা পাঠান: <b>{activeGateway === 'bKash' ? BKASH_NUMBER : NAGAD_NUMBER}</b></span>
                  <button
                    type="button"
                    onClick={() => handleCopy(activeGateway === 'bKash' ? BKASH_NUMBER : NAGAD_NUMBER)}
                    style={{ background: '#fff', color: '#0f172a', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    {copied ? 'Copied!' : 'কপি'}
                  </button>
                </div>
                <div>• টাকার পরিমাণ: <b>{selectedProduct.price}</b></div>
                <div>• নিশ্চিত করে এখন আপনার {activeGateway === 'bKash' ? 'bKash' : 'NAGAD'} PIN লিখুন।</div>
                <div>• টাকা পাঠান এবং ট্রানজ্যাকশন আইডি কপি করুন।</div>
                <div>• ট্রানজ্যাকশন আইডি লিখে ভেরিফাই চাপুন।</div>
              </div>

            </div>

            <div style={{ padding: '0 16px 18px' }}>
              <button
                type="button"
                disabled={!trxId.trim() || loading}
                onClick={() => sendOrderToTelegram(activeGateway, trxId)}
                style={{ width: '100%', padding: '13px', background: activeGateway === 'bKash' ? '#c2185b' : '#b71c1c', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', opacity: !trxId.trim() ? 0.6 : 1 }}
              >
                {loading ? 'ভেরিফাই হচ্ছে...' : 'ভেরিফাই'}
              </button>
            </div>

          </div>
        )}

        {/* ================= ৫. সাকসেস স্ক্রিন ================= */}
        {currentView === 'success' && (
          <div style={{ maxWidth: '440px', margin: '30px auto', background: '#ffffff', borderRadius: '16px', color: '#1e293b', padding: '36px 20px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>✅</div>
            <h3 style={{ color: '#10b981', fontSize: '20px', margin: '0 0 8px', fontWeight: 'bold' }}>অর্ডার সফল হয়েছে!</h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>
              অর্ডারটি Hub Cart সিস্টেমে গৃহীত হয়েছে। খুব শীঘ্রই আপনার WhatsApp ({whatsappNumber}) এ যোগাযোগ করা হবে।
            </p>
            <button onClick={resetFlow} style={{ marginTop: '22px', padding: '10px 24px', background: '#0284c7', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              ঠিক আছে
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
