'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

const LOGO_HUB_CART = '/logo-icon.png';

// Vercel Environment Variables থেকে ডাটা নেওয়া হচ্ছে
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

const COUNTRY_CODES = [
  { code: '+880', flag: '🇧🇩', name: 'BD', placeholder: '1XXXXXXXXX' },
  { code: '+977', flag: '🇳🇵', name: 'NP', placeholder: '98XXXXXXXX' },
  { code: '+91',  flag: '🇮🇳', name: 'IN', placeholder: '9XXXXXXXXX' },
  { code: '+1',   flag: '🇺🇸', name: 'US', placeholder: 'XXXXXXXXXX' },
  { code: '+44',  flag: '🇬🇧', name: 'UK', placeholder: 'XXXXXXXXXX' },
];

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [fullName, setFullName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const friendlyError = (err) => {
    const m = String(err?.message || '');
    if (m.includes('Invalid login credentials')) return t.auth.errInvalid;
    if (m.toLowerCase().includes('already registered') || m.toLowerCase().includes('already exists')) return t.auth.errExists;
    if (m.toLowerCase().includes('password should') || m.toLowerCase().includes('weak')) return t.auth.errWeak;
    if (m.includes('Failed to fetch') || m.includes('NetworkError')) return t.auth.errNetwork;
    return m && m.length < 120 ? m : t.auth.genericError;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // নম্বরের শুরুতে ভুল করে 0 দিলে তা বাদ দিয়ে আন্তর্জাতিক ফরম্যাট তৈরি করা
      const cleanPhone = phone.trim().replace(/^0+/, '');
      const fullPhoneNumber = `${selectedCountry.code}${cleanPhone}`;

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
            phone: fullPhoneNumber,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || data.msg || data.message || t.auth.signupFail);

      setSuccessMsg(t.auth.signupSuccess);
      setIsLoginMode(true);
      setPassword('');
    } catch (err) {
      setErrorMsg(friendlyError(err));
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
      if (!res.ok) throw new Error(data.error_description || data.msg || data.message || t.auth.loginFail);

      const userData = {
        token: data.access_token,
        email: data.user?.email,
        name: data.user?.user_metadata?.full_name || 'Customer',
        phone: data.user?.user_metadata?.phone || '',
      };
      localStorage.setItem('hubcart_user', JSON.stringify(userData));

      window.location.href = '/profile';
    } catch (err) {
      setErrorMsg(friendlyError(err));
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
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'radial-gradient(ellipse at 50% 30%, rgba(166, 243, 106, 0.08), transparent 55%)' }}>
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
          <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '44px', height: '44px', objectFit: 'contain', margin: '0 auto 6px', filter: 'drop-shadow(0 2px 8px rgba(166, 243, 106, 0.4))' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '900', margin: '0 0 4px', color: '#f8fafc' }}>Hub Cart</h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
            {isLoginMode ? t.auth.loginTitle : t.auth.signupTitle}
          </p>
        </div>

        {/* ট্যাব সুইচ */}
        <div style={{ display: 'flex', background: 'rgba(30, 41, 59, 0.6)', padding: '4px', borderRadius: '12px', marginBottom: '18px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <button
            type="button"
            onClick={() => { setIsLoginMode(true); setErrorMsg(''); setSuccessMsg(''); }}
            style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', background: isLoginMode ? 'linear-gradient(135deg, #a6f36a, #d2ffad)' : 'transparent', color: isLoginMode ? '#10170c' : '#64748b' }}
          >
            {t.auth.loginTab}
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginMode(false); setErrorMsg(''); setSuccessMsg(''); }}
            style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', background: !isLoginMode ? 'linear-gradient(135deg, #a6f36a, #d2ffad)' : 'transparent', color: !isLoginMode ? '#10170c' : '#64748b' }}
          >
            {t.auth.signupTab}
          </button>
        </div>

        {successMsg && (
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.35)', color: '#4ade80', fontSize: '12px', marginBottom: '14px', textAlign: 'center' }}>
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '12px', marginBottom: '14px', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={isLoginMode ? handleLogin : handleSignUp}>
          {!isLoginMode && (
            <>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>{t.auth.name}</label>
                <input required type="text" autoComplete="name" placeholder={t.auth.namePlaceholder} value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} />
              </div>

              {/* WhatsApp নম্বর কান্ট্রি কোড সহ */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>{t.auth.whatsapp}</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const country = COUNTRY_CODES.find((c) => c.code === e.target.value);
                      if (country) setSelectedCountry(country);
                    }}
                    style={{
                      background: 'rgba(30, 41, 59, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      padding: '11px 8px',
                      outline: 'none',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code} style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>

                  <input
                    required
                    type="tel"
                    placeholder={selectedCountry.placeholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                </div>
              </div>
            </>
          )}

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>{t.auth.email}</label>
            <input required type="email" autoComplete="email" placeholder="example@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>{t.auth.password}</label>
            <div style={{ position: 'relative' }}>
              <input required type={showPw ? 'text' : 'password'} minLength={6} autoComplete={isLoginMode ? 'current-password' : 'new-password'} placeholder={t.auth.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inputStyle, paddingRight: '42px' }} />
              <button type="button" onClick={() => setShowPw((v) => !v)} aria-label="Toggle password visibility" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', padding: '4px' }}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            {!isLoginMode && password && (() => {
              let score = 0;
              if (password.length >= 6) score++;
              if (password.length >= 10) score++;
              if (/\d/.test(password)) score++;
              if (/[^A-Za-z0-9]/.test(password) || /[A-Z]/.test(password)) score++;
              const lvl = score <= 1 ? { w: '33%', col: '#f87171', label: t.auth.pwWeak } : score === 2 ? { w: '66%', col: '#fbbf24', label: t.auth.pwMedium } : { w: '100%', col: '#4ade80', label: t.auth.pwStrong };
              return (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ height: '5px', borderRadius: '99px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: lvl.w, background: lvl.col, borderRadius: '99px', transition: 'width 0.25s ease' }} />
                  </div>
                  <span style={{ fontSize: '10px', color: lvl.col, fontWeight: 'bold' }}>{t.auth.pwLabel}: {lvl.label}</span>
                </div>
              );
            })()}
          </div>

          {isLoginMode && (
            <div style={{ textAlign: 'right', margin: '-8px 0 14px' }}>
              <Link href="/forgot-password" style={{ color: '#a6f36a', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>
                {t.auth.forgot}
              </Link>
            </div>
          )}

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
            {loading ? t.auth.processing : isLoginMode ? t.auth.loginBtn : t.auth.signupBtn}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link href="/" style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'none', fontWeight: 'bold' }}>{t.auth.backToStore}</Link>
        </div>
      </div>
    </div>
  );
}
