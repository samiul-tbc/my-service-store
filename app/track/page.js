'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { birthdayPath } from '../../lib/birthday';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import Icon from '../../components/icons';

const LOGO_HUB_CART = '/logo-icon.png';

// Vercel Environment Variables থেকে ডাটা নেওয়া হচ্ছে
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

function TrackContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [searchQuery, setSearchQuery] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [searched, setSearched] = useState(false);
  const [deliveredMap, setDeliveredMap] = useState({});
  const [bdayMap, setBdayMap] = useState({});
  const [dlMap, setDlMap] = useState({});
  const [dlPhone, setDlPhone] = useState({});
  const [dlBusy, setDlBusy] = useState({});
  const [dlErr, setDlErr] = useState({});
  const [searchPhone, setSearchPhone] = useState('');
  const dlChecked = useRef(new Set());
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    if (initialId) {
      handleSearch(initialId);
    }
  }, [initialId]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        if (Array.isArray(data.products)) setCatalog(data.products);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const checkDownload = async (orderId, phone) => {
    try {
      const res = await fetch('/api/download', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'info', orderId, phone }) });
      const j = await res.json();
      if (j && (j.available || j.reason === 'limit')) {
        dlChecked.current.add(orderId);
        setDlMap((m) => ({ ...m, [orderId]: { remaining: j.remaining || 0, limit: j.limit || 3 } }));
      }
      return j;
    } catch { return null; }
  };

  const verifyDownloadPhone = async (ord) => {
    const phone = (dlPhone[ord.order_id] || '').replace(/\D/g, '');
    if (phone.length < 10) { setDlErr((e) => ({ ...e, [ord.order_id]: t.track.dlWrong })); return; }
    setDlBusy((b) => ({ ...b, [ord.order_id]: true }));
    const j = await checkDownload(ord.order_id, phone);
    setDlBusy((b) => ({ ...b, [ord.order_id]: false }));
    if (!j || (!j.available && j.reason !== 'limit')) setDlErr((e) => ({ ...e, [ord.order_id]: t.track.dlWrong }));
    else { setDlErr((e) => ({ ...e, [ord.order_id]: '' })); setSearchPhone(phone); }
  };

  const doDownload = async (ord) => {
    const phone = searchPhone || (dlPhone[ord.order_id] || '').replace(/\D/g, '');
    setDlBusy((b) => ({ ...b, [ord.order_id]: true }));
    setDlErr((e) => ({ ...e, [ord.order_id]: '' }));
    try {
      const res = await fetch('/api/download', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'download', orderId: ord.order_id, phone }) });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        if (j.reason === 'limit') {
          setDlMap((m) => ({ ...m, [ord.order_id]: { remaining: 0, limit: (m[ord.order_id] || {}).limit || 3 } }));
          setDlErr((e) => ({ ...e, [ord.order_id]: t.track.dlGone }));
        } else {
          setDlErr((e) => ({ ...e, [ord.order_id]: t.track.dlWrong }));
        }
        return;
      }
      const blob = await res.blob();
      const cd = res.headers.get('Content-Disposition') || '';
      const fm = cd.match(/filename="([^"]+)"/);
      const url = URL.createObjectURL(blob);
      const aEl = document.createElement('a');
      aEl.href = url;
      aEl.download = fm ? fm[1] : 'download.html';
      document.body.appendChild(aEl);
      aEl.click();
      aEl.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      await checkDownload(ord.order_id, phone);
    } catch {
      setDlErr((e) => ({ ...e, [ord.order_id]: t.track.dlWrong }));
    } finally {
      setDlBusy((b) => ({ ...b, [ord.order_id]: false }));
    }
  };

  useEffect(() => {
    if (!searchPhone || !orders.length || !catalog.length) return;
    orders.forEach((ord) => {
      if ((ord.status || '').toLowerCase() !== 'completed') return;
      if (dlChecked.current.has(ord.order_id)) return;
      const match = catalog.find((pr) => ord.service_name && pr.title && ord.service_name.includes(pr.title));
      if (!match || !match.hasDownload) return;
      checkDownload(ord.order_id, searchPhone);
    });
  }, [orders, catalog, searchPhone]);

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
        if (!isOrderId) setSearchPhone(query.replace(/\D/g, ''));
        // সম্পন্ন অর্ডারের ডেলিভারি তথ্য (যদি থাকে) — কাস্টমার এখানেই দেখতে পাবে
        try {
          const completed = data.filter((o) => (o.status || '').toLowerCase() === 'completed');
          if (completed.length) {
            const ors = completed.map((o) => `key.eq.delivered_${o.order_id},key.like.delivered_${o.order_id}_*`).join(',');
            const r2 = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?or=(${ors})&select=key,value`, {
              cache: 'no-store',
              headers: {
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`,
              },
            });
            const rows = await r2.json();
            if (Array.isArray(rows)) {
              const map = {};
              completed.forEach((o) => {
                const base = `delivered_${o.order_id}`;
                let best = null;
                rows.forEach((r) => {
                  if (!r.value) return;
                  if (r.key === base) { if (!best) best = r; return; }
                  if (r.key.startsWith(base + '_') && /^\d+$/.test(r.key.slice(base.length + 1)) && (!best || r.key > best.key)) best = r;
                });
                if (best) map[o.order_id] = best.value;
              });
              setDeliveredMap(map);
            }
          }
        } catch (e) { console.error(e); }
        // বার্থডে কার্ডের তথ্য থাকলে লিংক দেখানো (যেকোনো স্ট্যাটাসে)
        try {
          const ors = data.map((o) => `key.like.bday_${o.order_id}_*`).join(',');
          if (ors) {
            const r3 = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?or=(${ors})&select=key,value`, {
              cache: 'no-store',
              headers: {
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`,
              },
            });
            const rows3 = await r3.json();
            if (Array.isArray(rows3)) {
              const bmap = {};
              data.forEach((o) => {
                const base = `bday_${o.order_id}_`;
                let best = null;
                rows3.forEach((r) => {
                  if (r.key.startsWith(base) && /^\d+$/.test(r.key.slice(base.length)) && (!best || r.key > best.key)) best = r;
                });
                if (best && best.value) { try { bmap[o.order_id] = JSON.parse(best.value); } catch {} }
              });
              setBdayMap(bmap);
            }
          }
        } catch (e) { console.error(e); }
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
          style={{ width: '46px', height: '46px', objectFit: 'contain', margin: '0 auto 8px', filter: 'drop-shadow(0 4px 10px rgba(166, 243, 106, 0.4))' }}
        />
        <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#f8fafc', margin: '0 0 4px' }}>
          {t.track.title}
        </h1>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
          {t.track.subtitle}
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
          placeholder={t.track.placeholder}
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
            background: 'linear-gradient(135deg, #a6f36a, #d2ffad)',
            color: '#10170c',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 18px',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(166, 243, 106, 0.4)',
          }}
        >
          {loading ? '...' : t.track.button}
        </button>
      </div>

      {/* ফলাফল */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '13px' }}>
          {t.track.searching}
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
          <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}><Icon name="search" size={38} color="#64748b" /></div>
          <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: '0 0 4px' }}>{t.track.noneTitle}</h3>
          <p style={{ fontSize: '12px', margin: 0, color: '#64748b' }}>{t.track.noneSub}</p>
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
                  border: isCancelled ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(166, 243, 106, 0.25)',
                  borderRadius: '20px',
                  padding: '20px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>{t.track.orderId}</span>
                    <h3 style={{ fontSize: '17px', fontWeight: '900', color: isCancelled ? '#f87171' : '#a6f36a', margin: 0 }}>
                      {ord.order_id}
                    </h3>
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    background: isCancelled ? 'rgba(239, 68, 68, 0.2)' : step === 4 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(166, 243, 106, 0.15)',
                    color: isCancelled ? '#f87171' : step === 4 ? '#4ade80' : '#a6f36a',
                    border: isCancelled ? '1px solid rgba(239, 68, 68, 0.4)' : step === 4 ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(166, 243, 106, 0.3)',
                  }}>
                    ● {ord.status?.toUpperCase()}
                  </span>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '4px' }}>
                    {ord.service_name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {t.track.priceLabel} <strong style={{ color: '#f8fafc' }}>৳{ord.price}</strong> • {t.track.paymentLabel} <strong style={{ color: '#f8fafc' }}>{ord.payment_method}</strong>
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
                          background: '#a6f36a',
                          transition: 'width 0.4s ease',
                        }} />
                      </div>

                      {[
                        { num: 1, label: t.track.steps[0] },
                        { num: 2, label: t.track.steps[1] },
                        { num: 3, label: t.track.steps[2] },
                        { num: 4, label: t.track.steps[3] },
                      ].map((s) => {
                        const isActive = step >= s.num;
                        return (
                          <div key={s.num} style={{ textAlign: 'center', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: isActive ? '#a6f36a' : '#1e293b',
                              color: isActive ? '#0f172a' : '#64748b',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              boxShadow: isActive ? '0 0 10px rgba(166, 243, 106, 0.5)' : 'none',
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
                    {t.track.cancelled}
                  </div>
                )}

                {deliveredMap[ord.order_id] && (
                  <div style={{ marginTop: '16px', background: 'rgba(166, 243, 106, 0.07)', border: '1px solid rgba(166, 243, 106, 0.35)', borderRadius: '14px', padding: '14px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '900', color: '#a6f36a', marginBottom: '4px' }}>{t.track.deliveryTitle}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>{t.track.deliveryNote}</div>
                    <div style={{ fontSize: '13px', color: '#f1f5f9', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.65, background: 'rgba(2, 6, 23, 0.55)', borderRadius: '10px', padding: '10px 12px' }}>{deliveredMap[ord.order_id]}</div>
                  </div>
                )}

                {bdayMap[ord.order_id] && (ord.status || '').toLowerCase() === 'completed' && (
                  <div style={{ marginTop: '16px', background: 'linear-gradient(150deg, rgba(244, 114, 182, 0.13), rgba(147, 51, 234, 0.1))', border: '1px solid rgba(244, 114, 182, 0.45)', borderRadius: '14px', padding: '14px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '900', color: '#f9a8d4', marginBottom: '8px' }}>{t.bday.linkTitle}</div>
                    <a href={birthdayPath(bdayMap[ord.order_id])} target="_blank" rel="noreferrer" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #f472b6, #a855f7)', color: '#fff', fontWeight: '900', fontSize: '13px', padding: '10px 18px', borderRadius: '10px', textDecoration: 'none' }}>{t.bday.open}</a>
                  </div>
                )}

                {(() => {
                  if ((ord.status || '').toLowerCase() !== 'completed') return null;
                  const dlMatch = catalog.find((pr) => ord.service_name && pr.title && ord.service_name.includes(pr.title));
                  if (!dlMatch || !dlMatch.hasDownload) return null;
                  const info = dlMap[ord.order_id];
                  return (
                    <div style={{ marginTop: '16px', background: 'rgba(56, 189, 248, 0.07)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '14px', padding: '14px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '900', color: '#38bdf8', marginBottom: '4px' }}>{t.track.dlTitle}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '10px' }}>{t.track.dlNote}</div>
                      {info ? (
                        info.remaining > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <button onClick={() => doDownload(ord)} disabled={dlBusy[ord.order_id]} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', color: '#fff', fontWeight: '900', fontSize: '13px', padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', opacity: dlBusy[ord.order_id] ? 0.6 : 1 }}>
                              <Icon name="download" size={15} />{t.track.dlBtn}
                            </button>
                            <span style={{ fontSize: '11px', color: '#7dd3fc', fontWeight: 'bold' }}>{t.track.dlLeft}: {info.remaining}/{info.limit}</span>
                          </div>
                        ) : (
                          <div style={{ fontSize: '12px', color: '#fca5a5', lineHeight: 1.6 }}>{t.track.dlGone}</div>
                        )
                      ) : (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <input value={dlPhone[ord.order_id] || ''} onChange={(e) => setDlPhone((pp) => ({ ...pp, [ord.order_id]: e.target.value }))} placeholder={t.track.dlPhonePh} inputMode="tel" style={{ flex: '1 1 170px', background: 'rgba(2,6,23,0.55)', border: '1px solid rgba(148,163,184,0.35)', borderRadius: '10px', padding: '10px 12px', color: '#f1f5f9', fontSize: '13px', outline: 'none' }} />
                          <button onClick={() => verifyDownloadPhone(ord)} disabled={dlBusy[ord.order_id]} style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.5)', color: '#7dd3fc', fontWeight: '900', fontSize: '13px', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', opacity: dlBusy[ord.order_id] ? 0.6 : 1 }}>{t.track.dlVerify}</button>
                        </div>
                      )}
                      {dlErr[ord.order_id] && <div style={{ fontSize: '12px', color: '#fca5a5', marginTop: '8px' }}>{dlErr[ord.order_id]}</div>}
                    </div>
                  );
                })()}

                {/* ক্যাশ মেমো / ইনভয়েস লিংক বাটন */}
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                  {(() => {
                    const match = catalog.find((pr) => ord.service_name && pr.title && ord.service_name.includes(pr.title));
                    return match ? (
                      <Link
                        href={`/product/${match.id}`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          background: 'rgba(166, 243, 106, 0.12)', border: '1px solid rgba(166, 243, 106, 0.4)',
                          color: '#a6f36a', padding: '8px 14px', borderRadius: '10px',
                          textDecoration: 'none', fontSize: '12px', fontWeight: 'bold',
                        }}
                      >
                        <Icon name="refresh" size={14} />{t.shop.buyAgain}
                      </Link>
                    ) : <span />;
                  })()}
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
                    <span style={{ display: "inline-flex", verticalAlign: "-3px", marginRight: "5px" }}><Icon name="doc" size={15} /></span>{t.track.viewInvoice}
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
  const { t } = useLanguage();
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>{t.track.loading}</div>}>
      <TrackContent />
    </Suspense>
  );
}
