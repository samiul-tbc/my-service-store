'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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
    localStorage.removeItem('hubcart_user');
    setUser(null);
    alert('লগআউট করা হয়েছে!');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>লোড হচ্ছে...</div>;
  }

  if (!user) {
    return (
      <div style={{ maxWidth: '400px', margin: '40px auto', padding: '24px', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>👤</div>
        <h3 style={{ margin: '0 0 8px', color: '#0f172a' }}>আপনি লগইন করেননি</h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 18px' }}>আপনার অ্যাকাউন্টের তথ্য দেখতে লগইন করুন।</p>
        <Link href="/login" style={{ display: 'inline-block', padding: '10px 24px', background: '#2563eb', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' }}>
          লগইন / সাইন-আপ করুন
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '16px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px', color: '#0f172a' }}>{user.name}</h2>
            <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>● Active Account</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#334155', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginBottom: '20px' }}>
          <div><strong>📧 ইমেইল:</strong> {user.email}</div>
          {user.phone && <div><strong>📱 WhatsApp:</strong> {user.phone}</div>}
        </div>

        <button
          onClick={handleLogout}
          style={{ width: '100%', padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
        >
          লগআউট করুন
        </button>
      </div>
    </div>
  );
}
