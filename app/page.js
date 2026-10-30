'use client';
import { useState } from 'react';

// প্রোডাক্টের তালিকা (এখানে ছবি, নাম, বিবরণ ও দাম পরিবর্তন করতে পারবেন)
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

// বিকাশ ও নগদের আসল ভেক্টর লোগো
const BkashLogo = ({ width = 90 }) => (
  <svg width={width} viewBox="0 0 160 55" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M125 8L152 24L127 34L125 8Z" fill="#E2136E"/>
    <path d="M127 34L137 49L146 36L127 34Z" fill="#B31258"/>
    <path d="M127 34L110 40L125 8L127 34Z" fill="#E2136E"/>
    <text x="5" y="38" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="38" fill="#E2136E" letterSpacing="-1">bKash</text>
  </svg>
);

const NagadLogo = ({ width = 90 }) => (
  <svg width={width} viewBox="0 0 160 55" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="26" cy="27" r="20" fill="#E52D27"/>
    <path d="M26 12C21 12 17 18 19 23L31 39C32 40 35 39 35 37L31 22C30 18 28 12 26 12Z" fill="#F8B133"/>
    <circle cx="28" cy="18" r="3" fill="#FFF"/>
    <text x="55" y="38" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="32" fill="#E52D27">নগদ</text>
  </svg>
);

// Hub Cart ব্র্যান্ড লোগো
const HubCartLogo = ({ size = 65 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="30" fill="#000000"/>
    <path d="M45 45H75V85H125V45H155V155H125V115H75V155H45V45Z" fill="#FFFFFF"/>
    <path d="M110 50C150 50 175 75 175 110C175 145 150 170 110 170" stroke="#0099FF" strokeWidth="18" strokeLinecap="round"/>
    <circle cx="120" cy="155" r="9" fill="#00C8FF"/>
    <circle cx="150" cy="155" r="9" fill="#00C8FF"/>
  </svg>
);

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // পেজ ভিউ স্টেট: 'home' | 'info_page' | 'gateway_methods' | 'gateway_verify' | 'success'
  const [currentView, setCurrentView] = useState('home');
  const [paymentOption, setPaymentOption] = useState('Instant Pay'); // 'TBC Pay' | 'Instant Pay'
  const [activeGateway, setActiveGateway] = useState('bKash');       // 'bKash' | 'Nagad'
  
  // ফর্ম ডেটা
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // আপনার পেমেন্ট নম্বর
  const BKASH_NUMBER = '01812087109';
  const NAGAD_NUMBER = '01812080943';

  // বাংলাদেশি মোবাইল নম্বর ভ্যালিডেশন
  const validateBdNumber = (phone) => {
    const regex = /^(013|014|015|016|017|018|019)\d{8}$/;
    return regex.test(phone.trim());
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
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
      // TBC Pay: কোনো টাকা লাগবে না, সরাসরি অর্ডারে যাবে
      sendOrderToTelegram('TBC Pay (Manual Pay)', 'N/A (TBC Pay)');
    } else {
      // Instant Pay: ২য় ইন্টারফেসে নিয়ে যাবে
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
      alert('নেটওয়ার্ক সমস্যা। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।');
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

        {/* ================= 1. HOME PRODUCT CATALOG ================= */}
        {currentView === 'home' && (
          <div>
            <header style={{ textAlign: 'center', marginBottom: '35px', marginTop: '15px' }}>
              <div style={{ display: 'inline-block', marginBottom: '10px' }}>
                <HubCartLogo size={70} />
              </div>
              <h1 style={{ fontSize: '28px', color: '#38bdf8', margin: '0 0 6px', fontWeight: 'bold' }}>Hub Cart</h1>
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

        {/* ================= 2. CUSTOMER INFO & OPTION PAGE ================= */}
        {currentView === 'info_page' && selectedProduct && (
          <div style={{ maxWidth: '460px', margin: '15px auto', background: '#ffffff', borderRadius: '16px', color: '#1e293b', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
            
            {/* Header Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <button onClick={() => setCurrentView('home')} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '15px', cursor: 'pointer', fontWeight: 'bold' }}>← ফিরে যান</button>
              <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '16px' }}>অর্ডার ফর্ম</span>
              <button onClick={resetFlow} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ padding: '20px' }}>
              {/* Product Info Banner */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>{selectedProduct.title}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>ডিজিটাল সার্ভিস</div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0284c7' }}>৳{selectedProduct.price}</div>
              </div>

              <form onSubmit={handleInfoFormSubmit}>
                {/* Name */}
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

                {/* WhatsApp */}
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

                {/* Option Selector (TBC Pay vs Instant Pay) */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ background: '#ea580c', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>3</span>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>Select one option</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    
                    {/* 1st Option: TBC Pay (with Hub Cart 1st Pic Logo) */}
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
                      <div style={{ padding: '14px 10px 10px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                          <HubCartLogo size={48} />
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#0f172a' }}>TBC Pay</div>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '6px', textAlign: 'center', fontSize: '12px', color: '#64748b', borderTop: '1px solid #e2e8f0', fontWeight: 'bold' }}>
                        Wallet Pay
                      </div>
                    </div>

                    {/* 2nd Option: Instant Pay (bKash & Nagad Apps Logo) */}
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
                      <div style={{ padding: '14px 8px 10px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', marginBottom: '8px', height: '40px' }}>
                          <BkashLogo width={46} />
                          <NagadLogo width={46} />
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
                    ℹ️ <b>TBC Pay:</b> কোনো টাকা দেওয়া লাগবে না। Buy Now চাপলে অর্ডার সম্পন্ন হবে এবং আমরা পরবর্তীতে যোগাযোগ করে পেমেন্ট গ্রহণ করব।
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

        {/* ================= 3. INSTANT PAY GATEWAY INTERFACE (Pic 2) ================= */}
        {currentView === 'gateway_methods' && selectedProduct && (
          <div style={{ maxWidth: '440px', margin: '20px auto', background: '#f8fafc', borderRadius: '16px', color: '#1e293b', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', minHeight: '440px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            <div>
              {/* Top Icons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
                <span onClick={() => setCurrentView('info_page')} style={{ cursor: 'pointer', fontSize: '18px', color: '#64748b' }}>🏠</span>
                <span onClick={resetFlow} style={{ cursor: 'pointer', fontSize: '18px', color: '#64748b' }}>✕</span>
              </div>

              {/* Shop Logo & Name */}
              <div style={{ textAlign: 'center', padding: '24px 16px 14px' }}>
                <div style={{ display: 'inline-block', marginBottom: '6px' }}>
                  <HubCartLogo size={68} />
                </div>
                <div style={{ fontSize: '19px', fontWeight: 'bold', color: '#0f172a' }}>Hub Cart</div>
              </div>

              {/* Mobile Banking Blue Ribbon */}
              <div style={{ background: '#0284c7', color: '#fff', textAlign: 'center', padding: '8px', fontWeight: 'bold', fontSize: '13px', margin: '8px 18px', borderRadius: '4px' }}>
                মোবাইল ব্যাংকিং
              </div>

              {/* bKash & Nagad Select Buttons with Original Logos */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', padding: '12px 18px' }}>
                
                {/* bKash Button */}
                <div
                  onClick={() => {
                    setActiveGateway('bKash');
                    setCurrentView('gateway_verify');
                  }}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '16px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                  }}
                >
                  <BkashLogo width={85} />
                </div>

                {/* Nagad Button */}
                <div
                  onClick={() => {
                    setActiveGateway('Nagad');
                    setCurrentView('gateway_verify');
                  }}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '16px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                  }}
                >
                  <NagadLogo width={85} />
                </div>

              </div>
            </div>

            {/* Bottom Pay Action */}
            <div style={{ padding: '18px' }}>
              <button
                onClick={() => setCurrentView('gateway_verify')}
                style={{ width: '100%', padding: '13px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                পে করুন {selectedProduct.price}.00
              </button>
            </div>

          </div>
        )}

        {/* ================= 4. GATEWAY VERIFY INTERFACE (Pic 3 & 4) ================= */}
        {currentView === 'gateway_verify' && selectedProduct && (
          <div style={{ maxWidth: '440px', margin: '20px auto', background: '#f8fafc', borderRadius: '16px', color: '#1e293b', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
            
            {/* Top Gateway Navbar */}
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
              <span onClick={() => setCurrentView('gateway_methods')} style={{ cursor: 'pointer', color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>← Back</span>
              <div>
                {activeGateway === 'bKash' ? <BkashLogo width={80} /> : <NagadLogo width={80} />}
              </div>
              <span onClick={resetFlow} style={{ cursor: 'pointer', color: '#64748b', fontSize: '18px' }}>✕</span>
            </div>

            {/* Hub Cart & Price Summary Box */}
            <div style={{ padding: '14px 18px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <HubCartLogo size={36} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>Hub Cart</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{selectedProduct.title}</div>
                </div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>
                ৳ {selectedProduct.price}
              </div>
            </div>

            {/* Instruction Box: Pink for bKash / Red for Nagad */}
            <div style={{ margin: '16px', padding: '18px', borderRadius: '12px', color: '#ffffff', background: activeGateway === 'bKash' ? '#e2136e' : '#e52d27' }}>
              
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>ট্রানজেকশন আইডি দিন</label>
              <input
                type="text"
                placeholder="ট্রানজেকশন আইডি দিন"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '11px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#1e293b', fontWeight: 'bold', marginBottom: '14px' }}
              />

              {/* Instructions */}
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

            {/* Verify Action Button */}
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

        {/* ================= 5. SUCCESS SCREEN ================= */}
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
