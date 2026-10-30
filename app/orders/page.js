'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/ZRRgvqSQ/20261030-234214.png';
const SUPABASE_URL = 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';
const SUPPORT_WHATSAPP = '8801893432478'; // আপনার হেল্পলাইন নম্বর

export default function OrderHistoryPage() {
  const [user, setUser] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('hubcart_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.phone) {
          fetchOrders(parsed.phone);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  // WhatsApp নম্বর অথবা সরাসরি Order ID (HC-XXXX) দিয়ে অর্ডার খোঁজা
  const fetchOrders = async (queryText) => {
    const query = queryText.trim();
    if (!query) return;

    setLoading(true);
    try {
      const isOrderId = query.toUpperCase().startsWith('HC-');
      const filter = isOrderId
        ? `order_id=eq.${query.toUpperCase()}`
        : `whatsapp_number=eq.${query}`;

      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/orders?${filter}&select=*&order=id.desc`,
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearched(true);
    fetchOrders(searchInput.trim());
  };

  // স্ট্যাটাস অনুযায়ী ব্যাজ (Cancelled সহ)
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { label: 'Completed', bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80', border: 'rgba(34, 197, 94, 0.3)' };
      case 'processing':
        return { label: 'Processing', bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' };
      case 'verifying':
        return { label: 'Verifying', bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' };
      case 'cancelled':
        return { label: 'Cancelled', bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
      default:
        return { label: 'Pending', bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)' };
    }
  };

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '16px 14px 100px' }}>
      
      {/* পেজ হেডার */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

        {/* রিফ্রেশ বাটন */}
        <button
          onClick={() => {
            if (user?.phone) fetchOrders(user.phone);
            else if (searchInput) fetchOrders(searchInput);
          }}
          style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#38bdf8', padding: '6px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          title="রিফ্রেশ করুন"
        >
          🔄
        </button>
      </div>

      {/* সার্চ বক্স: লগইন না থাকলে অথবা অন্য নম্বর/অর্ডার আইডি দিয়ে খুঁজতে */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '18px',
        padding: '14px',
        marginBottom: '20px',
      }}>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 10px' }}>
          {user ? 'অন্য কোনো অর্ডার দেখতে নম্বর বা Order ID লিখুন:' : 'অর্ডারের বিবরণ দেখতে WhatsApp নম্বর বা Order ID দিন:'}
        </p>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="01XXXXXXXXX অথবা HC-XXXX"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
            Find
          </button>
        </form>
      </div>

      {/* অর্ডার তালিকা লোডিং বা কার্ড ভিউ */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b', fontSize: '13px' }}>
          অর্ডার বিবরণ যাচাই করা হচ্ছে...
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
          <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: '0 0 4px' }}>কোনো পূর্ববর্তী অর্ডার পাওয়া যায়নি</h3>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px' }}>
            {searched ? 'এই তথ্য দিয়ে ডাটাবেজে কোনো অর্ডার নেই।' : 'আপনি এখনো কোনো সার্ভিস বা প্যাকেজ অর্ডার করেননি।'}
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
            const isCancelled = ord.status?.toLowerCase() === 'cancelled';
            const supportMsg = encodeURIComponent(`হ্যালো Hub Cart সাপোর্ট, আমার অর্ডার আইডি ${ord.order_id} (${ord.service_name}) সংক্রান্ত সহায়তা প্রয়োজন।`);

            return (
              <div
                key={ord.order_id || ord.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '18px',
                  border: isCancelled ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '16px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
                }}
              >
                {/* কার্ডের শীর্ষভাগ: অর্ডার আইডি ও স্ট্যাটাস */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>ORDER ID</span>
                    <div style={{ fontSize: '14px', fontWeight: '900', color: isCancelled ? '#f87171' : '#38bdf8' }}>
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
                  <span style={{ fontSize: '16px', fontWeight: '900', color: isCancelled ? '#94a3b8' : '#38bdf8' }}>
                    ৳{ord.price}
                  </span>
                </div>

                {/* পেমেন্ট বিবরণ */}
                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '14px' }}>
                  <div>পেমেন্ট মেথড: <strong style={{ color: '#cbd5e1' }}>{ord.payment_method}</strong></div>
                  {ord.trx_id && ord.trx_id !== 'N/A' && (
                    <div>TrxID: <code style={{ color: '#f8fafc', background: 'rgba(30, 41, 59, 0.8)', padding: '2px 6px', borderRadius: '4px' }}>{ord.trx_id}</code></div>
                  )}
                  {ord.created_at && (
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                      তারিখ: {new Date(ord.created_at).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  )}
                </div>

                {/* অ্যাকশন বাটনসমূহ */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {!isCancelled && (
                    <Link
                      href={`/track?id=${ord.order_id}`}
                      style={{
                        flex: 1,
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
                      ⚡ লাইভ ট্র্যাকিং →
                    </Link>
                  )}

                  <a
                    href={`https://wa.me/${SUPPORT_WHATSAPP}?text=${supportMsg}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: isCancelled ? 1 : 0.8,
                      textAlign: 'center',
                      background: 'rgba(34, 197, 94, 0.12)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: '#4ade80',
                      padding: '9px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    💬 সাপোর্ট
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
