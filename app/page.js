'use client';
import { useState } from 'react';

const PRODUCTS = [
  {
    id: 1,
    title: 'Android Firmware & Root Support',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=60',
    description: 'KernelSU / Magisk root, Bootloader unlock ebong SafetyNet bypass support.',
    price: 155,
  },
  {
    id: 2,
    title: 'Custom Tool Premium Key',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60',
    description: 'VIP Automation & Flash Tool-er official activation license key.',
    price: 350,
  },
  {
    id: 3,
    title: 'Remote Device Diagnostics',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60',
    description: 'AnyDesk / UltraViewer er maddhome direct device issue solution.',
    price: 500,
  },
];

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Checkout Steps: 'info' -> 'instant_methods' -> 'trx_gateway' -> 'success'
  const [checkoutStep, setCheckoutStep] = useState('info');
  const [selectedPaymentType, setSelectedPaymentType] = useState('Instant Pay'); // 'TBC Wallet' | 'Instant Pay'
  const [selectedSubMethod, setSelectedSubMethod] = useState('bKash'); // 'bKash' | 'Nagad'
  
  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [contact, setContact] = useState('');
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Numbers
  const BKASH_NUMBER = '01812087109';
  const NAGAD_NUMBER = '01812080943';

  const handleCopy = (num) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetOrder = () => {
    setSelectedProduct(null);
    setCheckoutStep('info');
    setSelectedPaymentType('Instant Pay');
    setSelectedSubMethod('bKash');
    setCustomerName('');
    setContact('');
    setTrxId('');
    setLoading(false);
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (selectedPaymentType === 'TBC Wallet') {
      submitOrder('TBC Wallet (Manual)', 'N/A (TBC Wallet)');
    } else {
      setCheckoutStep('instant_methods');
    }
  };

  const submitOrder = async (methodName, transactionId) => {
    setLoading(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: selectedProduct.title,
          price: selectedProduct.price,
          customerName: customerName || 'N/A',
          contact,
          paymentMethod: methodName,
          trxId: transactionId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCheckoutStep('success');
      } else {
        alert(data.error || 'Somossa hoyeche, abar chesta korun.');
      }
    } catch (err) {
      alert('Network error. Check internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#0b0f19', color: '#f8fafc', fontFamily: 'sans-serif', padding: '30px 16px' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h1 style={{ fontSize: '30px', color: '#38bdf8', margin: '0 0 6px', fontWeight: 'bold' }}>Hub Cart</h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '15px' }}>Fast digital service & automated delivery store</p>
        </header>

        {/* Product Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
          {PRODUCTS.map((prod) => (
            <div key={prod.id} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <img src={prod.image} alt={prod.title} style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '18px', margin: '0 0 8px', color: '#f1f5f9' }}>{prod.title}</h3>
                  <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.5, minHeight: '38px', margin: 0 }}>{prod.description}</p>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#10b981', marginBottom: '14px' }}>৳ {prod.price}</div>
                  <button
                    onClick={() => { setSelectedProduct(prod); setCheckoutStep('info'); }}
                    style={{ width: '100%', padding: '12px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    অর্ডার করুন
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Checkout */}
        {selectedProduct && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000, overflowY: 'auto' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '440px', overflow: 'hidden', position: 'relative', color: '#1e293b', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>

              {/* ---------------- STEP 1: INFO & OPTION SELECTION ---------------- */}
              {checkoutStep === 'info' && (
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>অর্ডার তথ্য দিন</h2>
                    <button onClick={resetOrder} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#64748b', cursor: 'pointer' }}>✕</button>
                  </div>

                  <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{selectedProduct.title}</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#0284c7' }}>৳{selectedProduct.price}</span>
                  </div>

                  <form onSubmit={handleInfoSubmit}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#334155' }}>আপনার নাম (Optional)</label>
                      <input
                        type="text"
                        placeholder="আপনার নাম"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#334155' }}>WhatsApp নম্বর / Telegram Username *</label>
                      <input
                        required
                        type="text"
                        placeholder="017XXXXXXXX বা @username"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>

                    {/* Step 3: Select one option (From Pic 1) */}
                    <div style={{ marginBottom: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ background: '#ea580c', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>3</span>
                        <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>Select one option</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        
                        {/* Option 1: TBC Wallet */}
                        <div
                          onClick={() => setSelectedPaymentType('TBC Wallet')}
                          style={{
                            border: selectedPaymentType === 'TBC Wallet' ? '2px solid #ea580c' : '1px solid #cbd5e1',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            position: 'relative',
                            background: '#fff'
                          }}
                        >
                          {selectedPaymentType === 'TBC Wallet' && (
                            <div style={{ position: 'absolute', top: 0, left: 0, background: '#ea580c', color: '#fff', fontSize: '10px', padding: '2px 6px', borderBottomRightRadius: '8px' }}>✓</div>
                          )}
                          <div style={{ padding: '20px 10px 14px', textAlign: 'center' }}>
                            <div style={{ fontSize: '28px' }}>💼</div>
                            <div style={{ fontWeight: 'bold', fontSize: '13px', marginTop: '4px', color: '#0f172a' }}>TBC ওয়ালেট</div>
                          </div>
                          <div style={{ background: '#f8fafc', padding: '6px', textAlign: 'center', fontSize: '12px', color: '#64748b', borderTop: '1px solid #e2e8f0', fontWeight: 'bold' }}>
                            Wallet Pay
                          </div>
                        </div>

                        {/* Option 2: Instant Pay */}
                        <div
                          onClick={() => setSelectedPaymentType('Instant Pay')}
                          style={{
                            border: selectedPaymentType === 'Instant Pay' ? '2px solid #ea580c' : '1px solid #cbd5e1',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            position: 'relative',
                            background: '#fff'
                          }}
                        >
                          {selectedPaymentType === 'Instant Pay' && (
                            <div style={{ position: 'absolute', top: 0, left: 0, background: '#ea580c', color: '#fff', fontSize: '10px', padding: '2px 6px', borderBottomRightRadius: '8px' }}>✓</div>
                          )}
                          <div style={{ padding: '16px 10px 10px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '10px', background: '#e2136e', color: '#fff', padding: '2px 4px', borderRadius: '3px', fontWeight: 'bold' }}>bKash</span>
                              <span style={{ fontSize: '10px', background: '#e52d27', color: '#fff', padding: '2px 4px', borderRadius: '3px', fontWeight: 'bold' }}>নগদ</span>
                            </div>
                            <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#0284c7' }}>Auto Payment</div>
                          </div>
                          <div style={{ background: '#f8fafc', padding: '6px', textAlign: 'center', fontSize: '12px', color: '#64748b', borderTop: '1px solid #e2e8f0', fontWeight: 'bold' }}>
                            Instant Pay
                          </div>
                        </div>

                      </div>
                    </div>

                    {selectedPaymentType === 'TBC Wallet' && (
                      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', color: '#1e40af' }}>
                        ℹ️ <b>TBC ওয়ালেট:</b> এখন কোনো টাকা দিতে হবে না। অর্ডার প্লেস হওয়ার পর আমরা সরাসরি আপনার সাথে যোগাযোগ করে পেমেন্ট রিসিভ করব।
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !contact}
                      style={{ width: '100%', padding: '13px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      {loading ? 'Processing...' : selectedPaymentType === 'TBC Wallet' ? 'কনফার্ম করুন (TBC Wallet)' : 'Buy Now'}
                    </button>
                  </form>
                </div>
              )}

              {/* ---------------- STEP 2: INSTANT PAY GATEWAY (From Pic 2) ---------------- */}
              {checkoutStep === 'instant_methods' && (
                <div style={{ background: '#f8fafc', minHeight: '430px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  
                  {/* Top Bar with Home & Close */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
                      <span onClick={() => setCheckoutStep('info')} style={{ cursor: 'pointer', fontSize: '18px', color: '#64748b' }}>🏠</span>
                      <span onClick={resetOrder} style={{ cursor: 'pointer', fontSize: '18px', color: '#64748b' }}>✕</span>
                    </div>

                    {/* Shop Brand Center */}
                    <div style={{ textAlign: 'center', padding: '24px 16px 14px' }}>
                      <div style={{ width: '64px', height: '64px', background: '#0284c7', color: '#fff', borderRadius: '50%', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                        HC
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>Hub Cart</div>
                    </div>

                    {/* Mobile Banking Bar */}
                    <div style={{ background: '#0284c7', color: '#fff', textAlign: 'center', padding: '8px', fontWeight: 'bold', fontSize: '13px', margin: '10px 18px', borderRadius: '4px' }}>
                      মোবাইল ব্যাংকিং
                    </div>

                    {/* Methods Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', padding: '10px 18px' }}>
                      
                      {/* bKash Selection */}
                      <div
                        onClick={() => setSelectedSubMethod('bKash')}
                        style={{
                          background: '#fff',
                          border: selectedSubMethod === 'bKash' ? '2px solid #e2136e' : '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '16px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}
                      >
                        <span style={{ fontSize: '18px', fontWeight: '900', color: '#e2136e' }}>bKash</span>
                      </div>

                      {/* Nagad Selection */}
                      <div
                        onClick={() => setSelectedSubMethod('Nagad')}
                        style={{
                          background: '#fff',
                          border: selectedSubMethod === 'Nagad' ? '2px solid #e52d27' : '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '16px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}
                      >
                        <span style={{ fontSize: '18px', fontWeight: '900', color: '#e52d27' }}>নগদ</span>
                      </div>

                    </div>
                  </div>

                  {/* Bottom Payment Bar */}
                  <div style={{ padding: '18px' }}>
                    <button
                      onClick={() => setCheckoutStep('trx_gateway')}
                      style={{ width: '100%', padding: '14px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      পে করুন {selectedProduct.price}.00
                    </button>
                  </div>

                </div>
              )}

              {/* ---------------- STEP 3: TRXID & INSTRUCTION GATEWAY (From Pic 3 & 4) ---------------- */}
              {checkoutStep === 'trx_gateway' && (
                <div style={{ background: '#f8fafc' }}>
                  
                  {/* Gateway Header */}
                  <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
                    <span onClick={() => setCheckoutStep('instant_methods')} style={{ cursor: 'pointer', color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>← Back</span>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: selectedSubMethod === 'bKash' ? '#e2136e' : '#e52d27' }}>
                      {selectedSubMethod === 'bKash' ? 'bKash' : 'নগদ'}
                    </div>
                    <span onClick={resetOrder} style={{ cursor: 'pointer', color: '#64748b', fontSize: '18px' }}>✕</span>
                  </div>

                  {/* Hub Cart & Price Summary Box */}
                  <div style={{ padding: '14px 18px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', background: '#0284c7', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>
                        HC
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>Hub Cart</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{selectedProduct.title}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>
                      ৳ {selectedProduct.price}
                    </div>
                  </div>

                  {/* Colored Box: Pink for bKash / Red for Nagad */}
                  <div style={{ margin: '16px', padding: '18px', borderRadius: '12px', color: '#fff', background: selectedSubMethod === 'bKash' ? '#e2136e' : '#e52d27' }}>
                    
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>ট্রানজেকশন আইডি দিন</label>
                    <input
                      type="text"
                      placeholder="ট্রানজেকশন আইডি দিন"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '11px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#1e293b', fontWeight: 'bold', marginBottom: '14px' }}
                    />

                    {/* Step-by-Step Instructions */}
                    <div style={{ fontSize: '12px', lineHeight: 1.8, opacity: 0.95 }}>
                      <div>• {selectedSubMethod === 'bKash' ? '*247# ডায়াল করে আপনার bKash মোবাইল মেনুতে যান অথবা bKash অ্যাপ খুলুন।' : '*167# ডায়াল করে আপনার NAGAD মোবাইল মেনুতে যান অথবা NAGAD অ্যাপে যান।'}</div>
                      <div>• <b>Send Money</b> -এ ক্লিক করুন।</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                        <span>• এই নম্বরে টাকা পাঠান: <b>{selectedSubMethod === 'bKash' ? BKASH_NUMBER : NAGAD_NUMBER}</b></span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedSubMethod === 'bKash' ? BKASH_NUMBER : NAGAD_NUMBER)}
                          style={{ background: '#fff', color: '#0f172a', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          {copied ? 'Copied!' : 'কপি'}
                        </button>
                      </div>
                      <div>• টাকার পরিমাণ: <b>{selectedProduct.price}</b></div>
                      <div>• নিশ্চিত করে এখন আপনার {selectedSubMethod === 'bKash' ? 'bKash' : 'NAGAD'} PIN লিখুন।</div>
                      <div>• টাকা পাঠান এবং ট্রানজ্যাকশন আইডি কপি করুন।</div>
                      <div>• ট্রানজ্যাকশন আইডি লিখে ভেরিফাই চাপুন।</div>
                    </div>

                  </div>

                  {/* Verify Action Button */}
                  <div style={{ padding: '0 16px 18px' }}>
                    <button
                      type="button"
                      disabled={!trxId || loading}
                      onClick={() => submitOrder(selectedSubMethod, trxId)}
                      style={{ width: '100%', padding: '13px', background: selectedSubMethod === 'bKash' ? '#c2185b' : '#b71c1c', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', opacity: !trxId ? 0.6 : 1 }}
                    >
                      {loading ? 'ভেরিফাই হচ্ছে...' : 'ভেরিফাই'}
                    </button>
                  </div>

                </div>
              )}

              {/* ---------------- STEP 4: ORDER SUCCESS ---------------- */}
              {checkoutStep === 'success' && (
                <div style={{ padding: '36px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
                  <h3 style={{ color: '#10b981', fontSize: '20px', margin: '0 0 8px', fontWeight: 'bold' }}>অর্ডার সফল হয়েছে!</h3>
                  <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>
                    অর্ডারটি Hub Cart সিস্টেমে গৃহীত হয়েছে। খুব শীঘ্রই আপনার WhatsApp / Telegram-এ কনফার্মেশন পেয়ে যাবেন।
                  </p>
                  <button onClick={resetOrder} style={{ marginTop: '22px', padding: '10px 24px', background: '#0284c7', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    ঠিক আছে
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </main>
  );
}
