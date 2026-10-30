'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    alert('ডাটাবেজ কানেকশন পরবর্তী ধাপে সম্পন্ন করা হবে।');
  };

  return (
    <div style={{ padding: '24px 16px', maxWidth: '400px', margin: '20px auto' }}>
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '26px 20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 6px', color: '#0f172a' }}>লগইন করুন</h2>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px' }}>আপনার Hub Cart অ্যাকাউন্টে প্রবেশ করুন</p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>মোবাইল নম্বর</label>
            <input
              required
              type="text"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>পাসওয়ার্ড</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <button
            type="submit"
            style={{ width: '100%', padding: '12px', background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginBottom: '14px' }}
          >
            লগইন
          </button>
        </form>

        <div style={{ textAlign: 'center', margin: '14px 0', position: 'relative' }}>
          <span style={{ background: '#fff', padding: '0 10px', color: '#94a3b8', fontSize: '12px', position: 'relative', zIndex: 1 }}>অথবা</span>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#e2e8f0' }}></div>
        </div>

        <button
          onClick={() => alert('Google Login পরবর্তী ধাপে যুক্ত করা হবে।')}
          style={{ width: '100%', padding: '11px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#334155' }}
        >
          <span>🌐</span> Continue with Google
        </button>
      </div>
    </div>
  );
}
