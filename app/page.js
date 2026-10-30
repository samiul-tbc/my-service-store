'use client';
import { useState } from 'react';

// লোগো লিংকসমূহ
const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png';
const LOGO_BKASH = 'https://logos-world.net/wp-content/uploads/2024/10/Bkash-Logo.png';
const LOGO_NAGAD = 'https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png';

// ক্যাটাগরি তালিকা
const CATEGORIES = [
  { id: 'all', name: 'All Services', icon: '⚡' },
  { id: 'mobile', name: 'Mobile & Gadgets', icon: '💻📱' },
  { id: 'tools', name: 'License & Tools', icon: '🔑' },
  { id: 'remote', name: 'Remote Support', icon: '🛠️' },
];

// প্রোডাক্ট তালিকা (২ কলাম ডিসপ্লে এবং ডিসকাউন্ট প্রাইস সহ)
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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // পেজ ফ্লো স্টেট
  const [checkoutStep, setCheckoutStep] = useState(null); // 'info' | 'instant_methods' | 'gateway_verify' | 'success'
  const [paymentOption, setPaymentOption] = useState('Instant Pay'); // 'TBC Pay' | 'Instant Pay'
  const [activeGateway, setActiveGateway] = useState('bKash');       // 'bKash' | 'Nagad'
  const [bottomTab, setBottomTab] = useState('home');

  // ফর্ম স্টেট
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // পেমেন্ট নম্বর
  const BKASH_NUMBER = '01812087109';
  const NAGAD_NUMBER = '01812080943';

  // ১১ ডিজিট বাংলাদেশি নম্বর ভ্যালিডেশন
  const validateBdNumber = (phone) => {
    const regex = /^(013|014|015|016|017|018|019)\d{8}$/;
    return regex.test(phone.trim());
  };

  const handleCopy = (num) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startCheckout = (prod) => {
    setSelectedProduct(prod);
    setCheckoutStep('info');
    setPhoneError('');
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (!validateBdNumber(whatsappNumber)) {
      setPhoneError('নম্বর অবশ্যই 013, 014, 015, 016, 017, 018 বা 019 দিয়ে শুরু এবং মোট ১১ ডিজিট হতে হবে।');
      return;
    }
    setPhoneError('');

    if (paymentOption === 'TBC Pay') {
      sendOrderToTelegram('TBC Pay (Manual Pay)', 'N/A (TBC Pay)');
    } else {
      setCheckoutStep('instant_methods');
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
        setCheckoutStep('success');
      } else {
        alert(data.error || 'অর্ডার পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (err) {
      alert('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const closeCheckout = () => {
    setSelectedProduct(null);
    setCheckoutStep(null);
    setPaymentOption('Instant Pay');
    setActiveGateway('bKash');
    setCustomerName('');
    setWhatsappNumber('');
    setTelegramUsername('');
    setTrxId('');
    setPhoneError('');
    setLoading(false);
  };

  // ক্যাটাগরি ও সার্চ অনুযায়ী প্রোডাক্ট ফিল্টারিং
  const filteredProducts = PRODUCTS.filter((prod) => {
    const matchCat = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchSearch = prod.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: '90px' }}>
      
      {/* ================= ১. টপ হেডার (Sticky Header) ================= */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src={LOGO_HUB_CART}
            alt="Hub Cart"
            referrerPolicy="no-referrer"
            style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '8px' }}
          />
          <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#0f172a' }}>Hub Cart</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>🔍</span>
          <span onClick={() => alert('আপনার কার্ট দেখতে যেকোনো প্রোডাক্ট সিলেক্ট করুন')} style={{ fontSize: '22px', cursor: 'pointer', color: '#64748b', position: 'relative' }}>
            🛒
          </span>
          <button
            onClick={() => alert('লগইন সিস্টেমের ডাটাবেজ পরবর্তী ধাপে কানেক্ট করা হবে।')}
            style={{ background: '#4f46e5', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Login
          </button>
        </div>
      </header>

      {/* ================= ২. ব্লু গ্রেডিয়েন্ট ব্র্যান্ড ব্যানার ================= */}
      <section style={{ margin: '12px 14px', background: 'radial-gradient(circle at center, #1e3a8a 0%, #030712 100%)', borderRadius: '16px', padding: '24px 16px', textAlign: 'center', color: '#ffffff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '4px' }}>
          <img
            src={LOGO_HUB_CART}
            alt="Logo"
            referrerPolicy="no-referrer"
            style={{ width: '48px', height: '48px', objectFit: 'contain' }}
          />
          <h2 style={{ fontSize: '26px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>Hub Cart</h2>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: '#93c5fd', letterSpacing: '1px' }}>SHOP SMART • LIVE BETTER</p>
      </section>

      {/* ================= ৩. ক্যাটাগরি সেকশন ================= */}
      <section style={{ padding: '0 14px', marginBottom: '22px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px', color: '#1e293b' }}>Categories</h3>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px' }}>
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                minWidth: '105px',
                background: '#ffffff',
                border: selectedCategory === cat.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '14px 8px',
                textAlign: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ fontSize: '26px', marginBottom: '6px' }}>{cat.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: selectedCategory === cat.id ? '#2563eb' : '#475569' }}>
                {cat.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ৪. ২-কলাম প্রোডাক্ট গ্রিড ================= */}
      <section style={{ padding: '0 14px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 14px', color: '#1e293b' }}>All Products</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ width: '100%', height: '140px', background: '#0f172a', position: 'relative' }}>
                <img
                  src={prod.image}
                  alt={prod.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 10px', color: '#1e293b', minHeight: '34px', lineHeight: 1.3 }}>
                  {prod.title}
                </h4>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#dc2626' }}>৳{prod.price}</span>
                    {prod.originalPrice && (
                      <span style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '5px' }}>
                        ৳{prod.originalPrice}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => startCheckout(prod)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '1.5px solid #0f172a',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      padding: 0,
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ৫. ফ্লোটিং বটম অ্যাপ ন্যাভিগেশন বার ================= */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '62px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100 }}>
        <div onClick={() => setBottomTab('home')} style={{ textAlign: 'center', cursor: 'pointer', color: bottomTab === 'home' ? '#ef4444' : '#64748b' }}>
          <div style={{ fontSize: '20px' }}>🏠</div>
          <div style={{ fontSize: '11px', fontWeight: '600' }}>Home</div>
        </div>

        <div onClick={() => setBottomTab('categories')} style={{ textAlign: 'center', cursor: 'pointer', color: bottomTab === 'categories' ? '#ef4444' : '#64748b' }}>
          <div style={{ fontSize: '20px' }}>▦</div>
          <div style={{ fontSize: '11px', fontWeight: '600' }}>Categories</div>
        </div>

        <div onClick={() => setBottomTab('cart')} style={{ textAlign: 'center', cursor: 'pointer', color: bottomTab === 'cart' ? '#ef4444' : '#64748b' }}>
          <div style={{ fontSize: '20px' }}>🛒</div>
          <div style={{ fontSize: '11px', fontWeight: '600' }}>Cart</div>
        </div>

        <div onClick={() => setBottomTab('profile')} style={{ textAlign: 'center', cursor: 'pointer', color: bottomTab === 'profile' ? '#ef4444' : '#64748b' }}>
          <div style={{ fontSize: '20px' }}>👤</div>
          <div style={{ fontSize: '11px', fontWeight: '600' }}>Profile</div>
        </div>
      </nav>

      {/* ================= চেকআউট মডাল ও পেমেন্ট ফ্লো ================= */}
      {checkoutStep && selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', overflowY: 'auto' }}>
          <div style={{ background: '#ffffff', borderRadius: '18px', width: '100%', maxWidth: '440px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            {/* কাস্টমার ইনফো ফর্ম */}
            {checkoutStep === 'info' && (
              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 'bold' }}>অর্ডার তথ্য দিন</h3>
                  <button onClick={closeCheckout} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#64748b', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>{selectedProduct.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>ডিজিটাল সার্ভিস</div>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2563eb' }}>৳{selectedProduct.price}</div>
                </div>

                <form onSubmit={handleInfoSubmit}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>আপনার নাম *</label>
                    <input
                      required
                      type="text"
                      placeholder="নাম লিখুন"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>WhatsApp Number *</label>
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
                      <span style={{ display: 'block', color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{phoneError}</span>
                    )}
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>Telegram Username (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={telegramUsername}
                      onChange={(e) => setTelegramUsername(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>

                  {/* সিলেক্ট ওয়ান অপশন (TBC Pay vs Instant Pay) */}
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ background: '#ea580c', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>3</span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>Select one option</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      
                      {/* TBC Pay */}
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
                          <div style={{ position: 'absolute', top: 0, left: 0, background: '#ea580c', color: '#fff', fontSize: '9px', padding: '2px 6px', borderBottomRightRadius: '6px', fontWeight: 'bold' }}>✓</div>
                        )}
                        <div style={{ padding: '12px 6px 8px', textAlign: 'center' }}>
                          <img
                            src={LOGO_HUB_CART}
                            alt="Hub Cart"
                            referrerPolicy="no-referrer"
                            style={{ width: '38px', height: '38px', objectFit: 'contain', margin: '0 auto 4px', display: 'block' }}
                          />
                          <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#0f172a' }}>TBC Pay</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '5px', textAlign: 'center', fontSize: '11px', color: '#64748b', borderTop: '1px solid #e2e8f0', fontWeight: 'bold' }}>
                          Wallet Pay
                        </div>
                      </div>

                      {/* Instant Pay */}
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
                          <div style={{ position: 'absolute', top: 0, left: 0, background: '#ea580c', color: '#fff', fontSize: '9px', padding: '2px 6px', borderBottomRightRadius: '6px', fontWeight: 'bold' }}>✓</div>
                        )}
                        <div style={{ padding: '12px 6px 8px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', height: '38px', marginBottom: '4px' }}>
                            <img src={LOGO_BKASH} alt="bKash" referrerPolicy="no-referrer" style={{ height: '22px', maxWidth: '44px', objectFit: 'contain' }} />
                            <img src={LOGO_NAGAD} alt="Nagad" referrerPolicy="no-referrer" style={{ height: '24px', maxWidth: '44px', objectFit: 'contain' }} />
                          </div>
                          <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#0284c7' }}>Auto Payment</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '5px', textAlign: 'center', fontSize: '11px', color: '#64748b', borderTop: '1px solid #e2e8f0', fontWeight: 'bold' }}>
                          Instant Pay
                        </div>
                      </div>

                    </div>
                  </div>

                  {paymentOption === 'TBC Pay' && (
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', color: '#1e40af' }}>
                      ℹ️ <b>TBC Pay:</b> কোনো টাকা দেওয়া লাগবে না। Buy Now চাপলে সরাসরি অর্ডার প্লেস হবে এবং পরবর্তীতে যোগাযোগ করা হবে।
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '12px', background: '#ea580c', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {loading ? 'প্রসেসিং হচ্ছে...' : 'Buy Now'}
                  </button>
                </form>
              </div>
            )}

            {/* Instant Pay গেটওয়ে অপশন */}
            {checkoutStep === 'instant_methods' && (
              <div style={{ background: '#f8fafc', minHeight: '430px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
                    <span onClick={() => setCheckoutStep('info')} style={{ cursor: 'pointer', fontSize: '18px', color: '#64748b' }}>🏠</span>
                    <span onClick={closeCheckout} style={{ cursor: 'pointer', fontSize: '18px', color: '#64748b' }}>✕</span>
                  </div>

                  <div style={{ textAlign: 'center', padding: '20px 16px 10px' }}>
                    <img src={LOGO_HUB_CART} alt="Hub Cart" referrerPolicy="no-referrer" style={{ width: '64px', height: '64px', objectFit: 'contain', margin: '0 auto 6px', display: 'block' }} />
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>Hub Cart</div>
                  </div>

                  <div style={{ background: '#0284c7', color: '#ffffff', textAlign: 'center', padding: '8px', fontWeight: 'bold', fontSize: '13px', margin: '8px 18px', borderRadius: '4px' }}>
                    মোবাইল ব্যাংকিং
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px 18px' }}>
                    <div
                      onClick={() => { setActiveGateway('bKash'); setCheckoutStep('gateway_verify'); }}
                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', height: '50px' }}
                    >
                      <img src={LOGO_BKASH} alt="bKash" referrerPolicy="no-referrer" style={{ height: '30px', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>

                    <div
                      onClick={() => { setActiveGateway('Nagad'); setCheckoutStep('gateway_verify'); }}
                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', height: '50px' }}
                    >
                      <img src={LOGO_NAGAD} alt="Nagad" referrerPolicy="no-referrer" style={{ height: '32px', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                  </div>
                </div>

                <div style={{ padding: '18px' }}>
                  <button
                    onClick={() => setCheckoutStep('gateway_verify')}
                    style={{ width: '100%', padding: '13px', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    পে করুন {selectedProduct.price}.00
                  </button>
                </div>
              </div>
            )}

            {/* TrxID ও ইনস্ট্রাকশন ইন্টারফেস */}
            {checkoutStep === 'gateway_verify' && (
              <div style={{ background: '#f8fafc' }}>
                <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                  <span onClick={() => setCheckoutStep('instant_methods')} style={{ cursor: 'pointer', color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>← Back</span>
                  <div style={{ height: '28px', display: 'flex', alignItems: 'center' }}>
                    <img src={activeGateway === 'bKash' ? LOGO_BKASH : LOGO_NAGAD} alt={activeGateway} referrerPolicy="no-referrer" style={{ height: '26px', objectFit: 'contain' }} />
                  </div>
                  <span onClick={closeCheckout} style={{ cursor: 'pointer', color: '#64748b', fontSize: '18px' }}>✕</span>
                </div>

                <div style={{ padding: '12px 18px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={LOGO_HUB_CART} alt="Hub Cart" referrerPolicy="no-referrer" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#0f172a' }}>Hub Cart</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{selectedProduct.title}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#0f172a' }}>৳{selectedProduct.price}</div>
                </div>

                <div style={{ margin: '14px', padding: '16px', borderRadius: '12px', color: '#ffffff', background: activeGateway === 'bKash' ? '#e2136e' : '#e52d27' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>ট্রানজেকশন আইডি দিন</label>
                  <input
                    type="text"
                    placeholder="ট্রানজেকশন আইডি দিন"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '11px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#1e293b', fontWeight: 'bold', marginBottom: '12px' }}
                  />

                  <div style={{ fontSize: '12px', lineHeight: 1.7, opacity: 0.95 }}>
                    <div>• {activeGateway === 'bKash' ? '*247# ডায়াল করে bKash মেনু বা অ্যাপে যান।' : '*167# ডায়াল করে NAGAD মেনু বা অ্যাপে যান।'}</div>
                    <div>• <b>Send Money</b> -এ ক্লিক করুন।</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}>
                      <span>• নম্বর: <b>{activeGateway === 'bKash' ? BKASH_NUMBER : NAGAD_NUMBER}</b></span>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeGateway === 'bKash' ? BKASH_NUMBER : NAGAD_NUMBER)}
                        style={{ background: '#ffffff', color: '#0f172a', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        {copied ? 'Copied!' : 'কপি'}
                      </button>
                    </div>
                    <div>• টাকার পরিমাণ: <b>{selectedProduct.price}</b></div>
                    <div>• পিন দিয়ে কনফার্ম করে TrxID কপি করে উপরে বসান।</div>
                  </div>
                </div>

                <div style={{ padding: '0 14px 16px' }}>
                  <button
                    type="button"
                    disabled={!trxId.trim() || loading}
                    onClick={() => sendOrderToTelegram(activeGateway, trxId)}
                    style={{ width: '100%', padding: '13px', background: activeGateway === 'bKash' ? '#c2185b' : '#b71c1c', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', opacity: !trxId.trim() ? 0.6 : 1 }}
                  >
                    {loading ? 'ভেরিফাই হচ্ছে...' : 'ভেরিফাই'}
                  </button>
                </div>
              </div>
            )}

            {/* সাকসেস মেসেজ */}
            {checkoutStep === 'success' && (
              <div style={{ padding: '36px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
                <h3 style={{ color: '#10b981', fontSize: '20px', margin: '0 0 8px', fontWeight: 'bold' }}>অর্ডার সফল হয়েছে!</h3>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>
                  অর্ডারটি সিস্টেমে জমা হয়েছে। আপনার WhatsApp নম্বরে ({whatsappNumber}) দ্রুত যোগাযোগ করা হবে।
                </p>
                <button onClick={closeCheckout} style={{ marginTop: '22px', padding: '10px 24px', background: '#0284c7', border: 'none', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  ঠিক আছে
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
