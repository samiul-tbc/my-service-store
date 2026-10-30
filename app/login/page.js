'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  const [successMsg, setSuccessMsg] = useState('');

  // সাইন-আপ হ্যান্ডলার
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
        throw new Error(data.error_description || data.msg || data.message || 'রেজিস্ট্রেশন হয়নি');
      }

      alert('✅ অ্যাকাউন্ট তৈরি সফল হয়েছে! এখন এই তথ্য দিয়ে লগইন করুন।');
      setIsLoginMode(true);
      setPassword('');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // লগইন হ্যান্ডলার
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

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

      if (!res.ok) {
        throw new Error(data.error_description || data.msg || data.message || 'ইমেইল বা পাসওয়ার্ড ভুল');
      }

      // সেশন সেভ করা
      const userData = {
        token: data.access_token,
        email: data.user?.email,
        name: data.user?.user_metadata?.full_name || 'Customer',
        phone: data.user?.user_metadata?.phone || '',
      };
      localStorage.setItem('hubcart_user', JSON.stringify(userData));

      alert(`✅ স্বাগতম ${userData.name}! আপনি সফলভাবে লগইন হয়েছেন।`);
      router.push('/profile'); // সরাসরি প্রোফাইলে নিয়ে যাবে
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '380px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '48px', height: '48px', objectFit: 'contain', margin: '0 auto 6px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px', color: '#0f172a' }}>Hub Cart</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            {isLoginMode ? 'লগইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
          </p>
        </div>

        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '10px', marginBottom: '18px' }}>
          <button
            type="button"
            onClick={() => { setIsLoginMode(true); setErrorMsg(''); }}
            style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '7px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', background: isLoginMode ? '#fff' : 'transparent', color: isLoginMode ? '#0f172a' : '#64748b' }}
          >
            লগইন
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginMode(false); setErrorMsg(''); }}
            style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '7px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', background: !isLoginMode ? '#fff' : 'transparent', color: !isLoginMode ? '#0f172a' : '#64748b' }}
          >
            রেজিস্ট্রেশন
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '12px', marginBottom: '14px', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={isLoginMode ? handleLogin : handleSignUp}>
          {!isLoginMode && (
            <>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>আপনার নাম *</label>
                <input required type="text" placeholder="যেমন: Samiul Islam" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>WhatsApp নম্বর *</label>
                <input required type="text" maxLength={11} placeholder="017XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
              </div>
            </>
          )}

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>ইমেইল *</label>
            <input required type="email" placeholder="example@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>পাসওয়ার্ড *</label>
            <input required type="password" minLength={6} placeholder="কমপক্ষে ৬ ডিজিট" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
            {loading ? 'অপেক্ষা করুন...' : isLoginMode ? 'লগইন করুন' : 'অ্যাকাউন্ট তৈরি করুন'}
          </button>
        </form>
      </div>
    </div>
  );
}
