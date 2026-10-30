'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png';
const SUPABASE_URL = 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';
const WHATSAPP_NUMBER = '8801893432478'; // আপনার WhatsApp নম্বর

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // অর্ডার মডাল ও ফর্মের স্টেট
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // ফর্ম ডাটা
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [trxId, setTrxId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // প্রোডাক্ট ও ইউজার ডাটা ফেচ
  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}&select=*`, {
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
    fetchProduct();

    // ইউজার লগইন থাকলে নাম ও নম্বর অটোমেটিক বসানো
    const savedUser = localStorage.getItem('hubcart_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) setCustomerName(parsed.name);
        if (parsed.phone) setWhatsappNumber(parsed.phone);
      } catch (e) {
        console.error(e);
      }
    }
  }, [id]);

  // Telegram API-তে অর্ডার পাঠানোর হ্যান্ডলার
  const handleTelegramOrder = async (e) => {
    e.preventDefault();
    setOrderSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: product.title,
          price: product.price,
          customerName: customerName.trim(),
          whatsappNumber: whatsappNumber.trim(),
          telegramUsername: telegramUsername.trim() || 'দেওয়া হয়নি',
          paymentMethod: paymentMethod,
          trxId: trxId.trim() || 'N/A',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'অর্ডার পাঠাতে সমস্যা হয়েছে');
      }

      setOrderSuccess(true);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setOrderSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '80px 20px', textAlign: 'center', color: '#64748b' }}>প্যাকেজ বিবরণ লোড হচ্ছে...</div>;
  }

  if (!product) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#94a3b8' }}>
        <h3>প্রোডাক্টটি পাওয়া যায়নি!</h3>
        <Link href="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>← ফিরে যান</Link>
      </div>
    );
  }

  const whatsappMsg = encodeURIComponent(`হ্যালো, আমি Hub Cart থেকে এই সার্ভিসটি নিতে চাই:\nসার্ভিস: ${product.title}\nমূল্য: ৳${product.price}`);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 12px',
    borderRadius: '10px',
    background: 'rgba(30, 41, 59, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontSize: '13px',
    outline: 'none',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '14px 14px 100px' }}>
      
      {/* ব্যাক বাটন */}
      <button
        onClick={() => router.back()}
        style={{ border: 'none', background: 'none', color: '#94a3b8', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', padding: '4px 0', marginBottom: '12px' }}
      >
        ← পেছনে যান
      </button>

      {/* প্রোডাক্ট কার্ড */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}>
        <div style={{ width: '100%', height: '240px', background: '#0b0f19', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={product.image || LOGO_HUB_CART}
            alt={product.title}
            onError={(e) => { e.currentTarget.src = LOGO_HUB_CART; }}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        <div style={{ padding: '20px' }}>
          <span style={{ fontSize: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {product.category || 'Service'}
          </span>

          <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '12px 0 8px', color: '#f8fafc' }}>
            {product.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '18px' }}>
            <span style={{ fontSize: '24px', fontWeight: '900', color: '#38bdf8' }}>৳{product.price}</span>
            {product.original_price && (
              <span style={{ fontSize: '13px', color: '#64748b', textDecoration: 'line-through' }}>৳{product.original_price}</span>
            )}
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 6px', color: '#94a3b8', textTransform: 'uppercase' }}>বিস্তারিত বিবরণ:</h4>
            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', whiteSpace: 'pre-line', margin: 0 }}>
              {product.description || 'এই প্যাকেজের জন্য কোনো অতিরিক্ত বিবরণ দেওয়া হয়নি।'}
            </p>
          </div>
        </div>
      </div>

      {/* নিচের ফিক্সড অর্ডার বার */}
      <div style={{
        position: 'fixed',
        bottom: 60,
        left: 0,
        right: 0,
        background: 'rgba(11, 15, 25, 0.92)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '10px 16px',
        display: 'flex',
        gap: '10px',
        zIndex: 90,
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            textDecoration: 'none',
            background: '#16a34a',
            color: '#ffffff',
            textAlign: 'center',
            padding: '12px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <span>💬</span> WhatsApp অর্ডার
        </a>

        <button
          onClick={() => { setShowOrderModal(true); setOrderSuccess(false); setErrorMsg(''); }}
          style={{
            flex: 1,
            border: 'none',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#ffffff',
            padding: '12px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
          }}
        >
          <span>⚡</span> এখনই কিনুন
        </button>
      </div>

      {/* সাইবার-গ্লাস অর্ডার মডাল (Telegram Bot Integrated) */}
      {showOrderModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '420px',
            background: '#0f172a',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '24px',
            padding: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* ক্লোজ বাটন */}
            <button
              onClick={() => setShowOrderModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255,255,255,0.05)',
                border: 'none',
                color: '#94a3b8',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>

            {orderSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#4ade80', fontSize: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  ✓
                </div>
                <h3 style={{ color: '#f8fafc', margin: '0 0 8px', fontSize: '18px' }}>অর্ডার সফল হয়েছে!</h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 20px', lineHeight: 1.5 }}>
                  আপনার অর্ডার বিবরণ সরাসরি আমাদের টেলিগ্রাম সিস্টেমে জমা পড়েছে। খুব দ্রুত আপনার সাথে যোগাযোগ করা হবে।
                </p>
                <button
                  onClick={() => setShowOrderModal(false)}
                  style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
                >
                  ঠিক আছে
                </button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: '17px', color: '#f8fafc', fontWeight: 'bold' }}>অর্ডার কনফার্মেশন</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 41, 59, 0.5)', padding: '8px 12px', borderRadius: '10px', marginTop: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 'bold' }}>{product.title}</span>
                    <span style={{ fontSize: '14px', color: '#38bdf8', fontWeight: '900' }}>৳{product.price}</span>
                  </div>
                </div>

                {errorMsg && (
                  <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', borderRadius: '8px', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleTelegramOrder}>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>আপনার নাম *</label>
                    <input required type="text" placeholder="যেমন: Samiul Islam" value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={inputStyle} />
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>WhatsApp নম্বর *</label>
                    <input required type="text" maxLength={11} placeholder="017XXXXXXXX" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} style={inputStyle} />
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>Telegram ইউজারনেম (@username)</label>
                    <input type="text" placeholder="@yourusername (যদি থাকে)" value={telegramUsername} onChange={(e) => setTelegramUsername(e.target.value)} style={inputStyle} />
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>পেমেন্ট মেথড *</label>
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={inputStyle}>
                      <option value="bKash">bKash (বিকাশ)</option>
                      <option value="Nagad">Nagad (নগদ)</option>
                      <option value="Rocket">Rocket (রকেট)</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>ট্রানজেকশন আইডি (TrxID) / পেমেন্ট নম্বর</label>
                    <input type="text" placeholder="টাকা পাঠিয়ে TrxID লিখুন" value={trxId} onChange={(e) => setTrxId(e.target.value)} style={inputStyle} />
                  </div>

                  <button
                    type="submit"
                    disabled={orderSubmitting}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
                    }}
                  >
                    {orderSubmitting ? 'অর্ডার পাঠানো হচ্ছে...' : '✈️ অর্ডার সাবমিট করুন'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
