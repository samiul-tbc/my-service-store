'use client';
import { useState } from 'react';

// Product list (Ekhane image URL, name, description, price change korte parben)
const PRODUCTS = [
  {
    id: 1,
    title: 'Rooting & Magisk Setup',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=60',
    description: 'KernelSU / Magisk root, Bootloader unlock ebong SafetyNet bypass support.',
    price: 600,
  },
  {
    id: 2,
    title: 'Custom Tool Premium Key',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60',
    description: 'VIP Automation & Flash Tool-er official activation license key.',
    price: 1200,
  },
  {
    id: 3,
    title: 'Remote Diagnostics & Fix',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60',
    description: 'AnyDesk / UltraViewer er maddhome direct device issue solution.',
    price: 450,
  },
];

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderStep, setOrderStep] = useState('form'); // 'form' | 'gateway' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('');
  const [contact, setContact] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Apnar Personal Number (Bkash & Nagad)
  const BKASH_NUMBER = '01812080943';
  const NAGAD_NUMBER = '01812080943';

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAll = () => {
    setSelectedProduct(null);
    setOrderStep('form');
    setPaymentMethod('');
    setContact('');
    setCustomerName('');
    setTrxId('');
    setLoading(false);
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'TBC Pay') {
      sendOrder('TBC Pay (Manual Pay)', 'N/A (TBC Pay)');
    } else {
      setOrderStep('gateway');
    }
  };

  const sendOrder = async (method, transactionId) => {
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
          paymentMethod: method,
          trxId: transactionId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setOrderStep('success');
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
    <main style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', fontFamily: 'sans-serif', padding: '30px 16px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', color: '#38bdf8', margin: '0 0 8px' }}>TBC Store & Services</h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '15px' }}>Fast tools, remote services & instant key access</p>
        </header>

        {/* Product Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
          {PRODUCTS.map((prod) => (
            <div key={prod.id} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <img src={prod.image} alt={prod.title} style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '19px', margin: '0 0 8px', color: '#f1f5f9' }}>{prod.title}</h3>
                  <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.5, minHeight: '40px', margin: 0 }}>{prod.description}</p>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#10b981', marginBottom: '14px' }}>৳ {prod.price}</div>
                  <button
                    onClick={() => { setSelectedProduct(prod); setOrderStep('form'); }}
                    style={{ width: '100%', padding: '12px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    অর্ডার করুন
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Modal */}
        {selectedProduct && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000, overflowY: 'auto' }}>
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '16px', width: '100%', maxWidth: '420px', overflow: 'hidden', position: 'relative' }}>
              
              {/* Close Button */}
              <button onClick={resetAll} style={{ position: 'absolute', right: '14px', top: '14px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer', zIndex: 10 }}>✕</button>

              {/* Step 1: Customer Details & Method Selection */}
              {orderStep === 'form' && (
                <div style={{ padding: '24px' }}>
                  <h2 style={{ fontSize: '18px', color: '#f8fafc', margin: '0 0 6px' }}>অর্ডার বিবরণ</h2>
                  <p style={{ fontSize: '14px', color: '#38bdf8', margin: '0 0 16px' }}>{selectedProduct.title} (৳{selectedProduct.price})</p>

                  <form onSubmit={handleInitialSubmit}>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>আপনার নাম (Optional)</label>
                      <input
                        type="text"
                        placeholder="Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>WhatsApp নম্বর / Telegram Username *</label>
                      <input
                        required
                        type="text"
                        placeholder="017XXXXXXXX ba @username"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>পেমেন্ট মাধ্যম সিলেক্ট করুন *</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('bKash')}
                          style={{ padding: '12px 6px', background: paymentMethod === 'bKash' ? '#e2136e' : '#1e293b', color: '#fff', border: paymentMethod === 'bKash' ? '2px solid #fff' : '1px solid #334155', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
                        >
                          bKash
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('Nagad')}
                          style={{ padding: '12px 6px', background: paymentMethod === 'Nagad' ? '#e52d27' : '#1e293b', color: '#fff', border: paymentMethod === 'Nagad' ? '2px solid #fff' : '1px solid #334155', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
                        >
                          Nagad
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('TBC Pay')}
                          style={{ padding: '12px 6px', background: paymentMethod === 'TBC Pay' ? '#0284c7' : '#1e293b', color: '#fff', border: paymentMethod === 'TBC Pay' ? '2px solid #fff' : '1px solid #334155', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
                        >
                          TBC Pay
                        </button>
                      </div>
                    </div>

                    {paymentMethod === 'TBC Pay' && (
                      <div style={{ background: '#0369a122', border: '1px solid #0284c7', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', color: '#7dd3fc' }}>
                        ℹ️ <b>TBC Pay:</b> Ekhon kono taka dewa lagbe na. Order korar por amra apnar sathe jogajog kore payment collect korbo.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!paymentMethod || !contact || loading}
                      style={{ width: '100%', padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: (!paymentMethod || !contact) ? 0.5 : 1 }}
                    >
                      {loading ? 'Processing...' : paymentMethod === 'TBC Pay' ? 'অর্ডার কনফার্ম করুন (TBC Pay)' : `পেমেন্ট সম্পন্ন করুন (${paymentMethod})`}
                    </button>
                  </form>
                </div>
              )}

              {/* Step 2: Gateway UI (bKash & Nagad) */}
              {orderStep === 'gateway' && (
                <div style={{ background: '#f8fafc', color: '#1e293b' }}>
                  
                  {/* Top Bar */}
                  <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
                    <button onClick={() => setOrderStep('form')} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '14px', cursor: 'pointer' }}>← Back</button>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: paymentMethod === 'bKash' ? '#e2136e' : '#e52d27' }}>
                      {paymentMethod === 'bKash' ? 'bKash পেমেন্ট' : 'নগদ পেমেন্ট'}
                    </div>
                    <div style={{ width: '30px' }}></div>
                  </div>

                  {/* Summary Card */}
                  <div style={{ padding: '14px 20px', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #edf2f7' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedProduct.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>কন্টাক্ট: {contact}</div>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>৳ {selectedProduct.price}</div>
                  </div>

                  {/* Red/Pink Instruction Box */}
                  <div style={{ margin: '14px', padding: '16px', background: paymentMethod === 'bKash' ? '#e2136e' : '#e52d27', color: '#ffffff', borderRadius: '12px' }}>
                    
                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 'bold' }}>ট্রানজেকশন আইডি দিন</label>
                    <input
                      type="text"
                      placeholder="TrxID বসান"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '6px', border: 'none', color: '#1e293b', fontWeight: 'bold', fontSize: '15px', marginBottom: '14px' }}
                    />

                    {/* Instructions */}
                    <div style={{ fontSize: '12px', lineHeight: 1.7, opacity: 0.95 }}>
                      <div>• {paymentMethod === 'bKash' ? '*247# ডায়াল করুন অথবা bKash অ্যাপে যান' : '*167# ডায়াল করুন অথবা NAGAD অ্যাপে যান'}</div>
                      <div>• <b>Send Money</b> অপশনে ক্লিক করুন</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                        <span>• নম্বর: <b>{paymentMethod === 'bKash' ? BKASH_NUMBER : NAGAD_NUMBER}</b></span>
                        <button
                          type="button"
                          onClick={() => handleCopy(paymentMethod === 'bKash' ? BKASH_NUMBER : NAGAD_NUMBER)}
                          style={{ background: '#ffffff', color: '#000', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          {copied ? 'Copied!' : 'কপি'}
                        </button>
                      </div>
                      <div>• টাকার পরিমাণ: <b>{selectedProduct.price}</b></div>
                      <div>• পিন দিয়ে Send Money নিশ্চিত করুন এবং TrxID কপি করুন</div>
                      <div>• ওপরে TrxID লিখে নিচে ভেরিফাই বাটনে চাপুন</div>
                    </div>
                  </div>

                  {/* Verify Action Button */}
                  <div style={{ padding: '0 14px 16px' }}>
                    <button
                      type="button"
                      disabled={!trxId || loading}
                      onClick={() => sendOrder(paymentMethod, trxId)}
                      style={{ width: '100%', padding: '12px', background: paymentMethod === 'bKash' ? '#c2185b' : '#c62828', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', opacity: !trxId ? 0.6 : 1 }}
                    >
                      {loading ? 'ভেরিফাই হচ্ছে...' : 'ভেরিফাই ও অর্ডার কনফার্ম'}
                    </button>
                  </div>

                </div>
              )}

              {/* Step 3: Success Screen */}
              {orderStep === 'success' && (
                <div style={{ padding: '36px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '50px', marginBottom: '10px' }}>✅</div>
                  <h3 style={{ color: '#10b981', fontSize: '20px', margin: '0 0 8px' }}>অর্ডার সফল হয়েছে!</h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>
                    আপনার অর্ডারের তথ্য পৌঁছে গেছে। আমরা খুব শীঘ্রই আপনার WhatsApp / Telegram এ যোগাযোগ করব।
                  </p>
                  <button onClick={resetAll} style={{ marginTop: '22px', padding: '10px 24px', background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
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
