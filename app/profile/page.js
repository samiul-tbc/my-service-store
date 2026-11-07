'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
    <div style={{ maxWidth: '460px', margin: '14px auto', padding: '0 14px 90px' }}>
      
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
      </div>

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
          <span style={{ fontSize: '16px' }}>📦</span>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc' }}>{t.prof.myOrders}</span>
        </div>
        <span style={{ color: '#64748b', fontSize: '14px' }}>→</span>
      </Link>

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
