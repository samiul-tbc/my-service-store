'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png';
const SUPABASE_URL = 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

export default function LoginPage() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

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
      if (!res.ok) throw new Error(data.error_description || data.msg || data.message || 'রেজিস্ট্রেশন হয়নি');

      alert('✅ অ্যাকাউন্ট তৈরি সফল হয়েছে! এখন লগইন করুন।');
      setIsLoginMode(true);
      setPassword('');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || data.msg || data.message || 'ইমেইল বা পাসওয়ার্ড ভুল');

      const userData = {
        token: data.access_token,
        email: data.user?.email,
        name: data.user?.user_metadata?.full_name || 'Customer',
        phone: data.user?.user_metadata?.phone || '',
      };
      localStorage.setItem('hubcart_user', JSON.stringify(userData));

      window.location.href = '/profile';
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
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
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
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '44px', height: '44px', objectFit: 'contain', margin: '0 auto 6px', filter: 'drop-shadow(0 2px 8px rgba(59, 130, 246, 0.4))' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '900', margin: '0 0 4px', color: '#f8fafc' }}>Hub Cart</h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
            {isLoginMode ? 'প্রিমিয়াম অ্যাকাউন্টে লগইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
          </p>
        </div>

        {/* ট্যাব সুইচ */}
        <div style={{ display: 'flex', background: 'rgba(30, 41, 59, 0.6)', padding: '4px', borderRadius: '12px', marginBottom: '18px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <button
            type="button"
            onClick={() => { setIsLoginMode(true); setErrorMsg(''); }}
            style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', background: isLoginMode ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'transparent', color: isLoginMode ? '#ffffff' : '#64748b' }}
          >
            লগইন
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginMode(false); setErrorMsg(''); }}
            style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', background: !isLoginMode ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'transparent', color: !isLoginMode ? '#ffffff' : '#64748b' }}
          >
            রেজিস্ট্রেশন
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '12px', marginBottom: '14px', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={isLoginMode ? handleLogin : handleSignUp}>
          {!isLoginMode && (
            <>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>আপনার নাম *</label>
                <input required type="text" placeholder="যেমন: Samiul Islam" value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>WhatsApp নম্বর *</label>
                <input required type="text" maxLength={11} placeholder="017XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
              </div>
            </>
          )}

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>ইমেইল *</label>
            <input required type="email" placeholder="example@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>পাসওয়ার্ড *</label>
            <input required type="password" minLength={6} placeholder="কমপক্ষে ৬ ডিজিট" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
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
            {loading ? 'প্রসেসিং হচ্ছে...' : isLoginMode ? 'লগইন করুন' : 'অ্যাকাউন্ট তৈরি করুন'}
          </button>
        </form>
      </div>
    </div>
  );
}
