'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png';

const SUPABASE_URL = 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

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

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '380px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        
        {/* লোগো ও হেডার */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '50px', height: '50px', objectFit: 'contain', margin: '0 auto 6px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px', color: '#0f172a' }}>Hub Cart</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>নতুন অ্যাকাউন্ট তৈরি করুন</p>
        </div>

        {/* এরর বা সাকসেস মেসেজ */}
        {errorMsg && (
          <div style={{ padding: '10px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '12px', marginBottom: '14px', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div style={{ padding: '10px', borderRadius: '8px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', fontSize: '12px', marginBottom: '14px', textAlign: 'center' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSignUp}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>আপনার পূর্ণ নাম *</label>
            <input
              required
              type="text"
              placeholder="যেমন: Samiul Islam"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>WhatsApp নম্বর *</label>
            <input
              required
              type="text"
              maxLength={11}
              placeholder="017XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>ইমেইল ঠিকানা *</label>
            <input
              required
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>পাসওয়ার্ড *</label>
            <input
              required
              type="password"
              minLength={6}
              placeholder="কমপক্ষে ৬ ডিজিটের পাসওয়ার্ড"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            {loading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'সাইন-আপ করুন'}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
          আগে থেকেই অ্যাকাউন্ট আছে?{' '}
          <Link href="/login" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}>
            লগইন করুন
          </Link>
        </div>

      </div>
    </div>
  );
}
