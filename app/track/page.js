'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/ZRRgvqSQ/20261030-234214.png';

// Vercel Environment Variables থেকে ডাটা নেওয়া হচ্ছে
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [searchQuery, setSearchQuery] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialId) {
      handleSearch(initialId);
    }
  }, [initialId]);

  const handleSearch = async (queryToSearch) => {
    const query = (queryToSearch || searchQuery).trim();
    if (!query) return;

    setLoading(true);
    setSearched(true);

    try {
      const isOrderId = query.toUpperCase().startsWith('HC-');
      const filter = isOrderId
        ? `order_id=eq.${query.toUpperCase()}`
        : `whatsapp_number=eq.${query}`;

      const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?${filter}&select=*&order=id.desc`, {
        cache: 'no-store',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });

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

  const getStatusStep = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 4;
      case 'processing':
        return 3;
      case 'verified':
      case 'verifying':
        return 2;
      default:
        return 1;
    }
  };

  return (
    <div style={{ maxWidth: '540px', margin: '0 auto', padding: '16px 16px 100px' }}>
      
      {/* হেডার */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <img
          src={LOGO_HUB_CART}
          alt="Hub Cart"
          style={{ width: '46px', height: '46px', objectFit: 'contain', margin: '0 auto 8px', filter: 'drop-shadow(0 4px 10px rgba(56, 189, 248, 0.4))' }}
        />
        <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#f8fafc', margin: '0 0 4px' }}>
          Live Order Tracker
        </h1>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
          আপনার অর্ডার আইডি (HC-XXXX) বা WhatsApp নম্বর দিয়ে লাইভ স্ট্যাটাস দেখুন
        </p>
      </div>

      {/* সার্চ বক্স */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '18px',
        padding: '8px',
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      }}>
        <input
          type="text"
          placeholder="যেমন: HC-8492 অথবা 018XXXXXXXX"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '10px 14px',
            color: '#ffffff',
            fontSize: '13px',
          }}
        />
        <button
          onClick={() => handleSearch()}
          style={{
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 18px',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.4)',
          }}
        >
          {loading ? '...' : 'Track'}
        </button>
      </div>

      {/* ফলাফল */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '13px' }}>
          তথ্য অনুসন্ধান করা হচ্ছে...
        </div>
      ) : searched && orders.length === 0 ? (
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '18px',
          padding: '36px 16px',
          textAlign: 'center',
          color: '#94a3b8',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
          <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: '0 0 4px' }}>কোনো অর্ডার পাওয়া যায়নি</h3>
          <p style={{ fontSize: '12px', margin: 0, color: '#64748b' }}>সঠিক অর্ডার আইডি বা নম্বরটি দিয়ে আবার চেষ্টা করুন।</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((ord) => {
            const step = getStatusStep(ord.status);
            const isCancelled = ord.status?.toLowerCase() === 'cancelled';

            return (
              <div
                key={ord.order_id}
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(16px)',
                  border: isCancelled ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(59, 130, 246, 0.25)',
                  borderRadius: '20px',
                  padding: '20px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>ORDER ID</span>
                    <h3 style={{ fontSize: '17px', fontWeight: '900', color: isCancelled ? '#f87171' : '#38bdf8', margin: 0 }}>
                      {ord.order_id}
                    </h3>
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    background: isCancelled ? 'rgba(239, 68, 68, 0.2)' : step === 4 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                    color: isCancelled ? '#f87171' : step === 4 ? '#4ade80' : '#38bdf8',
                    border: isCancelled ? '1px solid rgba(239, 68, 68, 0.4)' : step === 4 ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(56, 189, 248, 0.3)',
                  }}>
                    ● {ord.status?.toUpperCase()}
                  </span>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '4px' }}>
                    {ord.service_name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    মূল্য: <strong style={{ color: '#f8fafc' }}>৳{ord.price}</strong> • পেমেন্ট: <strong style={{ color: '#f8fafc' }}>{ord.payment_method}</strong>
                  </div>
                </div>

                {/* টাইমলাইন */}
                {!isCancelled ? (
                  <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '14px', padding: '14px 10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '0 8px 10px' }}>
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '8px',
                        right: '8px',
                        height: '2px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        zIndex: 1,
                      }}>
                        <div style={{
                          height: '100%',
                          width: step === 4 ? '100%' : step === 3 ? '66%' : step === 2 ? '33%' : '0%',
                          background: '#38bdf8',
                          transition: 'width 0.4s ease',
                        }} />
                      </div>

                      {[
                        { num: 1, label: 'গৃহীত' },
                        { num: 2, label: 'যাচাইকরণ' },
                        { num: 3, label: 'প্রসেসিং' },
                        { num: 4, label: 'সম্পন্ন' },
                      ].map((s) => {
                        const isActive = step >= s.num;
                        return (
                          <div key={s.num} style={{ textAlign: 'center', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: isActive ? '#38bdf8' : '#1e293b',
                              color: isActive ? '#0f172a' : '#64748b',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              boxShadow: isActive ? '0 0 10px rgba(56, 189, 248, 0.5)' : 'none',
                              marginBottom: '4px',
                            }}>
                              {isActive ? '✓' : s.num}
                            </div>
                            <span style={{ fontSize: '10px', color: isActive ? '#f8fafc' : '#64748b', fontWeight: isActive ? 'bold' : 'normal' }}>
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '12px', padding: '10px 14px', fontSize: '12px', color: '#f87171', textAlign: 'center' }}>
                    এই অর্ডারটি বাতিল (Cancelled) করা হয়েছে। প্রয়োজনে সাপোর্টে যোগাযোগ করুন।
                  </div>
                )}

                {/* ক্যাশ মেমো / ইনভয়েস লিংক বাটন */}
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Link
                    href={`/invoice/${ord.order_id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(168, 85, 247, 0.12)',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                      color: '#c084fc',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    <span>📄</span> ক্যাশ মেমো / ইনভয়েস দেখুন →
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>লোড হচ্ছে...</div>}>
      <TrackContent />
    </Suspense>
  );
}
