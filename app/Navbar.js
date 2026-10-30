'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // লোকাল স্টোরেজ থেকে লগইন চেক
    const checkUser = () => {
      const savedUser = localStorage.getItem('hubcart_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    // ট্যাব ফোকাস বা স্টোরেজ চেঞ্জ হ্যান্ডলার
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e2e8f0',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
    }}>
      {/* লোগো ও ব্র্যান্ড */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <img
          src={LOGO_HUB_CART}
          alt="Hub Cart"
          style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '10px' }}
        />
        <div>
          <span style={{ fontWeight: '900', fontSize: '18px', color: '#0f172a', letterSpacing: '-0.5px' }}>Hub Cart</span>
          <span style={{ display: 'block', fontSize: '9px', fontWeight: 'bold', color: '#3b82f6', letterSpacing: '0.8px', marginTop: '-2px' }}>PREMIUM STORE</span>
        </div>
      </Link>

      {/* নেভিগেশন ও প্রোফাইল বাটন */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/categories" style={{ textDecoration: 'none', fontSize: '18px', color: '#64748b', padding: '6px' }}>
          🔍
        </Link>
        <Link href="/cart" style={{ textDecoration: 'none', fontSize: '18px', color: '#64748b', padding: '6px' }}>
          🛒
        </Link>

        {user ? (
          /* লগইন করা থাকলে ইউজারের প্রোফাইল ব্যাজ */
          <Link
            href="/profile"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              padding: '5px 10px 5px 6px',
              borderRadius: '20px',
              color: '#0f172a',
              fontWeight: 'bold',
              fontSize: '12px'
            }}
          >
            <span style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px'
            }}>
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </span>
            <span style={{ maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name?.split(' ')[0] || 'User'}
            </span>
          </Link>
        ) : (
          /* লগইন না থাকলে Login বাটন */
          <Link
            href="/login"
            style={{
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              padding: '7px 16px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 'bold',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
            }}
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
