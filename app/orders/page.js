'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/ZRRgvqSQ/20261030-234214.png';
const SUPABASE_URL = 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

export default function OrderHistoryPage() {
  const [user, setUser] = useState(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manualSearched, setManualSearched] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('hubcart_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.phone) {
          fetchUserOrders(parsed.phone);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  const fetchUserOrders = async (phone) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/orders?whatsapp_number=eq.${phone.trim()}&select=*&order=id.desc`,
        {
          cache: 'no-store',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    setManualSearched(true);
    fetchUserOrders(phoneInput.trim());
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { label: 'Completed', bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80', border: 'rgba(34, 197, 94, 0.3)' };
      case 'processing':
        return { label: 'Processing', bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' };
      case 'verifying':
        return { label: 'Verifying', bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' };
      default:
        return { label: 'Pending', bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)' };
    }
  };

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '16px 14px 100px' }}>
      
      {/* পেজ হেডার */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <img
          src={LOGO_HUB_CART}
          alt="Hub Cart"
          style={{ width: '40px', height: '40px', objectFit: 'contain' }}
        />
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#f8fafc', margin: 0, letterSpacing: '-0.3px' }}>
            My Orders
          </h1>
          <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>
            আপনার সম্পূর্ণ অর্ডার হিস্ট্রি ও বর্তমান স্ট্যাটাস
          </p>
        </div>
      </div>

      {/* লগইন না থাকলে WhatsApp নম্বর দিয়ে খোঁজার অপশন */}
      {!user && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '18px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '0 0 10px', lineHeight: 1.4 }}>
            অ্যাকাউন্টে লগইন নেই? আপনার <strong>WhatsApp নম্বর</strong> দিয়ে অর্ডারগুলো খুঁজে বের করুন:
          </p>
          <form onSubmit={handleManualSearch} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              maxLength={11}
              placeholder="01XXXXXXXXX"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* অর্ডার লিস্ট লোডিং বা রেজাল্ট */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b', fontSize: '13px' }}>
          অর্ডার হিস্ট্রি লোড হচ্ছে...
        </div>
      ) : orders.length === 0 ? (
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(16px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '50px 20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>📦</div>
          <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: '0 0 4px' }}>কোনো পূর্ববর্তী অর্ডার নেই</h3>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px' }}>
            {manualSearched ? 'এই নম্বরে কোনো অর্ডার পাওয়া যায়নি।' : 'আপনি এখনো কোনো সার্ভিস বা প্যাকেজ অর্ডার করেননি।'}
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '13px',
            }}
          >
            সার্ভিসগুলো দেখুন
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {orders.map((ord) => {
            const badge = getStatusBadge(ord.status);
            return (
              <div
                key={ord.order_id || ord.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '16px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
                }}
              >
                {/* কার্ডের শীর্ষভাগ: অর্ডার আইডি ও স্ট্যাটাস ব্যাজ */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>ORDER ID</span>
                    <div style={{ fontSize: '14px', fontWeight: '900', color: '#38bdf8' }}>
                      {ord.order_id}
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '16px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    background: badge.bg,
                    color: badge.text,
                    border: `1px solid ${badge.border}`,
                  }}>
                    ● {badge.label}
                  </span>
                </div>

                {/* সার্ভিস ও প্রাইস */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#f8fafc' }}>
                    {ord.service_name}
                  </h3>
                  <span style={{ fontSize: '16px', fontWeight: '900', color: '#38bdf8' }}>
                    ৳{ord.price}
                  </span>
                </div>

                {/* পেমেন্ট বিবরণ */}
                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '14px' }}>
                  <div>মেথড: <strong style={{ color: '#cbd5e1' }}>{ord.payment_method}</strong></div>
                  {ord.trx_id && ord.trx_id !== 'N/A' && (
                    <div>TrxID: <code style={{ color: '#f8fafc', background: 'rgba(30, 41, 59, 0.8)', padding: '2px 6px', borderRadius: '4px' }}>{ord.trx_id}</code></div>
                  )}
                  {ord.created_at && (
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                      অর্ডারের তারিখ: {new Date(ord.created_at).toLocaleDateString('bn-BD')}
                    </div>
                  )}
                </div>

                {/* লাইভ ট্র্যাকিং বাটন */}
                <Link
                  href={`/track?id=${ord.order_id}`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    padding: '9px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  ⚡ লাইভ ট্র্যাকিং দেখুন →
                </Link>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
