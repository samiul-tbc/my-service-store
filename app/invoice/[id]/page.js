'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../../context/LanguageContext';
import Icon from '../../../components/icons';

const LOGO_HUB_CART = '/logo-icon.png';

// Vercel Environment Variables থেকে ডাটা নেওয়া হচ্ছে
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

export default function InvoicePage() {
  const { lang, t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const orderIdParam = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderIdParam) return;

    async function fetchOrder() {
      try {
        const isOrderIdText = orderIdParam.toUpperCase().startsWith('HC-');
        const queryFilter = isOrderIdText
          ? `order_id=eq.${orderIdParam.toUpperCase()}`
          : `id=eq.${orderIdParam}`;

        const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?${queryFilter}&select=*`, {
          cache: 'no-store',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        });

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setOrder(data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderIdParam]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#94a3b8' }}>
        {t.invoice.preparing}
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#94a3b8' }}>
        <h3>{t.invoice.notFound}</h3>
        <button
          onClick={() => router.push('/')}
          style={{ marginTop: '12px', padding: '10px 18px', background: '#a6f36a', color: '#10170c', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {t.invoice.backHome}
        </button>
      </div>
    );
  }

  const isCompleted = order.status?.toLowerCase() === 'completed';
  const isCancelled = order.status?.toLowerCase() === 'cancelled';

  return (
    <div style={{ maxWidth: '580px', margin: '20px auto', padding: '0 16px 80px' }}>
      
      {/* অ্যাকশন বাটনসমূহ (প্রিন্ট পেজে লুকানো থাকবে) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button
          onClick={() => router.back()}
          style={{ border: 'none', background: 'none', color: '#94a3b8', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {t.invoice.back}
        </button>

        <button
          onClick={handlePrint}
          style={{
            background: 'linear-gradient(135deg, #a6f36a, #d2ffad)',
            color: '#10170c',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(166, 243, 106, 0.4)'
          }}
        >
          <span style={{ display: "inline-flex", verticalAlign: "-3px", marginRight: "5px" }}><Icon name="printer" size={15} /></span>{t.invoice.print}
        </button>
      </div>

      {/* ক্যাশ মেমো / ইনভয়েস কার্ড */}
      <div id="invoice-card" style={{
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '28px 24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* ওয়াটারমার্ক স্ট্যাটাস স্ট্যাম্প */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '-20px',
          transform: 'rotate(25deg)',
          border: `2px dashed ${isCancelled ? '#ef4444' : isCompleted ? '#22c55e' : '#a6f36a'}`,
          color: isCancelled ? '#ef4444' : isCompleted ? '#22c55e' : '#a6f36a',
          padding: '4px 28px',
          fontSize: '11px',
          fontWeight: '900',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          opacity: 0.8,
        }}>
          {order.status || 'PENDING'}
        </div>

        {/* হেডার: ব্র্যান্ড লোগো ও শপ বিবরণ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '18px', marginBottom: '20px' }}>
          <img
            src={LOGO_HUB_CART}
            alt="Hub Cart"
            style={{ width: '48px', height: '48px', objectFit: 'contain' }}
          />
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#f8fafc', margin: 0, letterSpacing: '-0.3px' }}>
              Hub Cart
            </h2>
            <span style={{ fontSize: '9px', fontWeight: '800', color: '#a6f36a', letterSpacing: '1.4px' }}>
              {t.invoice.official}
            </span>
          </div>
        </div>

        {/* ইনভয়েস ও কাস্টমার মেটা ডাটা */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(30, 41, 59, 0.5)', padding: '14px', borderRadius: '16px', marginBottom: '20px', fontSize: '12px', lineHeight: '1.6' }}>
          <div>
            <div style={{ color: '#64748b', fontSize: '10px', fontWeight: 'bold' }}>{t.invoice.customer}</div>
            <div style={{ color: '#f8fafc', fontWeight: 'bold' }}>{order.customer_name}</div>
            <div style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="phone" size={13} color="#94a3b8" /> {order.whatsapp_number}</div>
            {order.telegram_username && <div style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="send" size={13} color="#94a3b8" /> {order.telegram_username}</div>}
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#64748b', fontSize: '10px', fontWeight: 'bold' }}>{t.invoice.memoId}</div>
            <div style={{ color: '#a6f36a', fontWeight: '900', fontSize: '13px' }}>{order.order_id}</div>
            <div style={{ color: '#cbd5e1', fontSize: '11px', marginTop: '2px' }}>
              {new Date(order.created_at || Date.now()).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* আইটেম টেবিল */}
        <div style={{ marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '11px', textAlign: 'left' }}>
                <th style={{ padding: '8px 4px', fontWeight: 'bold' }}>{t.invoice.service}</th>
                <th style={{ padding: '8px 4px', textAlign: 'right', fontWeight: 'bold' }}>{t.invoice.price}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '14px 4px', color: '#f8fafc', fontWeight: 'bold' }}>
                  {order.service_name}
                </td>
                <td style={{ padding: '14px 4px', textAlign: 'right', color: '#a6f36a', fontWeight: '900', fontSize: '15px' }}>
                  ৳{order.price}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* পেমেন্ট বিবরণ ও মোট হিসাব */}
        <div style={{ borderTop: '1px dashed rgba(255, 255, 255, 0.15)', paddingTop: '16px', marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
            <span>{t.invoice.paymentMethod}</span>
            <strong style={{ color: '#f8fafc' }}>{order.payment_method}</strong>
          </div>
          {order.trx_id && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
              <span>{t.invoice.trxId}</span>
              <code style={{ color: '#f8fafc', background: 'rgba(30, 41, 59, 0.8)', padding: '1px 6px', borderRadius: '4px' }}>
                {order.trx_id}
              </code>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '15px', fontWeight: '900', color: '#f8fafc' }}>{t.invoice.totalPaid}</span>
            <span style={{ fontSize: '22px', fontWeight: '900', color: '#a6f36a' }}>৳{order.price}</span>
          </div>
        </div>

        {/* ফুটার সিকিউরিটি নোট */}
        <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '14px', fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
          {t.invoice.thanks}
        </div>

      </div>

      {/* প্রিন্ট অপ্টিমাইজড সিএসএস স্টাইল */}
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          header, nav, .no-print {
            display: none !important;
          }
          #invoice-card {
            background: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #000000 !important;
            box-shadow: none !important;
            padding: 20px !important;
          }
          #invoice-card * {
            color: #000000 !important;
          }
        }
      `}</style>

    </div>
  );
}
