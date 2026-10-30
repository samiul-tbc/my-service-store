'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png';
const LOGO_BKASH = 'https://logos-world.net/wp-content/uploads/2024/10/Bkash-Logo.png';
const LOGO_NAGAD = 'https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png';

const SUPABASE_URL = 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // চেকআউট স্টেট
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('info'); // info, instant_methods, gateway_verify, success
  const [paymentOption, setPaymentOption] = useState('Instant Pay');
  const [activeGateway, setActiveGateway] = useState('bKash');

  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [trxId, setTrxId] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const BKASH_NUMBER = '01812087109';
  const NAGAD_NUMBER = '01812080943';

  // ডাটাবেজ থেকে নির্দিষ্ট প্রোডাক্ট লোড করা
  useEffect(() => {
    async function fetchSingleProduct() {
      if (!productId) return;
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${productId}&select=*`, {
          cache: 'no-store',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProduct(data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSingleProduct();
  }, [productId]);

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
    setOrderLoading(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: product.title,
          price: product.price,
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
        alert('অর্ডার পাঠাতে সমস্যা হয়েছে, আবার চেষ্টা করুন।');
      }
    } catch (err) {
      alert('নেটওয়ার্ক সমস্যা!');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
        প্রোডাক্ট লোড হচ্ছে...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3 style={{ color: '#0f172a' }}>প্রোডাক্টটি পাওয়া যায়নি!</h3>
        <Link href="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}>
          ← হোমপেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '90px', background: '#ffffff', minHeight: '100vh' }}>
      
      {/* টপ ব্যাক বাটন */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #f1f5f9' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px 8px' }}>
          ←
        </button>
        <span style={{ fontSize: '15px', fontWeight: '600', color: '#334155' }}>প্রোডাক্ট বিবরণ</span>
      </div>

      {/* বড় প্রোডাক্ট কভার ছবি */}
      <div style={{ width: '100%', height: '300px', background: '#0f172a', overflow: 'hidden' }}>
        <img
          src={product.image || LOGO_HUB_CART}
          alt={product.title}
          onError={(e) => { e.target.src = LOGO_HUB_CART; }}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* প্রোডাক্টের মূল তথ্য */}
      <div style={{ padding: '18px 16px' }}>
        <span style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
          {product.category}
        </span>

        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 10px', color: '#0f172a', lineHeight: 1.4 }}>
          {product.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>৳{product.price}</span>
          {product.original_price && (
            <span style={{ fontSize: '15px', color: '#94a3b8', textDecoration: 'line-through' }}>
              ৳{product.original_price}
            </span>
          )}
        </div>

        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', margin: '0 0 8px' }}>সার্ভিস বিবরণ:</h3>
          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>
            {product.description || 'এই সার্ভিসের জন্য কোনো অতিরিক্ত বিবরণ দেওয়া হয়নি।'}
          </p>
        </div>
      </div>

      {/* ফিক্সড বটম Buy Now বার */}
      <div style={{ position: 'fixed', bottom: '62px', left: 0, right: 0, background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '12px 16px', display: 'flex', justifyContent: 'center', zIndex: 90 }}>
        <div style={{ width: '100%', maxWidth: '600px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>সর্বমোট মূল্য</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>৳{product.price}</span>
          </div>
          <button
            onClick={() => { setShowCheckout(true); setCheckoutStep('info'); }}
            style={{ flex: 1, padding: '12px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* চেকআউট মডাল */}
      {showCheckout && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', overflowY: 'auto' }}>
          <div style={{ background: '#ffffff', borderRadius: '18px', width: '100%', maxWidth: '440px', overflow: 'hidden' }}>
            
            {checkoutStep === 'info' && (
              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 'bold' }}>অর্ডার তথ্য দিন</h3>
                  <button onClick={() => setShowCheckout(false)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#64748b', cursor: 'pointer' }}>✕</button>
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

                  <button type="submit" disabled={orderLoading} style={{ width: '100%', padding: '12px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {orderLoading ? 'প্রসেসিং...' : 'এগিয়ে যান'}
                  </button>
                </form>
              </div>
            )}

            {checkoutStep === 'instant_methods' && (
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span onClick={() => setCheckoutStep('info')} style={{ cursor: 'pointer', color: '#64748b' }}>← Back</span>
                  <span onClick={() => setShowCheckout(false)} style={{ cursor: 'pointer', color: '#64748b' }}>✕</span>
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
                  <span onClick={() => setShowCheckout(false)} style={{ cursor: 'pointer', color: '#64748b' }}>✕</span>
                </div>
                <div style={{ background: activeGateway === 'bKash' ? '#e2136e' : '#e52d27', color: '#fff', padding: '16px', borderRadius: '12px' }}>
                  <input type="text" placeholder="TrxID দিন" value={trxId} onChange={(e) => setTrxId(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '6px', border: 'none', marginBottom: '10px' }} />
                  <div style={{ fontSize: '12px', lineHeight: 1.7 }}>
                    নম্বর: <b>{activeGateway === 'bKash' ? BKASH_NUMBER : NAGAD_NUMBER}</b>
                    <button type="button" onClick={() => handleCopy(activeGateway === 'bKash' ? BKASH_NUMBER : NAGAD_NUMBER)} style={{ marginLeft: '8px', padding: '2px 6px', background: '#fff', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                      {copied ? 'Copied' : 'কপি'}
                    </button>
                    <br />মূল্য: ৳{product.price}
                  </div>
                </div>
                <button type="button" disabled={!trxId.trim() || orderLoading} onClick={() => sendOrder(activeGateway, trxId)} style={{ width: '100%', marginTop: '14px', padding: '12px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {orderLoading ? 'ভেরিফাই হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
                </button>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div style={{ padding: '34px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '44px' }}>✅</div>
                <h3 style={{ color: '#10b981', margin: '10px 0 6px' }}>অর্ডার সফল হয়েছে!</h3>
                <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>শীঘ্রই আপনার WhatsApp নম্বরে যোগাযোগ করা হবে।</p>
                <button onClick={() => { setShowCheckout(false); router.push('/'); }} style={{ marginTop: '20px', padding: '10px 24px', background: '#0284c7', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}>হোমপেজে যান</button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
