'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png';

// Vercel Environment Variables থেকে ডাটা নেওয়া হচ্ছে
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

export default function SignUpPage() {
  const router = useRouter();

  // ইনপুট স্টেট
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // স্ট্যাটাস স্টেট
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error_description || data.msg || data.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
      }

      setSuccessMsg('অ্যাকাউন্ট তৈরি সফল হয়েছে! লগইন পেজে নেওয়া হচ্ছে...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '11px 14px',
    borderRadius: '12px',
    background: 'rgba(30, 41, 59, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontSize: '13px',
    outline: 'none',
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(16px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '24px',
        boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
      }}>
        
        {/* লোগো ও হেডার */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src={LOGO_HUB_CART}
            alt="Hub Cart"
            style={{ width: '44px', height: '44px', objectFit: 'contain', margin: '0 auto 6px', filter: 'drop-shadow(0 2px 8px rgba(59, 130, 246, 0.4))' }}
          />
          <h2 style={{ fontSize: '20px', fontWeight: '900', margin: '0 0 4px', color: '#f8fafc' }}>Hub Cart</h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>নতুন অ্যাকাউন্ট তৈরি করুন</p>
        </div>

        {/* এরর বা সাকসেস মেসেজ */}
        {errorMsg && (
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '12px', marginBottom: '14px', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', fontSize: '12px', marginBottom: '14px', textAlign: 'center' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSignUp}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>আপনার পূর্ণ নাম *</label>
            <input
              required
              type="text"
              placeholder="যেমন: Samiul Islam"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>WhatsApp নম্বর *</label>
            <input
              required
              type="text"
              maxLength={11}
              placeholder="017XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>ইমেইল ঠিকানা *</label>
            <input
              required
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>পাসওয়ার্ড *</label>
            <input
              required
              type="password"
              minLength={6}
              placeholder="কমপক্ষে ৬ ডিজিটের পাসওয়ার্ড"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
            }}
          >
            {loading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
          আগে থেকেই অ্যাকাউন্ট আছে?{' '}
          <Link href="/login" style={{ color: '#38bdf8', fontWeight: 'bold', textDecoration: 'none' }}>
            লগইন করুন
          </Link>
        </div>

      </div>
    </div>
  );
}
