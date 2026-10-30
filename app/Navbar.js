'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/ZRRgvqSQ/20261030-234214.png';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
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
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* ব্র্যান্ড লোগো */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <img
          src={LOGO_HUB_CART}
          alt="Hub Cart"
          style={{ width: '34px', height: '34px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(59, 130, 246, 0.4))' }}
        />
        <div>
          <span style={{ fontWeight: '900', fontSize: '18px', color: '#f8fafc', letterSpacing: '-0.3px', display: 'block', lineHeight: 1.1 }}>
            Hub Cart
          </span>
          <span style={{ fontSize: '8px', fontWeight: '800', color: '#38bdf8', letterSpacing: '1.2px' }}>
            PREMIUM STORE
          </span>
        </div>
      </Link>

      {/* নেভিগেশন অ্যাকশন */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link href="/categories" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', padding: '6px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </Link>

        <Link href="/cart" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', padding: '6px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </Link>

        {user ? (
          <Link
            href="/profile"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              padding: '4px 10px 4px 5px',
              borderRadius: '20px',
              color: '#f8fafc',
              fontWeight: '700',
              fontSize: '11px',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.2)'
            }}
          >
            <span style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 'bold'
            }}>
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </span>
            <span style={{ maxWidth: '65px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name?.split(' ')[0] || 'User'}
            </span>
          </Link>
        ) : (
          <Link
            href="/login"
            style={{
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 'bold',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              boxShadow: '0 2px 10px rgba(37, 99, 235, 0.35)'
            }}
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
