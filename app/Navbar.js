'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import LanguageToggle from '../components/LanguageToggle';

const LOGO_HUB_CART = 'https://i.postimg.cc/ZRRgvqSQ/20261030-234214.png';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('hubcart_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 90,
      background: 'rgba(11, 15, 25, 0.88)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '10px 14px',
    }}>
      <div style={{
        maxWidth: '640px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        
        {/* লোগো */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <div>
            <span style={{ fontSize: '15px', fontWeight: '900', color: '#f8fafc', display: 'block', lineHeight: 1.1 }}>
              Hub Cart
            </span>
            <span style={{ fontSize: '8px', fontWeight: 'bold', color: '#38bdf8', letterSpacing: '0.5px' }}>
              PREMIUM STORE
            </span>
          </div>
        </Link>

        {/* ডানপাশের আইকনসমূহ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          
          {/* ভাষা বাটন */}
          <LanguageToggle />

          {/* সার্চ বাটন */}
          <Link href="/orders" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Link>

          {/* মেমো বাটন */}
          <Link href="/orders" style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </Link>

          {/* ইউজার ব্যাজ */}
          <Link
            href="/profile"
            style={{
              textDecoration: 'none',
              background: 'rgba(37, 99, 235, 0.2)',
              border: '1px solid rgba(37, 99, 235, 0.4)',
              borderRadius: '20px',
              padding: '3px 8px 3px 4px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: '900',
            }}>
              {user?.name ? user.name[0].toUpperCase() : 'S'}
            </div>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#f8fafc', maxWidth: '65px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name ? user.name.split(' ')[0] : 'Samiul'}
            </span>
          </Link>

        </div>

      </div>
    </header>
  );
}
