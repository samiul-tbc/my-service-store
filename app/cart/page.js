'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png';
const WHATSAPP_NUMBER = '8801893432478'; // এখানে আপনার WhatsApp নম্বর দিন

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('hubcart_cart');
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  const updateQuantity = (id, change) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = (item.quantity || 1) + change;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('hubcart_cart', JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('hubcart_cart', JSON.stringify(updated));
  };

  const clearCart = () => {
    if (confirm('আপনি কি কার্ট খালি করতে চান?')) {
      setCartItems([]);
      localStorage.removeItem('hubcart_cart');
    }
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + Number(item.price || 0) * (item.quantity || 1), 0);

  // সম্পূর্ণ কার্ট অর্ডার মেসেজ জেনারেটর
  const handleWhatsAppCheckout = () => {
    let orderText = `🛒 *Hub Cart Order Summary*:\n\n`;
    cartItems.forEach((item, idx) => {
      orderText += `${idx + 1}. ${item.title} (x${item.quantity || 1}) - ৳${Number(item.price) * (item.quantity || 1)}\n`;
    });
    orderText += `\n*সর্বমোট মূল্য:* ৳${totalAmount}\n\nআমি এই অর্ডারটি কনফার্ম করতে চাই।`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderText)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>কার্ট লোড হচ্ছে...</div>;
  }

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '14px 14px 100px' }}>
      
      {/* টাইটেল বার */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#f8fafc', margin: '0 0 2px' }}>
            Shopping Cart
          </h1>
          <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>
            {cartItems.length} টি সার্ভিস কার্টে রয়েছে
          </p>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            style={{ background: 'transparent', border: 'none', color: '#f87171', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Clear All
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        /* খালি কার্ট স্টেট */
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '50px 20px',
          textAlign: 'center',
          marginTop: '20px',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(30, 41, 59, 0.8)',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h3 style={{ fontSize: '17px', color: '#f8fafc', margin: '0 0 6px' }}>আপনার কার্ট খালি</h3>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 22px' }}>কোনো সার্ভিস সিলেক্ট করেননি। হোমপেজ থেকে প্যাকেজ বেছে নিন।</p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '13px',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.35)',
            }}
          >
            সার্ভিসগুলো দেখুন
          </Link>
        </div>
      ) : (
        /* কার্ট আইটেম তালিকা */
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <img
                  src={item.image || LOGO_HUB_CART}
                  alt={item.title}
                  onError={(e) => { e.currentTarget.src = LOGO_HUB_CART; }}
                  style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover', background: '#0b0f19' }}
                />

                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc', margin: '0 0 4px', lineHeight: 1.3 }}>
                    {item.title}
                  </h4>
                  <div style={{ fontSize: '14px', fontWeight: '900', color: '#38bdf8' }}>
                    ৳{item.price}
                  </div>
                </div>

                {/* কোয়ান্টিটি ও ডিলিট বাটন */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', padding: '4px 8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '12px', color: '#f8fafc', padding: '0 4px', fontWeight: 'bold' }}>
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', padding: '4px 8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '6px' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* অর্ডারের সারাংশ কার্ড */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '18px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
              <span>সাবটোটাল</span>
              <span>৳{totalAmount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8', marginBottom: '14px' }}>
              <span>সার্ভিস ফি</span>
              <span style={{ color: '#4ade80' }}>ফ্রি</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '900', color: '#f8fafc', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
              <span>সর্বমোট</span>
              <span style={{ color: '#38bdf8' }}>৳{totalAmount}</span>
            </div>
          </div>

          {/* চেকআউট বাটন */}
          <button
            onClick={handleWhatsAppCheckout}
            style={{
              width: '100%',
              padding: '14px',
              background: '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '14px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(22, 163, 74, 0.35)',
            }}
          >
            💬 WhatsApp-এ অর্ডার সম্পন্ন করুন
          </button>
        </div>
      )}

    </div>
  );
}
