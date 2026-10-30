'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const validateBdPhone = (p) => /^(013|014|015|016|017|018|019)\d{8}$/.test(p.trim());

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateBdPhone(phone)) {
      setErrorMsg('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (013-019)।');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`লগইন সম্পন্ন!\nনম্বর: ${phone}`);
    }, 800);
  };

  return (
    <div style={{ padding: '30px 14px', maxWidth: '400px', margin: '20px auto' }}>
      <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '26px 20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        
        {/* লোগো ও হেডার */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <img
            src="https://i.postimg.cc/4Y3TK6bN/5707.png"
            alt="Hub Cart"
            style={{ width: '48px', height: '48px', objectFit: 'contain', margin: '0 auto 8px', display: 'block' }}
          />
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px', color: '#0f172a' }}>লগইন করুন</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>আপনার Hub Cart অ্যাকাউন্টে প্রবেশ করুন</p>
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>
              মোবাইল নম্বর *
            </label>
            <input
              required
              type="text"
              maxLength={11}
              placeholder="017XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#334155' }}>
              পাসওয়ার্ড *
            </label>
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
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
          >
            {loading ? 'প্রবেশ করা হচ্ছে...' : 'লগইন'}
          </button>
        </form>

        {/* সাইন আপ পেজের লিংক */}
        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', fontSize: '13px', color: '#64748b' }}>
          নতুন কাস্টমার?{' '}
          <Link href="/signup" style={{ color: '#4f46e5', fontWeight: 'bold', textDecoration: 'none' }}>
            অ্যাকাউন্ট তৈরি করুন (Sign Up)
          </Link>
        </div>

      </div>
    </div>
  );
}
