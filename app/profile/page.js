'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import Icon from '../../components/icons';

const LOGO_HUB_CART = '/logo-icon.png';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myOrders, setMyOrders] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editTelegram, setEditTelegram] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    const savedUser = localStorage.getItem('hubcart_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('User parse error:', e);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user?.phone) return;
    const digits = String(user.phone).replace(/\D/g, '');
    const suffix = digits.slice(-10);
    if (suffix.length < 9) return;
    (async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?whatsapp_number=like.*${suffix}&select=*&order=id.desc`, {
          cache: 'no-store',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) setMyOrders(data);
      } catch (e) { console.error(e); }
    })();
  }, [user?.phone]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        if (Array.isArray(data.products)) setCatalog(data.products);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const handleSaveProfile = () => {
    const updated = { ...user, name: editName.trim() || user.name, telegram: editTelegram.trim() };
    localStorage.setItem('hubcart_user', JSON.stringify(updated));
    setUser(updated);
    setEditing(false);
  };

  const handleLogout = () => {
    if (confirm(t.prof.logoutConfirm)) {
      localStorage.removeItem('hubcart_user');
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b', fontSize: '13px' }}>
        {t.prof.loading}
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{
          width: '100%',
          maxWidth: '380px',
          padding: '32px 20px',
          textAlign: 'center',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
        }}>
          <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '56px', height: '56px', objectFit: 'contain', marginBottom: '14px' }} />
          <h3 style={{ margin: '0 0 6px', color: '#f8fafc', fontSize: '18px', fontWeight: 'bold' }}>{t.prof.notLoggedTitle}</h3>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px' }}>{t.prof.notLoggedSub}</p>
          <Link
            href="/login"
            style={{
              display: 'inline-block',
              width: '80%',
              padding: '12px',
              background: 'linear-gradient(135deg, #a6f36a, #d2ffad)',
              color: '#10170c',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '13px',
              boxShadow: '0 4px 14px rgba(166, 243, 106, 0.4)',
            }}
          >
            {t.prof.loginSignup}
          </Link>
        </div>
      </div>
    );
  }

  const displayName = user.name || t.prof.customer;

  return (
    <div style={{ maxWidth: '460px', margin: '14px auto', padding: '0 14px 130px' }}>
      
      {/* ভিআইপি মেম্বার কার্ড */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid rgba(166, 243, 106, 0.3)',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <span style={{ fontSize: '13px', fontWeight: '900', color: '#f8fafc' }}>{t.prof.vip}</span>
          </div>
          <span style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#4ade80', fontSize: '10px', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
            {t.prof.verified}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #a6f36a, #d2ffad)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            fontWeight: '900',
            color: '#10170c',
            boxShadow: '0 4px 12px rgba(166, 243, 106, 0.4)'
          }}>
            {displayName[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px', color: '#f8fafc' }}>{displayName}</h2>
            <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>{t.prof.client}</p>
          </div>
        </div>
      </div>

      {/* অ্যাকাউন্ট ইনফো */}
      <div style={{ background: 'rgba(15, 23, 42, 0.75)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '18px', marginBottom: '14px' }}>
        <div style={{ paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '13px' }}>
          <span style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>{t.prof.email}</span>
          <span style={{ color: '#f8fafc' }}>{user.email || t.prof.notAdded}</span>
        </div>
        <div style={{ paddingTop: '12px', fontSize: '13px' }}>
          <span style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>{t.prof.whatsapp}</span>
          <span style={{ color: '#f8fafc' }}>{user.phone || t.prof.notAdded}</span>
        </div>
        {editing ? (
          <div style={{ paddingTop: '12px' }}>
            <span style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}>{t.auth.name.replace(' *', '')}</span>
            <input value={editName} onChange={(e) => setEditName(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '10px', background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#ffffff', fontSize: '13px', outline: 'none' }} />
            <span style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 'bold', margin: '10px 0 4px' }}>{t.prof.telegram}</span>
            <input value={editTelegram} onChange={(e) => setEditTelegram(e.target.value)} placeholder="@username" style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '10px', background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#ffffff', fontSize: '13px', outline: 'none' }} />
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button onClick={handleSaveProfile} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #a6f36a, #d2ffad)', color: '#10170c', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>{t.prof.save}</button>
              <button onClick={() => setEditing(false)} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>{t.prof.cancel}</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ paddingTop: '12px', fontSize: '13px' }}>
              <span style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>{t.prof.telegram}</span>
              <span style={{ color: '#f8fafc' }}>{user.telegram || t.prof.notAdded}</span>
            </div>
            <button onClick={() => { setEditName(user.name || ''); setEditTelegram(user.telegram || ''); setEditing(true); }} style={{ marginTop: '14px', width: '100%', padding: '9px', borderRadius: '10px', background: 'rgba(166, 243, 106, 0.1)', border: '1px solid rgba(166, 243, 106, 0.3)', color: '#a6f36a', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>{t.prof.edit}</button>
          </>
        )}
      </div>

      {/* পরিসংখ্যান */}
      {myOrders.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
          {[
            { label: t.prof.totalOrders, value: myOrders.length },
            { label: t.prof.completedOrders, value: myOrders.filter((o) => o.status === 'completed').length },
            { label: t.prof.totalSpent, value: '৳' + myOrders.filter((o) => o.status === 'completed').reduce((s, o) => s + (Number(o.price) || 0), 0) },
          ].map((st) => (
            <div key={st.label} style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: '17px', fontWeight: '900', color: '#a6f36a' }}>{st.value}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', marginTop: '2px' }}>{st.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* সাম্প্রতিক অর্ডার */}
      {myOrders.length > 0 && (
        <div style={{ background: 'rgba(15, 23, 42, 0.75)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px 18px', marginBottom: '14px' }}>
          <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '900', color: '#f8fafc' }}>{t.prof.recentOrders}</h4>
          {myOrders.slice(0, 3).map((o) => {
            const match = catalog.find((pr) => o.service_name && pr.title && o.service_name.includes(pr.title));
            return (
            <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', padding: '9px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <Link href={`/track?id=${o.order_id}`} style={{ minWidth: 0, flex: 1, textDecoration: 'none' }}>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.service_name}</span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>#{o.order_id}</span>
              </Link>
              <span style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                <span style={{ fontSize: '12px', fontWeight: '900', color: '#a6f36a' }}>৳{o.price}</span>
                <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'capitalize', display: 'inline-flex', alignItems: 'center' }}><span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', marginRight: '5px', background: { pending: '#fbbf24', verifying: '#38bdf8', processing: '#a78bfa', completed: '#4ade80', cancelled: '#f87171' }[o.status] || '#94a3b8' }} />{o.status}</span>
                {match && (
                  <Link href={`/product/${match.id}`} style={{ display: 'inline-block', marginTop: '2px', fontSize: '10px', fontWeight: '800', color: '#a6f36a', textDecoration: 'none', border: '1px solid rgba(166,243,106,0.4)', padding: '3px 10px', borderRadius: '999px', background: 'rgba(166,243,106,0.08)' }}>{t.shop.buyAgain}</Link>
                )}
              </span>
            </div>
            );
          })}
        </div>
      )}

      {/* My Orders শর্টকাট বাটন */}
      <Link
        href="/orders"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '14px 18px',
          textDecoration: 'none',
          marginBottom: '14px',
          color: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Icon name="box" size={17} color="#a6f36a" />
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc' }}>{t.prof.myOrders}</span>
        </div>
        <span style={{ color: '#64748b', fontSize: '14px' }}>→</span>
      </Link>

      <Link
        href="/wishlist"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '14px 18px',
          textDecoration: 'none',
          marginBottom: '14px',
          color: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Icon name="heart" size={17} color="#f87171" />
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc' }}>{t.shop.wishlist}</span>
        </div>
        <span style={{ color: '#64748b', fontSize: '14px' }}>→</span>
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
        <Link href="/track" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '14px', background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#f8fafc', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none' }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}><Icon name="search" size={15} /> {t.footer.trackOrder}</span>
        </Link>
        <a href="https://wa.me/8801319760720" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '14px', background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.35)', color: '#4ade80', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none' }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}><Icon name="message" size={15} /> {t.prof.support}</span>
        </a>
      </div>

      {/* লগআউট বাটন */}
      <button
        onClick={handleLogout}
        style={{
          width: '100%',
          padding: '12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          borderRadius: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '13px',
          transition: 'background 0.2s',
        }}
      >
        {t.prof.logout}
      </button>

    </div>
  );
}
