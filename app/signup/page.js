'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const validateBdPhone = (p) => /^(013|014|015|016|017|018|019)\d{8}$/.test(p.trim());

  const handleSignup = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateBdPhone(phone)) {
      setErrorMsg('মোবাইল নম্বর অবশ্যই 013-019 দিয়ে শুরু এবং মোট ১১ ডিজিট হতে হবে।');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('পাসওয়ার্ড কমপক্ষে ৬ ডিজিটের হতে হবে।');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('কনফার্ম পাসওয়ার্ড মূল পাসওয়ার্ডের সাথে মেলেনি!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`অ্যাকাউন্ট তৈরি হয়েছে!\nনাম: ${name}\nনম্বর: ${phone}`);
      window.location.href = '/login';
    }, 800);
  };

  return (
    <div style={{ padding: '30px 14px', maxWidth: '420px', margin: '15px auto' }}>
      <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '26px 20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        
        {/* লোগো ও হেডার */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src="https://i.postimg.cc/4Y3TK6bN/5707.png"
            alt="Hub Cart"
            style={{ width: '48px', height: '48px', objectFit: 'contain', margin: '0 auto 8px', display: 'block' }}
          />
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px', color: '#0f172a' }}>অ্যাকাউন্ট তৈরি করুন</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Hub Cart-এ রেজিস্ট্রেশন সম্পন্ন করুন</p>
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>
              আপনার নাম *
            </label>
            <input
              required
              type="text"
              placeholder="পুরো নাম লিখুন"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>
              মোবাইল নম্বর *
            </label>
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
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>
              ইমেইল (ঐচ্ছিক)
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>
              পাসওয়ার্ড *
            </label>
            <input
              required
              type="password"
              placeholder="কমপক্ষে ৬ ডিজিট"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>
              কনফার্ম পাসওয়ার্ড *
            </label>
            <input
              required
              type="password"
              placeholder="পুনরায় পাসওয়ার্ড দিন"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
          >
            {loading ? 'প্রসেসিং হচ্ছে...' : 'সাইন আপ করুন'}
          </button>
        </form>

        {/* লগইন পেজের লিংক */}
        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', fontSize: '13px', color: '#64748b' }}>
          আগে থেকেই অ্যাকাউন্ট আছে?{' '}
          <Link href="/login" style={{ color: '#4f46e5', fontWeight: 'bold', textDecoration: 'none' }}>
            লগইন করুন
          </Link>
        </div>

      </div>
    </div>
  );
                          }
