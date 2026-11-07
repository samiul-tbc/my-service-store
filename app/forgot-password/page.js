'use client';
import { useState } from 'react';
import Link from 'next/link';

// Login পেজের মতোই একই Supabase কনফিগ প্যাটার্ন
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRecover = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      // Supabase Auth password recovery — অ্যাকাউন্টে রিসেট লিংকসহ ইমেইল পাঠায়।
      // (ড্যাশবোর্ডে Auth → URL Configuration-এ সাইটের URL অনুমোদিত থাকতে হবে।)
      const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error_description || data.msg || data.message || 'কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন');
      }
      // অ্যাকাউন্ট আছে কিনা তা ফাঁস না করতে সবসময় একই সফল বার্তা দেখাই
      setSent(true);
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
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '24px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '900', margin: '0 0 4px', color: '#f8fafc' }}>পাসওয়ার্ড রিসেট</h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
            আপনার অ্যাকাউন্টের ইমেইল দিন — রিসেট লিংক পাঠিয়ে দেব
          </p>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '12px', marginBottom: '14px', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(166, 243, 106, 0.1)', border: '1px solid rgba(166, 243, 106, 0.3)', color: '#d9f99d', fontSize: '13px', lineHeight: 1.7, marginBottom: '16px' }}>
              ✅ এই ইমেইলে অ্যাকাউন্ট থাকলে রিসেট লিংক পাঠানো হয়েছে।
              <br />
              ইনবক্স ও Spam ফোল্ডার চেক করুন।
            </div>
            <Link href="/login" style={{ color: '#a6f36a', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
              ← লগইনে ফিরে যান
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRecover}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>ইমেইল *</label>
              <input
                required
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #a6f36a, #d2ffad)',
                color: '#10170c',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(166, 243, 106, 0.4)',
              }}
            >
              {loading ? 'পাঠানো হচ্ছে...' : 'রিসেট লিংক পাঠান'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '14px' }}>
              <Link href="/login" style={{ color: '#94a3b8', fontSize: '12px', textDecoration: 'none' }}>
                ← লগইনে ফিরে যান
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
