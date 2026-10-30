'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('hubcart_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    if (confirm('অ্যাকাউন্ট থেকে লগআউট করতে চান?')) {
      localStorage.removeItem('hubcart_user');
      window.location.href = '/';
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>প্রোফাইল লোড হচ্ছে...</div>;
  }

  if (!user) {
    return (
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '32px 20px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '56px', height: '56px', objectFit: 'contain', marginBottom: '14px' }} />
        <h3 style={{ margin: '0 0 6px', color: '#f8fafc', fontSize: '18px' }}>অ্যাকাউন্টে লগইন নেই</h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px' }}>অর্ডার হিস্ট্রি ও প্রোফাইল দেখতে লগইন করুন।</p>
        <Link href="/login" style={{ display: 'inline-block', width: '80%', padding: '12px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#ffffff', textDecoration: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px' }}>
          লগইন / সাইন-আপ
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '460px', margin: '14px auto', padding: '0 14px 80px' }}>
      
      {/* ভিআইপি মেম্বার কার্ড */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <span style={{ fontSize: '13px', fontWeight: '900', color: '#f8fafc' }}>Hub Cart VIP</span>
          </div>
          <span style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#4ade80', fontSize: '10px', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
            ● Verified
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '900', color: '#fff' }}>
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px', color: '#f8fafc' }}>{user.name}</h2>
            <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Hub Cart ক্লায়েন্ট</p>
          </div>
        </div>
      </div>

      {/* অ্যাকাউন্ট ইনফো */}
      <div style={{ background: 'rgba(15, 23, 42, 0.75)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '18px', marginBottom: '14px' }}>
        <div style={{ paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '13px' }}>
          <span style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>ইমেইল</span>
          <span style={{ color: '#f8fafc' }}>{user.email}</span>
        </div>
        <div style={{ paddingTop: '12px', fontSize: '13px' }}>
          <span style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>WhatsApp নম্বর</span>
          <span style={{ color: '#f8fafc' }}>{user.phone || 'যুক্ত করা নেই'}</span>
        </div>
      </div>

      {/* লগআউট */}
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
          fontSize: '13px'
        }}
      >
        লগআউট করুন
      </button>

    </div>
  );
}
