'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/ZRRgvqSQ/20261030-234214.png';
const LOGO_WHATSAPP = 'https://download.logo.wine/logo/WhatsApp/WhatsApp-Logo.wine.png';
const SUPABASE_URL = 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';
const WHATSAPP_NUMBER = '8801893432478'; // আপনার WhatsApp নম্বর

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // ইনপুট স্টেট
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !whatsappNumber.trim()) {
      setErrorMsg('দয়া করে নাম ও WhatsApp নম্বর পূরণ করুন');
      return;
    }

    const orderData = {
      productId: product.id,
      serviceName: product.title,
      price: product.price,
      customerName: customerName.trim(),
      whatsappNumber: whatsappNumber.trim(),
      telegramUsername: telegramUsername.trim() || 'নেই',
    };

    localStorage.setItem('hubcart_current_order', JSON.stringify(orderData));
    router.push('/processedorder');
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

  const whatsappMsg = encodeURIComponent(
    `হ্যালো, আমি Hub Cart থেকে সার্ভিস নিতে চাই:\n\nসার্ভিস: ${product.title}\nমূল্য: ৳${product.price}\nলিংক: ${typeof window !== 'undefined' ? window.location.href : ''}`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 14px',
    borderRadius: '12px',
    background: 'rgba(30, 41, 59, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontSize: '13px',
    outline: 'none',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '14px 14px 110px' }}>
      
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
          <span style={{ fontSize: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>
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

      {/* নিচের ফিক্সড অর্ডার বার: WhatsApp Order + এখনই কিনুন */}
      <div style={{
        position: 'fixed',
        bottom: 60,
        left: 0,
        right: 0,
        background: 'rgba(11, 15, 25, 0.94)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '10px 14px',
        display: 'flex',
        gap: '10px',
        zIndex: 90,
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        {/* ১. বাম পাশে WhatsApp Order বাটন */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            textDecoration: 'none',
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1.5px solid rgba(34, 197, 94, 0.5)',
            color: '#4ade80',
            textAlign: 'center',
            padding: '12px 8px',
            borderRadius: '14px',
            fontWeight: 'bold',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)',
          }}
        >
          <img
            src={LOGO_WHATSAPP}
            alt="WhatsApp"
            style={{ width: '22px', height: '22px', objectFit: 'contain' }}
          />
          <span>WhatsApp Order</span>
        </a>

        {/* ২. ডান পাশে এখনই কিনুন বাটন */}
        <button
          onClick={() => { setShowOrderModal(true); setErrorMsg(''); }}
          style={{
            flex: 1,
            border: 'none',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#ffffff',
            padding: '12px 8px',
            borderRadius: '14px',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
          }}
        >
          <span>⚡</span>
          <span>এখনই কিনুন</span>
        </button>
      </div>

      {/* ইনফো মডাল */}
      {showOrderModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            background: '#0f172a',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '24px',
            padding: '24px',
            position: 'relative',
          }}>
            <button
              onClick={() => setShowOrderModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontSize: '14px' }}
            >
              ✕
            </button>

            <h3 style={{ margin: '0 0 4px', fontSize: '18px', color: '#f8fafc', fontWeight: 'bold' }}>অর্ডার কনফার্মেশন</h3>
            <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#64748b' }}>অর্ডারের জন্য প্রয়োজনীয় তথ্য দিন</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 41, 59, 0.6)', padding: '10px 14px', borderRadius: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 'bold' }}>{product.title}</span>
              <span style={{ fontSize: '16px', color: '#38bdf8', fontWeight: '900' }}>৳{product.price}</span>
            </div>

            {errorMsg && (
              <div style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', borderRadius: '8px', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleProceedToPayment}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>আপনার নাম *</label>
                <input required type="text" placeholder="আপনার নাম লিখুন" value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={inputStyle} />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>WhatsApp নম্বর *</label>
                <input required type="text" maxLength={11} placeholder="01XXXXXXXXX" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} style={inputStyle} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>Telegram ইউজারনেম (@username)</label>
                <input type="text" placeholder="@username (যদি থাকে)" value={telegramUsername} onChange={(e) => setTelegramUsername(e.target.value)} style={inputStyle} />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '13px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
                }}
              >
                অর্ডার Confirm করুন →
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
