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
    if (confirm('আপনি কি নিশ্চিত যে অ্যাকাউন্ট থেকে লগআউট করতে চান?')) {
      localStorage.removeItem('hubcart_user');
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
        প্রোফাইল লোড হচ্ছে...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ maxWidth: '420px', margin: '50px auto', padding: '32px 20px', textAlign: 'center', background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '64px', height: '64px', objectFit: 'contain', marginBottom: '14px' }} />
        <h3 style={{ margin: '0 0 6px', color: '#0f172a', fontSize: '18px', fontWeight: 'bold' }}>অ্যাকাউন্টে লগইন করা নেই</h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 }}>
          আপনার অর্ডার ট্র্যাক করতে এবং প্রিমিয়াম সার্ভিস নিতে লগইন করুন।
        </p>
        <Link href="/login" style={{ display: 'inline-block', width: '80%', padding: '12px', background: '#2563eb', color: '#ffffff', textDecoration: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)' }}>
          লগইন / সাইন-আপ করুন
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '460px', margin: '14px auto', padding: '0 14px' }}>
      
      {/* ১. প্রিমিয়াম মেম্বারশিপ ভিআইপি কার্ড */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '24px',
        padding: '24px',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 28px rgba(15, 23, 42, 0.25)',
        marginBottom: '16px'
      }}>
        {/* ব্যাকগ্রাউন্ড ওয়াটারমার্ক লোগো */}
        <img
          src={LOGO_HUB_CART}
          alt="Watermark"
          style={{
            position: 'absolute',
            right: '-15px',
            bottom: '-20px',
            width: '120px',
            height: '120px',
            opacity: 0.12,
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <div>
              <span style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '0.5px' }}>Hub Cart</span>
              <span style={{ display: 'block', fontSize: '8px', color: '#38bdf8', letterSpacing: '1px', fontWeight: 'bold' }}>VIP MEMBER</span>
            </div>
          </div>
          <span style={{ background: 'rgba(34, 197, 94, 0.2)', border: '1px solid #22c55e', color: '#4ade80', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
            ● Verified
          </span>
        </div>

        {/* ইউজার অ্যাভাটার ও নাম */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            border: '2px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: '900',
            color: '#fff',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '19px', fontWeight: 'bold', margin: '0 0 4px' }}>{user.name}</h2>
            <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Hub Cart ডিজিটাল ক্লায়েন্ট</p>
          </div>
        </div>
      </div>

      {/* ২. যোগাযোগের তথ্য কার্ড */}
      <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '18px 20px', marginBottom: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <h4 style={{ margin: '0 0 14px', fontSize: '13px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          অ্যাকাউন্ট বিবরণ
        </h4>

        {/* ইমেইল */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
            ✉️
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>রেজিস্টার্ড ইমেইল</span>
            <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '600' }}>{user.email}</span>
          </div>
        </div>

        {/* WhatsApp নম্বর */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
            📱
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>WhatsApp নম্বর</span>
            <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '600' }}>{user.phone || 'যুক্ত করা নেই'}</span>
          </div>
        </div>
      </div>

      {/* ৩. কুইক অ্যাকশন মেনু */}
      <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '10px', marginBottom: '16px' }}>
        <a
          href="https://wa.me/8801700000000"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '12px', color: '#0f172a', fontSize: '13px', fontWeight: '600' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>💬</span> 24/7 WhatsApp হেল্পলাইন
          </div>
          <span style={{ color: '#94a3b8' }}>›</span>
        </a>

        <Link
          href="/cart"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '12px', color: '#0f172a', fontSize: '13px', fontWeight: '600' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🛒</span> আমার অর্ডার ও কার্ট
          </div>
          <span style={{ color: '#94a3b8' }}>›</span>
        </Link>
      </div>

      {/* ৪. লগআউট বাটন */}
      <button
        onClick={handleLogout}
        style={{
          width: '100%',
          padding: '13px',
          background: '#ffffff',
          border: '1px solid #fecaca',
          color: '#ef4444',
          borderRadius: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '13px',
          boxShadow: '0 2px 6px rgba(239, 68, 68, 0.08)'
        }}
      >
        🚪 লগআউট করুন
      </button>

    </div>
  );
}
