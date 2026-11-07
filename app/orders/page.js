'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

const LOGO_HUB_CART = '/logo-icon.png';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';
const SUPPORT_WHATSAPP = '8801319760720';

export default function OrderHistoryPage() {
  const { lang, t } = useLanguage();
  const [user, setUser] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    let targetPhone = '';

    // ১. Profile / Login User থেকে ফোন নম্বর নেওয়া
    const savedUser = localStorage.getItem('hubcart_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.phone) targetPhone = parsed.phone;
      } catch (e) {
        console.error(e);
      }
    }

    // ২. প্রোফাইলে না পেলে সর্বশেষ অর্ডার থেকে চেক করা
    if (!targetPhone) {
      const currentOrder = localStorage.getItem('hubcart_current_order');
      if (currentOrder) {
        try {
          const parsedOrder = JSON.parse(currentOrder);
          if (parsedOrder.whatsappNumber) targetPhone = parsedOrder.whatsappNumber;
        } catch (e) {
          console.error(e);
        }
      }
    }

    if (targetPhone) {
      fetchOrders(targetPhone);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrders = async (queryText) => {
    const query = queryText.trim();
    if (!query) return;

    setLoading(true);
    try {
      const isOrderId = query.toUpperCase().startsWith('HC');

      let filter = '';
      if (isOrderId) {
        // Order ID দিয়ে সার্চ
        const cleanId = query.toUpperCase().replace(/[^A-Z0-9-]/g, '');
        filter = `order_id=ilike.*${cleanId}*`;
      } else {
        // নম্বরের শেষ ১০ ডিজিট বের করা
        const digitsOnly = query.replace(/[^0-9]/g, '');
        const last10 = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;
        
        // URL-এ '+' চিহ্ন সুরক্ষিত রাখতে encodeURIComponent ব্যবহার করা হয়েছে (%2B)
        const encodedRaw = encodeURIComponent(query);

        // চারটি সম্ভাব্য ফরম্যাটই একসাথে OR দিয়ে চেক করা হবে:
        const orConditions = [
          `whatsapp_number.ilike.*${last10}*`,
          `whatsapp_number.eq.0${last10}`,
          `whatsapp_number.eq.%2B880${last10}`,
          `whatsapp_number.eq.880${last10}`,
          `whatsapp_number.eq.${encodedRaw}`
        ];

        filter = `or=(${orConditions.join(',')})`;
      }

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
      console.error('Fetch error:', err);
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

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'paid':
        return { label: 'Completed', bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80', border: 'rgba(34, 197, 94, 0.3)' };
      case 'processing':
        return { label: 'Processing', bg: 'rgba(166, 243, 106, 0.15)', text: '#a6f36a', border: 'rgba(166, 243, 106, 0.3)' };
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
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={LOGO_HUB_CART}
            alt="Hub Cart"
            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
          />
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#f8fafc', margin: 0 }}>
              {t.orders.title}
            </h1>
            <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>
              {t.orders.subtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (user?.phone) fetchOrders(user.phone);
            else if (searchInput) fetchOrders(searchInput);
          }}
          style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#a6f36a', padding: '6px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          title={t.orders.refresh}
        >
          🔄
        </button>
      </div>

      {/* Search Box */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '18px',
        padding: '14px',
        marginBottom: '20px',
      }}>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 10px' }}>
          {t.orders.searchLabel}
        </p>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder={t.orders.placeholder}
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
              background: 'linear-gradient(135deg, #a6f36a, #d2ffad)',
              color: '#10170c',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {t.findBtn}
          </button>
        </form>
      </div>

      {/* Orders List View */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b', fontSize: '13px' }}>
          {t.orders.verifying}
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
          <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: '0 0 4px' }}>{t.orders.noneTitle}</h3>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px' }}>
            {searched ? t.orders.noneSearched : t.orders.noneYet}
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #a6f36a, #d2ffad)',
              color: '#10170c',
              padding: '10px 24px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '13px',
            }}
          >
            {t.orders.browse}
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {orders.map((ord) => {
            const badge = getStatusBadge(ord.status);
            const isCancelled = ord.status?.toLowerCase() === 'cancelled';
            const supportMsg = encodeURIComponent(t.orders.supportMsg.replace('{id}', ord.order_id).replace('{service}', ord.service_name));

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
                {/* Order Top Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>{t.orders.orderId}</span>
                    <div style={{ fontSize: '14px', fontWeight: '900', color: isCancelled ? '#f87171' : '#a6f36a' }}>
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

                {/* Service & Price */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#f8fafc' }}>
                    {ord.service_name}
                  </h3>
                  <span style={{ fontSize: '16px', fontWeight: '900', color: isCancelled ? '#94a3b8' : '#a6f36a' }}>
                    ৳{ord.price}
                  </span>
                </div>

                {/* Payment Meta */}
                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '14px' }}>
                  <div>{t.orders.paymentMethod} <strong style={{ color: '#cbd5e1' }}>{ord.payment_method}</strong></div>
                  {ord.trx_id && ord.trx_id !== 'N/A' && (
                    <div>{t.invoice.trxId} <code style={{ color: '#f8fafc', background: 'rgba(30, 41, 59, 0.8)', padding: '2px 6px', borderRadius: '4px' }}>{ord.trx_id}</code></div>
                  )}
                  {ord.created_at && (
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                      {t.orders.date} {new Date(ord.created_at).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {!isCancelled && (
                    <Link
                      href={`/track?id=${ord.order_id}`}
                      style={{
                        flex: 1,
                        minWidth: '95px',
                        textAlign: 'center',
                        background: 'rgba(166, 243, 106, 0.1)',
                        border: '1px solid rgba(166, 243, 106, 0.3)',
                        color: '#a6f36a',
                        padding: '9px 6px',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      {t.orders.tracking}
                    </Link>
                  )}

                  <Link
                    href={`/invoice/${ord.order_id}`}
                    style={{
                      flex: 1,
                      minWidth: '95px',
                      textAlign: 'center',
                      background: 'rgba(168, 85, 247, 0.12)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      color: '#c084fc',
                      padding: '9px 6px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    {t.orders.memo}
                  </Link>

                  <a
                    href={`https://wa.me/${SUPPORT_WHATSAPP}?text=${supportMsg}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: isCancelled ? 1 : 0.8,
                      minWidth: '85px',
                      textAlign: 'center',
                      background: 'rgba(34, 197, 94, 0.12)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: '#4ade80',
                      padding: '9px 6px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    {t.orders.support}
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
